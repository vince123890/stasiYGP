import type { LiturgicalColor } from "@/types/database";

// Data kalender liturgi Bahasa Indonesia diambil dari imankatolik.or.id,
// yang mengizinkan pengutipan dengan mencantumkan sumber (lihat footer situs).
// Selalu tampilkan atribusi "Sumber: imankatolik.or.id" di UI yang memakai data ini.

export const IMANKATOLIK_SOURCE_URL = "https://www.imankatolik.or.id";

export interface ImankatolikDay {
  calendar_date: string; // YYYY-MM-DD
  celebration_name: string;
  liturgical_color: LiturgicalColor;
  readings: string[];
}

const COLOR_MAP: Record<string, LiturgicalColor> = {
  hijau: "hijau",
  putih: "putih",
  merah: "merah",
  ungu: "ungu",
  "merah muda": "merah_muda",
  merahmuda: "merah_muda",
};

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function parseCell(cellHtml: string, year: number, month: number): ImankatolikDay | null {
  const colorMatch = cellHtml.match(/Warna\s+Liturgi\s+(Merah\s*Muda|Hijau|Putih|Merah|Ungu)/i);
  if (!colorMatch) return null;

  const color = COLOR_MAP[colorMatch[1].toLowerCase().replace(/\s+/g, " ").trim()];
  if (!color) return null;

  const text = stripTags(cellHtml);
  const dayMatch = text.match(/^\s*(\d{1,2})\b/);
  if (!dayMatch) return null;
  const day = Number(dayMatch[1]);
  if (day < 1 || day > 31) return null;

  // Readings are anchor texts linking to alkitabq.php
  const readings = [...cellHtml.matchAll(/<a[^>]*alkitabq\.php[^>]*>([^<]+)<\/a>/gi)]
    .map((m) => stripTags(m[1]))
    .filter(Boolean);

  // Celebration name: text after the day number, before the first reading ref / color line
  let celebration = text.slice(dayMatch[0].length);
  const firstReading = readings[0];
  if (firstReading) {
    const idx = celebration.indexOf(firstReading);
    if (idx > 0) celebration = celebration.slice(0, idx);
  }
  celebration = celebration
    .replace(/Warna\s+Liturgi.*$/i, "")
    .replace(/[;.,\s]+$/, "")
    .trim();

  if (!celebration) celebration = "Hari Biasa";

  const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { calendar_date: date, celebration_name: celebration, liturgical_color: color, readings };
}

/** Fetches and parses one month of the imankatolik.or.id liturgical calendar. Cached ~6h. */
export async function fetchImankatolikMonth(
  year: number,
  month: number
): Promise<ImankatolikDay[]> {
  try {
    const res = await fetch(
      `${IMANKATOLIK_SOURCE_URL}/kalender.php?b=${month}&t=${year}`,
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) return [];
    const html = await res.text();

    // Split into table cells; only cells containing "Warna Liturgi" are day entries.
    const cells = html.split(/<td/i).map((c) => "<td" + c);
    const days = new Map<string, ImankatolikDay>();
    for (const cell of cells) {
      if (!/Warna\s+Liturgi/i.test(cell)) continue;
      const parsed = parseCell(cell, year, month);
      // First occurrence wins (some cells repeat color for optional memorial alternatives)
      if (parsed && !days.has(parsed.calendar_date)) {
        days.set(parsed.calendar_date, parsed);
      }
    }
    return [...days.values()].sort((a, b) => a.calendar_date.localeCompare(b.calendar_date));
  } catch {
    return [];
  }
}

export async function fetchImankatolikDay(date: string): Promise<ImankatolikDay | null> {
  const [y, m] = date.split("-").map(Number);
  const month = await fetchImankatolikMonth(y, m);
  return month.find((d) => d.calendar_date === date) ?? null;
}

export async function fetchImankatolikRange(
  from: string,
  to: string
): Promise<ImankatolikDay[]> {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);

  const months: { y: number; m: number }[] = [{ y: fy, m: fm }];
  if (fy !== ty || fm !== tm) months.push({ y: ty, m: tm });

  const results = await Promise.all(months.map(({ y, m }) => fetchImankatolikMonth(y, m)));
  return results
    .flat()
    .filter((d) => d.calendar_date >= from && d.calendar_date <= to)
    .sort((a, b) => a.calendar_date.localeCompare(b.calendar_date));
}
