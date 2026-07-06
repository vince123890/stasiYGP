import { NextResponse } from "next/server";
import { getAllMassSchedules } from "@/lib/queries";

export async function GET() {
  try {
    const schedules = await getAllMassSchedules();
    return NextResponse.json({ data: schedules });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil jadwal misa" },
      { status: 500 }
    );
  }
}
