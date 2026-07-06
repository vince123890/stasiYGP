import { getTodayLiturgicalDay, getLiturgicalCalendarRange } from "@/lib/queries";
import { getRomcalDay, getRomcalRange } from "@/lib/romcal-id";
import { jakartaDateString } from "@/lib/format";
import type { LiturgicalColor, LiturgicalDay } from "@/types/database";

export interface EffectiveReadings {
  first_reading: string | null;
  psalm: string | null;
  second_reading: string | null;
  gospel: string | null;
  office_reading: string | null;
}

export interface EffectiveLiturgicalDay {
  calendar_date: string;
  celebration_name: string;
  liturgical_color: LiturgicalColor;
  rank: string | null;
  readings: EffectiveReadings;
  source: "cms" | "romcal";
}

const EMPTY_READINGS: EffectiveReadings = {
  first_reading: null,
  psalm: null,
  second_reading: null,
  gospel: null,
  office_reading: null,
};

function fromCms(day: LiturgicalDay): EffectiveLiturgicalDay {
  return {
    calendar_date: day.calendar_date,
    celebration_name: day.celebration_name,
    liturgical_color: day.liturgical_color,
    rank: day.rank,
    readings: {
      first_reading: day.first_reading,
      psalm: day.psalm,
      second_reading: day.second_reading,
      gospel: day.gospel,
      office_reading: day.office_reading,
    },
    source: "cms",
  };
}

/** Today's liturgical day: manual CMS entry wins, otherwise computed locally via Romcal. */
export async function getEffectiveToday(): Promise<EffectiveLiturgicalDay | null> {
  const cms = await getTodayLiturgicalDay().catch(() => null);
  if (cms) return fromCms(cms);

  const computed = getRomcalDay(jakartaDateString());
  if (!computed) return null;

  return {
    calendar_date: computed.calendar_date,
    celebration_name: computed.celebration_name,
    liturgical_color: computed.liturgical_color,
    rank: computed.rank,
    readings: EMPTY_READINGS,
    source: "romcal",
  };
}

/** Date range: CMS entries win per date, otherwise filled in via Romcal. */
export async function getEffectiveRange(
  from: string,
  to: string
): Promise<EffectiveLiturgicalDay[]> {
  const [cmsDays, computedDays] = await Promise.all([
    getLiturgicalCalendarRange(from, to).catch(() => []),
    Promise.resolve(getRomcalRange(from, to)),
  ]);

  const byDate = new Map<string, EffectiveLiturgicalDay>();
  for (const day of computedDays) {
    byDate.set(day.calendar_date, {
      calendar_date: day.calendar_date,
      celebration_name: day.celebration_name,
      liturgical_color: day.liturgical_color,
      rank: day.rank,
      readings: EMPTY_READINGS,
      source: "romcal",
    });
  }
  for (const day of cmsDays) byDate.set(day.calendar_date, fromCms(day));

  return [...byDate.values()].sort((a, b) => a.calendar_date.localeCompare(b.calendar_date));
}
