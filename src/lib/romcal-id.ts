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

const SEASON_SHORT: Record<string, string> = {
  ordinarytime: "Biasa",
  advent: "Adven",
  lent: "Prapaskah",
  easter: "Paskah",
  eastertide: "Paskah",
};

const ROMAN = [
  "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
  "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
  "XXXI", "XXXII", "XXXIII", "XXXIV",
];

// Ordered longest-first so multi-word descriptors are replaced before their parts.
const TITLE_REPLACEMENTS: [RegExp, string][] = [
  [/Doctor of the Church/gi, "Pujangga Gereja"],
  [/, Patron of Europe/gi, ", Pelindung Eropa"],
  [/and Companions/gi, "dan kawan-kawan"],
  [/Priests?/g, "Imam"],
  [/Bishops?/g, "Uskup"],
  [/Popes?/g, "Paus"],
  [/Abbots?/g, "Abas"],
  [/Martyrs?/g, "Martir"],
  [/Virgins?/g, "Perawan"],
  [/Apostles?/g, "Rasul"],
  [/Evangelists?/g, "Penginjil"],
  [/Deacons?/g, "Diakon"],
  [/Doctors?/g, "Pujangga"],
  [/Religious/g, "Biarawan"],
  [/Hermits?/g, "Pertapa"],
  [/Kings?/g, "Raja"],
  [/Queens?/g, "Ratu"],
  [/\bSaints\s+/g, "St. "],
  [/\bSaint\s+/g, "St. "],
  [/\bBlessed\s+/g, "Beato "],
  [/, and /g, ", dan "],
  [/ and /g, " dan "],
];

function translateSaintTitles(name: string): string {
  let result = name;
  for (const [pattern, replacement] of TITLE_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function translateGenericName(key: string, romcalName: string, season: string): string {
  if (NAME_MAP[key]) return NAME_MAP[key];

  // Sundays: "15th Sunday of Ordinary Time" -> "Hari Minggu Biasa XV"
  const sundayMatch =
    key.match(/^(\d+)(?:st|nd|rd|th)SundayOf(\w+)$/i) ??
    romcalName.match(/^(\d+)(?:st|nd|rd|th) Sunday of (?:the )?(.+)$/i);
  if (sundayMatch) {
    const week = Number(sundayMatch[1]);
    const seasonShort =
      SEASON_SHORT[sundayMatch[2].toLowerCase().replace(/\s+/g, "")] ?? sundayMatch[2];
    return `Hari Minggu ${seasonShort} ${ROMAN[week] ?? week}`;
  }

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

  // Saints and blesseds: translate the common title words, keep the name itself.
  if (/^(Saints?|Blessed|Our Lady)\b/.test(romcalName)) {
    return translateSaintTitles(romcalName);
  }

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
