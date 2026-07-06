import { Clock, MapPin, Radio } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LiturgicalWeekList } from "@/components/liturgical/LiturgicalWeekList";
import { dayName } from "@/lib/format";
import { getAllMassSchedules, getLiturgicalCalendarRange } from "@/lib/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal Misa — Stasi Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

function groupByDay(schedules: Awaited<ReturnType<typeof getAllMassSchedules>>) {
  const groups = new Map<number, typeof schedules>();
  for (const s of schedules) {
    const list = groups.get(s.day_of_week) ?? [];
    list.push(s);
    groups.set(s.day_of_week, list);
  }
  return [...groups.entries()].sort(([a], [b]) => a - b);
}

export default async function JadwalMisaPage() {
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const toDate = new Date(today);
  toDate.setDate(toDate.getDate() + 7);
  const to = toDate.toISOString().slice(0, 10);

  const [schedules, liturgicalDays] = await Promise.all([
    getAllMassSchedules(),
    getLiturgicalCalendarRange(from, to),
  ]);

  const grouped = groupByDay(schedules);

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Peribadatan"
        title="Jadwal Misa"
        description="Jadwal perayaan Ekaristi mingguan di Stasi Yohanes Gabriel Perboyre. Silakan datang tepat waktu dan berpakaian sopan."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {grouped.map(([day, items]) => (
            <Card key={day} className="p-5">
              <h3 className="font-display text-lg text-parish-900">{dayName(day)}</h3>
              <div className="mt-3 divide-y divide-parish-100">
                {items.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 font-display text-xl text-parish-900">
                        <Clock size={16} className="text-parish-500" />
                        {s.time}
                      </span>
                      <span className="text-sm text-parish-800">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-sm text-parish-700/70">
                        <MapPin size={14} />
                        {s.location}
                      </span>
                      {s.stream_url && (
                        <a
                          href={s.stream_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-parish-600 hover:text-parish-700"
                        >
                          <Radio size={14} />
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-600">
            Kalender Liturgi 7 Hari Ke Depan
          </h3>
          <LiturgicalWeekList days={liturgicalDays} />
        </div>
      </div>
    </Container>
  );
}
