import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDateTime } from "@/lib/format";
import type { ParishEvent } from "@/types/database";

export function EventSection({ events }: { events: ParishEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section>
      <SectionHeading
        eyebrow="Agenda"
        title="Kegiatan Mendatang"
        description="Beberapa kegiatan paroki yang akan datang, jangan sampai terlewat."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="flex gap-4 overflow-hidden p-0 sm:flex-col">
            <div className="relative h-full w-32 shrink-0 sm:h-40 sm:w-full">
              {event.image_url ? (
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 380px, 100vw"
                />
              ) : (
                <div className="h-full w-full bg-parish-100" />
              )}
            </div>
            <div className="flex-1 p-4 sm:p-5">
              <h3 className="font-display text-lg text-parish-900">{event.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-parish-700/75">
                {event.description}
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-parish-600">
                <CalendarDays size={14} />
                {formatDateTime(event.event_date)}
              </p>
              {event.location && (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-parish-700/70">
                  <MapPin size={14} />
                  {event.location}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
