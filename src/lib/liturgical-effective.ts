import { getTodayLiturgicalDay, getLiturgicalCalendarRange } from "@/lib/queries";
import { jakartaDateString } from "@/lib/format";
import {
  fetchImankatolikDay,
  fetchImankatolikRange,
  type ImankatolikDay,
} from "@/lib/imankatolik";
import type { LiturgicalColor, LiturgicalDay } from "@/types/database";

export interface EffectiveLiturgicalDay {
  calendar_date: string;
  celebration_name: string;
  liturgical_color: LiturgicalColor;
  rank: string | null;
  readings: string[];
  source: "cms" | "imankatolik";
}

function fromCms(day: LiturgicalDay): EffectiveLiturgicalDay {
  return {
    calendar_date: day.calendar_date,
    celebration_name: day.celebration_name,
    liturgical_color: day.liturgical_color,
    rank: day.rank,
    readings: [day.first_reading, day.psalm, day.second_reading, day.gospel].filter(
      (r): r is string => Boolean(r)
    ),
    source: "cms",
  };
}

function fromImankatolik(day: ImankatolikDay): EffectiveLiturgicalDay {
  return {
    calendar_date: day.calendar_date,
    celebration_name: day.celebration_name,
    liturgical_color: day.liturgical_color,
    rank: null,
    readings: day.readings,
    source: "imankatolik",
  };
}

/** Today's liturgical day: manual CMS entry wins, otherwise imankatolik.or.id. */
export async function getEffectiveToday(): Promise<EffectiveLiturgicalDay | null> {
  const cms = await getTodayLiturgicalDay().catch(() => null);
  if (cms) return fromCms(cms);

  const external = await fetchImankatolikDay(jakartaDateString());
  return external ? fromImankatolik(external) : null;
}

/** Date range: merges CMS entries (which win per date) over imankatolik data. */
export async function getEffectiveRange(
  from: string,
  to: string
): Promise<EffectiveLiturgicalDay[]> {
  const [cmsDays, externalDays] = await Promise.all([
    getLiturgicalCalendarRange(from, to).catch(() => []),
    fetchImankatolikRange(from, to),
  ]);

  const byDate = new Map<string, EffectiveLiturgicalDay>();
  for (const day of externalDays) byDate.set(day.calendar_date, fromImankatolik(day));
  for (const day of cmsDays) byDate.set(day.calendar_date, fromCms(day));

  return [...byDate.values()].sort((a, b) => a.calendar_date.localeCompare(b.calendar_date));
}
