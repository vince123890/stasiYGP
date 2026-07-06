import Link from "next/link";
import { CalendarHeart, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { LITURGICAL_COLOR_STYLES } from "@/lib/liturgical-color";
import type { EffectiveLiturgicalDay } from "@/lib/liturgical-effective";

export function LiturgicalTodayCard({ day }: { day: EffectiveLiturgicalDay | null }) {
  if (!day) return null;
  const color = LITURGICAL_COLOR_STYLES[day.liturgical_color];

  return (
    <Link href="/kalender-liturgi" className="group block">
      <Card className={`p-6 ${color.bg}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-parish-700/70">
            <CalendarHeart size={16} />
            Kalender Liturgi Hari Ini
          </div>
          <ChevronRight
            size={16}
            className="text-parish-500 transition-transform group-hover:translate-x-0.5"
          />
        </div>
        <p className="mt-2 text-sm text-parish-700/70">{formatDate(day.calendar_date)}</p>
        <h3 className="mt-1 font-display text-xl text-parish-900">{day.celebration_name}</h3>
        <div className="mt-3 flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${color.dot}`} />
          <span className={`text-sm font-medium ${color.text}`}>
            Warna Liturgi: {color.label}
          </span>
        </div>
        <p className="mt-3 text-xs text-parish-700/60">
          Klik untuk bacaan harian &amp; kalender lengkap
        </p>
      </Card>
    </Link>
  );
}
