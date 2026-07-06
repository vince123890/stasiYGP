import { NextResponse } from "next/server";
import { getEffectiveRange, getEffectiveToday } from "@/lib/liturgical-effective";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    if (from && to) {
      const days = await getEffectiveRange(from, to);
      return NextResponse.json({ data: days, source: "cms+imankatolik" });
    }

    const today = await getEffectiveToday();
    return NextResponse.json({ data: today, source: "cms+imankatolik" });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil kalender liturgi" },
      { status: 500 }
    );
  }
}
