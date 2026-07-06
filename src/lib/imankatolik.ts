import * as cheerio from "cheerio";
import type { LiturgicalColor } from "@/types/database";

// Data referensi bacaan liturgi diambil dari imankatolik.or.id, yang mengizinkan
// pengutipan dengan mencantumkan sumber (lihat footer situs mereka). Selalu
// tampilkan atribusi "Sumber: imankatolik.or.id" di UI yang memakai data ini.
//
// Parser ini mengikuti struktur halaman kalender.php yang terbukti dipakai oleh
// ekstensi VS Code open-source IlhamriSKY/Doa-Harian-Katolik (MIT): setiap hari
// berada dalam sel `.k_tbl_td`, dengan `.k_tgl`, `.k_perayaan`, `.k_alkitab a`,
// dan `.k_pakaian`.

export const IMANKATOLIK_SOURCE_URL = "https://www.imankatolik.or.id";

export interface ImankatolikDay {
  calendar_date: string; // YYYY-MM-DD
  celebration_name: string;
  liturgical_color: LiturgicalColor | null;
  first_reading: string | null;
  psalm: string | null;
  second_reading: string | null;
  gospel: string | null;
  office_reading: string | null;
}

const COLOR_MAP: Record<string, LiturgicalColor> = {
  hijau: "hijau",
  putih: "putih",
  merah: "merah",
  ungu: "ungu",
  "merah muda": "merah_muda",
};

const GOSPEL_BOOKS = /^(Mat|Mrk|Mark|Luk|Yoh|Yohanes|Matius|Markus|Lukas)\b/i;
const PSALM_BOOKS = /^(Mzm|Mazmur|Mz)\b/i;
const OFFICE_PREFIX = /^BcO\b/i;

function normalizeColor(raw: string): LiturgicalColor | null {
  const cleaned = raw
    .replace(/warna\s+liturgi/i, "")
    .replace(/[:.]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  return COLOR_MAP[cleaned] ?? null;
}

/** Splits an array of raw reading references into labelled slots. */
function classifyReadings(refs: string[]): {
  first_reading: string | null;
  psalm: string | null;
  second_reading: string | null;
  gospel: string | null;
  office_reading: string | null;
} {
  const result = {
    first_reading: null as string | null,
    psalm: null as string | null,
    second_reading: null as string | null,
    gospel: null as string | null,
    office_reading: null as string | null,
  };

  const nonReading = refs.filter((r) => {
    if (OFFICE_PREFIX.test(r)) {
      result.office_reading = r.replace(OFFICE_PREFIX, "").trim() || r;
      return false;
    }
    return true;
  });

  // Gospel: last reference that is a Gospel book.
  const gospelIdx = [...nonReading].reverse().findIndex((r) => GOSPEL_BOOKS.test(r));
  let gospelPos = -1;
  if (gospelIdx !== -1) {
    gospelPos = nonReading.length - 1 - gospelIdx;
    result.gospel = nonReading[gospelPos];
  }

  const rest = nonReading.filter((_, i) => i !== gospelPos);
  const nonPsalm: string[] = [];
  for (const r of rest) {
    if (!result.psalm && PSALM_BOOKS.test(r)) {
      result.psalm = r;
    } else {
      nonPsalm.push(r);
    }
  }

  if (nonPsalm[0]) result.first_reading = nonPsalm[0];
  if (nonPsalm[1]) result.second_reading = nonPsalm[1];

  return result;
}

function parseHtml(html: string, year: number, month: number): ImankatolikDay[] {
  const $ = cheerio.load(html);
  const days = new Map<string, ImankatolikDay>();

  const collect = (
    dayNum: number,
    name: string,
    color: LiturgicalColor | null,
    refs: string[]
  ) => {
    if (dayNum < 1 || dayNum > 31) return;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    if (days.has(date)) return; // first (highest-ranked) cell wins
    days.set(date, {
      calendar_date: date,
      celebration_name: name || "Hari Biasa",
      liturgical_color: color,
      ...classifyReadings(refs),
    });
  };

  // Primary: proven .k_tbl_td structure.
  const cells = $(".k_tbl_td");
  if (cells.length > 0) {
    cells.each((_, el) => {
      const cell = $(el);
      const dayNum = Number(cell.find(".k_tgl").first().text().trim());
      const name = cell.find(".k_perayaan").first().text().trim();
      const refs = cell
        .find(".k_alkitab a")
        .map((__, a) => $(a).text().trim())
        .get()
        .filter(Boolean);
      const color = normalizeColor(cell.find(".k_pakaian").first().text());
      collect(dayNum, name, color, refs);
    });
    return [...days.values()].sort((a, b) => a.calendar_date.localeCompare(b.calendar_date));
  }

  // Fallback: any <td> that mentions "Warna Liturgi".
  $("td").each((_, el) => {
    const cell = $(el);
    const text = cell.text();
    if (!/Warna\s+Liturgi/i.test(text)) return;

    const dayMatch = text.trim().match(/^\s*(\d{1,2})\b/);
    if (!dayMatch) return;
    const dayNum = Number(dayMatch[1]);

    const colorMatch = text.match(/Warna\s+Liturgi\s+(Merah\s*Muda|Hijau|Putih|Merah|Ungu)/i);
    const color = colorMatch ? normalizeColor(colorMatch[1]) : null;

    const refs = cell
      .find("a[href*='alkitab']")
      .map((__, a) => $(a).text().trim())
      .get()
      .filter(Boolean);

    // Celebration name: text between the day number and the first reading/color.
    let name = text.replace(/\s+/g, " ").trim().slice(dayMatch[0].length);
    if (refs[0]) {
      const idx = name.indexOf(refs[0]);
      if (idx > 0) name = name.slice(0, idx);
    }
    name = name.replace(/Warna\s+Liturgi.*$/i, "").replace(/[;.,\s]+$/, "").trim();

    collect(dayNum, name, color, refs);
  });

  return [...days.values()].sort((a, b) => a.calendar_date.localeCompare(b.calendar_date));
}

/** Fetches and parses one month of the imankatolik.or.id calendar. Cached ~24h. Never throws. */
export async function fetchImankatolikMonth(
  year: number,
  month: number
): Promise<ImankatolikDay[]> {
  try {
    const res = await fetch(
      `${IMANKATOLIK_SOURCE_URL}/kalender.php?t=${year}&b=${month}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const html = await res.text();
    return parseHtml(html, year, month);
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
