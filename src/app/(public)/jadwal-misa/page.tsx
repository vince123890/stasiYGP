import { Clock, MapPin, Radio } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LiturgicalWeekList } from "@/components/liturgical/LiturgicalWeekList";
import { getAllMassSchedules } from "@/lib/queries";
import { getEffectiveRange } from "@/lib/liturgical-effective";
import { jakartaDateString } from "@/lib/format";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal Misa — Stasi Yohanes Gabriel Perboyre",
};

export const revalidate = 300;

function groupByChapel(schedules: Awaited<ReturnType<typeof getAllMassSchedules>>) {
  const groups = new Map<string, typeof schedules>();
  for (const s of schedules) {
    const list = groups.get(s.chapel) ?? [];
    list.push(s);
    groups.set(s.chapel, list);
  }
  return [...groups.entries()];
}

export default async function JadwalMisaPage() {
  const from = jakartaDateString();
  const to = jakartaDateString(7);

  const [schedules, liturgicalDays] = await Promise.all([
    getAllMassSchedules(),
    getEffectiveRange(from, to),
  ]);

  const grouped = groupByChapel(schedules);

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Peribadatan"
        title="Jadwal Misa"
        description="Jadwal perayaan Ekaristi mingguan di Stasi Yohanes Gabriel Perboyre. Silakan datang tepat waktu dan berpakaian sopan."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {grouped.map(([chapel, items]) => (
            <Card key={chapel} className="p-5">
              <h3 className="flex items-center gap-1.5 font-display text-lg text-parish-900">
                <MapPin size={18} className="text-parish-500" />
                {chapel}
              </h3>
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
                      <span className="text-sm text-parish-800">{s.day_label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-parish-700/70">{s.category}</span>
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
