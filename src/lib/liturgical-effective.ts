import { getTodayLiturgicalDay, getLiturgicalCalendarRange } from "@/lib/queries";
import { getRomcalDay, getRomcalRange } from "@/lib/romcal-id";
import {
  fetchImankatolikDay,
  fetchImankatolikRange,
  type ImankatolikDay,
} from "@/lib/imankatolik";
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
  source: "cms" | "imankatolik" | "romcal";
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

/**
 * Merges imankatolik-scraped readings over the Romcal base for a given date.
 * imankatolik provides the Indonesian celebration name and reading references;
 * Romcal provides the rank and a reliable color fallback.
 */
function mergeImankatolik(
  date: string,
  imk: ImankatolikDay | undefined
): EffectiveLiturgicalDay {
  const romcal = getRomcalDay(date);

  const base: EffectiveLiturgicalDay = romcal
    ? {
        calendar_date: date,
        celebration_name: romcal.celebration_name,
        liturgical_color: romcal.liturgical_color,
        rank: romcal.rank,
        readings: EMPTY_READINGS,
        source: "romcal",
      }
    : {
        calendar_date: date,
        celebration_name: "Hari Biasa",
        liturgical_color: "hijau",
        rank: null,
        readings: EMPTY_READINGS,
        source: "romcal",
      };

  if (!imk) return base;

  return {
    calendar_date: date,
    celebration_name: imk.celebration_name || base.celebration_name,
    liturgical_color: imk.liturgical_color ?? base.liturgical_color,
    rank: base.rank,
    readings: {
      first_reading: imk.first_reading,
      psalm: imk.psalm,
      second_reading: imk.second_reading,
      gospel: imk.gospel,
      office_reading: imk.office_reading,
    },
    source: "imankatolik",
  };
}

/** Today's liturgical day: CMS (manual) > imankatolik (scrape) > Romcal (fallback). */
export async function getEffectiveToday(): Promise<EffectiveLiturgicalDay | null> {
  const today = jakartaDateString();

  const cms = await getTodayLiturgicalDay().catch(() => null);
  if (cms) return fromCms(cms);

  const imk = await fetchImankatolikDay(today);
  const merged = mergeImankatolik(today, imk ?? undefined);
  // Only return null if we genuinely have nothing (no romcal + no imankatolik).
  return merged;
}

/** Date range: CMS wins per date, then imankatolik, then Romcal base. */
export async function getEffectiveRange(
  from: string,
  to: string
): Promise<EffectiveLiturgicalDay[]> {
  const [cmsDays, imkDays, romcalDays] = await Promise.all([
    getLiturgicalCalendarRange(from, to).catch(() => []),
    fetchImankatolikRange(from, to),
    Promise.resolve(getRomcalRange(from, to)),
  ]);

  const imkByDate = new Map(imkDays.map((d) => [d.calendar_date, d]));
  const byDate = new Map<string, EffectiveLiturgicalDay>();

  // Base layer: Romcal for every date in the range.
  for (const day of romcalDays) {
    byDate.set(day.calendar_date, mergeImankatolik(day.calendar_date, imkByDate.get(day.calendar_date)));
  }
  // Ensure imankatolik-only dates (not produced by Romcal) are still present.
  for (const day of imkDays) {
    if (!byDate.has(day.calendar_date)) {
      byDate.set(day.calendar_date, mergeImankatolik(day.calendar_date, day));
    }
  }
  // Top layer: manual CMS entries win outright.
  for (const day of cmsDays) byDate.set(day.calendar_date, fromCms(day));

  return [...byDate.values()].sort((a, b) => a.calendar_date.localeCompare(b.calendar_date));
}
