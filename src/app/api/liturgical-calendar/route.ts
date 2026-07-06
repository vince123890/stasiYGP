import { NextResponse } from "next/server";
import { getLiturgicalCalendarRange, getTodayLiturgicalDay } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    if (from && to) {
      const days = await getLiturgicalCalendarRange(from, to);
      return NextResponse.json({ data: days });
    }

    const today = await getTodayLiturgicalDay();
    return NextResponse.json({ data: today });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil kalender liturgi" },
      { status: 500 }
    );
  }
}
