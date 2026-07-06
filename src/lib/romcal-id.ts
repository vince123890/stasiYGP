import { calendarFor, type RomcalDate } from "romcal";
import type { LiturgicalColor } from "@/types/database";

const COLOR_MAP: Record<string, LiturgicalColor> = {
  WHITE: "putih",
  RED: "merah",
  GREEN: "hijau",
  PURPLE: "ungu",
  ROSE: "merah_muda",
  GOLD: "putih",
  BLACK: "ungu",
};

const RANK_MAP: Record<string, string> = {
  SOLEMNITY: "Hari Raya",
  SUNDAY: "Hari Minggu",
  FEAST: "Pesta",
  MEMORIAL: "Peringatan Wajib",
  OPT_MEMORIAL: "Peringatan Fakultatif",
  FERIA: "Hari Biasa",
};

// Fixed, well-known celebrations translated verbatim (key -> Indonesian name).
const NAME_MAP: Record<string, string> = {
  christmas: "Hari Raya Kelahiran Tuhan (Natal)",
  epiphany: "Hari Raya Penampakan Tuhan (Epifani)",
  baptismOfTheLord: "Pesta Pembaptisan Tuhan",
  presentationOfTheLord: "Pesta Yesus Dipersembahkan di Kenisah",
  ashWednesday: "Rabu Abu",
  palmSunday: "Hari Minggu Palma",
  holyThursday: "Kamis Putih",
  goodFriday: "Jumat Agung",
  holySaturday: "Sabtu Suci",
  easter: "Hari Raya Paskah",
  divineMercySunday: "Hari Minggu Kerahiman Ilahi",
  ascension: "Hari Raya Kenaikan Tuhan",
  pentecostSunday: "Hari Raya Pentakosta",
  trinitySunday: "Hari Raya Tritunggal Mahakudus",
  corpusChristi: "Hari Raya Tubuh dan Darah Kristus",
  sacredHeartOfJesus: "Hari Raya Hati Kudus Yesus",
  immaculateHeartOfMary: "Peringatan Hati Tak Bernoda Santa Perawan Maria",
  assumption: "Hari Raya Maria Diangkat ke Surga",
  immaculateConception: "Hari Raya Maria Dikandung Tanpa Noda",
  allSaints: "Hari Raya Semua Orang Kudus",
  allSouls: "Peringatan Arwah Semua Orang Beriman",
  christTheKing: "Hari Raya Kristus Raja Semesta Alam",
  josephHusbandOfMary: "Hari Raya Santo Yosef, Suami Maria",
  annunciation: "Hari Raya Kabar Sukacita",
  nativityOfJohnTheBaptist: "Hari Raya Kelahiran Santo Yohanes Pembaptis",
  peterAndPaulApostles: "Hari Raya Santo Petrus dan Paulus, Rasul",
  transfiguration: "Pesta Yesus Menampakkan Kemuliaan-Nya",
  triumphOfTheCross: "Pesta Salib Suci Dimuliakan",
};

const SEASON_MAP: Record<string, string> = {
  Advent: "Masa Adven",
  Christmastide: "Masa Natal",
  Lent: "Masa Prapaskah",
  "Paschal Triduum": "Tri Hari Suci",
  Eastertide: "Masa Paskah",
  "Ordinary Time": "Masa Biasa",
};

function translateGenericName(key: string, romcalName: string, season: string): string {
  if (NAME_MAP[key]) return NAME_MAP[key];

  const weekMatch = key.match(/^(\d+)(?:st|nd|rd|th)WeekOf(OrdinaryTime|Advent|Lent|Easter)$/i);
  if (weekMatch) {
    const seasonId = SEASON_MAP[season] ?? season;
    return `Pekan ${weekMatch[1]} ${seasonId}`;
  }

  const dayMatch = romcalName.match(
    /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) of the (\d+)(?:st|nd|rd|th) week of (.+)$/i
  );
  if (dayMatch) {
    const dayNames: Record<string, string> = {
      Monday: "Senin",
      Tuesday: "Selasa",
      Wednesday: "Rabu",
      Thursday: "Kamis",
      Friday: "Jumat",
      Saturday: "Sabtu",
      Sunday: "Minggu",
    };
    return `${dayNames[dayMatch[1]] ?? dayMatch[1]} Pekan ${dayMatch[2]} ${SEASON_MAP[season] ?? season}`;
  }

  if (/^Hari Biasa/i.test(romcalName) || key.includes("feria")) return "Hari Biasa";

  // Fall back to the original English name — better than a broken translation.
  return romcalName;
}

export interface RomcalDayInfo {
  calendar_date: string;
  celebration_name: string;
  liturgical_color: LiturgicalColor;
  rank: string | null;
  season: string;
}

let cache: { year: number; data: RomcalDate[] } | null = null;

function getYear(year: number): RomcalDate[] {
  if (cache && cache.year === year) return cache.data;
  const data = calendarFor({ year, country: "general", locale: "en" });
  cache = { year, data };
  return data;
}

export function getRomcalDay(date: string): RomcalDayInfo | null {
  const year = Number(date.slice(0, 4));
  const entries = getYear(year).filter((d) => d.moment.slice(0, 10) === date);
  if (entries.length === 0) return null;

  // Prefer the highest-ranking celebration when multiple are listed for the day.
  const priority = ["SOLEMNITY", "SUNDAY", "FEAST", "MEMORIAL", "OPT_MEMORIAL", "FERIA"];
  const entry = entries.sort(
    (a, b) => priority.indexOf(a.type) - priority.indexOf(b.type)
  )[0];

  const colorKey = entry.data?.meta?.liturgicalColor?.key ?? "GREEN";
  const seasonName = entry.data?.season?.value ?? "Ordinary Time";

  return {
    calendar_date: date,
    celebration_name: translateGenericName(entry.key, entry.name, seasonName),
    liturgical_color: COLOR_MAP[colorKey] ?? "hijau",
    rank: RANK_MAP[entry.type] ?? null,
    season: SEASON_MAP[seasonName] ?? seasonName,
  };
}

export function getRomcalRange(from: string, to: string): RomcalDayInfo[] {
  const days: RomcalDayInfo[] = [];
  const cursor = new Date(from + "T00:00:00Z");
  const end = new Date(to + "T00:00:00Z");

  while (cursor <= end) {
    const dateStr = cursor.toISOString().slice(0, 10);
    const day = getRomcalDay(dateStr);
    if (day) days.push(day);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}
