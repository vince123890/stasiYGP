import Link from "next/link";
import { CalendarHeart, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { LITURGICAL_COLOR_STYLES } from "@/lib/liturgical-color";
import type { EffectiveLiturgicalDay } from "@/lib/liturgical-effective";

export function LiturgicalTodayCard({ day }: { day: EffectiveLiturgicalDay | null }) {
  if (!day) return null;
  const color = LITURGICAL_COLOR_STYLES[day.liturgical_color];
  const r = day.readings;

  return (
    <Link href="/kalender-liturgi" className="group block">
      <div
        className={`rounded-2xl p-6 shadow-[0_2px_20px_-6px_rgba(28,60,45,0.25)] transition-shadow hover:shadow-[0_8px_30px_-8px_rgba(28,60,45,0.35)] ${color.solid}`}
      >
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
          {day.rank && ` · ${day.rank}`}
        </p>

        {Object.values(r).some(Boolean) && (
          <div
            className={`mt-4 space-y-1 border-t border-black/10 pt-4 text-sm ${color.solidText} opacity-90`}
          >
            {r.first_reading && <p>Bacaan I: {r.first_reading}</p>}
            {r.psalm && <p>Mazmur: {r.psalm}</p>}
            {r.second_reading && <p>Bacaan II: {r.second_reading}</p>}
            {r.gospel && <p>Injil: {r.gospel}</p>}
            {r.office_reading && <p>BcO: {r.office_reading}</p>}
          </div>
        )}

        <p className={`mt-3 text-xs ${color.solidText} opacity-70`}>
          Klik untuk kalender lengkap
        </p>
      </div>
    </Link>
  );
}
