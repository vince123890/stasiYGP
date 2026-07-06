import Link from "next/link";
import { CalendarHeart, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { LITURGICAL_COLOR_STYLES } from "@/lib/liturgical-color";
import type { EffectiveLiturgicalDay } from "@/lib/liturgical-effective";

export function LiturgicalTodayCard({ day }: { day: EffectiveLiturgicalDay | null }) {
  if (!day) return null;
  const color = LITURGICAL_COLOR_STYLES[day.liturgical_color];
  const hasReadings = Object.values(day.readings).some(Boolean);

  return (
    <Link href="/kalender-liturgi" className="group block">
      <Card className={`overflow-hidden ${color.solid}`}>
        <div className="p-6">
          <div className="flex items-center justify-between gap-2">
            <div
              className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${color.solidText} opacity-80`}
            >
              <CalendarHeart size={16} />
              Kalender Liturgi Hari Ini
            </div>
            <ChevronRight
              size={16}
              className={`${color.solidText} opacity-80 transition-transform group-hover:translate-x-0.5`}
            />
          </div>
          <p className={`mt-2 text-sm ${color.solidText} opacity-80`}>
            {formatDate(day.calendar_date)}
          </p>
          <h3 className={`mt-1 font-display text-xl ${color.solidText}`}>
            {day.celebration_name}
          </h3>
          <p className={`mt-2 text-sm font-medium ${color.solidText} opacity-90`}>
            Warna Liturgi: {color.label}
          </p>

          {hasReadings && (
            <div className={`mt-4 space-y-1 border-t pt-4 text-sm ${color.solidText} opacity-90 border-white/20`}>
              {day.readings.first_reading && <p>Bacaan I: {day.readings.first_reading}</p>}
              {day.readings.psalm && <p>Mazmur: {day.readings.psalm}</p>}
              {day.readings.second_reading && <p>Bacaan II: {day.readings.second_reading}</p>}
              {day.readings.gospel && <p>Injil: {day.readings.gospel}</p>}
            </div>
          )}

          <p className={`mt-3 text-xs ${color.solidText} opacity-70`}>
            Klik untuk kalender lengkap
          </p>
        </div>
      </Card>
    </Link>
  );
}
