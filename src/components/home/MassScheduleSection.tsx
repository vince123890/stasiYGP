import { Clock, MapPin, Radio } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { dayName } from "@/lib/format";
import type { MassSchedule } from "@/types/database";

export function MassScheduleSection({ schedules }: { schedules: MassSchedule[] }) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Peribadatan"
          title="Jadwal Misa Terdekat"
          description="Bergabunglah dalam perayaan Ekaristi bersama umat paroki."
        />
        <Button href="/jadwal-misa" variant="outline" size="sm">
          Lihat Semua Jadwal
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {schedules.map((s) => (
          <Card key={s.id} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
              {dayName(s.day_of_week)}
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-display text-2xl text-parish-900">
              <Clock size={18} className="text-parish-500" />
              {s.time}
            </p>
            <p className="mt-2 text-sm font-medium text-parish-800">{s.label}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-parish-700/70">
              <MapPin size={14} />
              {s.location}
            </p>
            {s.stream_url && (
              <a
                href={s.stream_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-parish-600 hover:text-parish-700"
              >
                <Radio size={14} />
                Siaran Langsung
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
