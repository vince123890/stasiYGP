import { CalendarHeart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { LITURGICAL_COLOR_STYLES } from "@/lib/liturgical-color";
import type { LiturgicalDay } from "@/types/database";

export function LiturgicalTodayCard({ day }: { day: LiturgicalDay | null }) {
  if (!day) return null;
  const color = LITURGICAL_COLOR_STYLES[day.liturgical_color];

  return (
    <Card className={`p-6 ${color.bg}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-parish-700/70">
        <CalendarHeart size={16} />
        Kalender Liturgi Hari Ini
      </div>
      <p className="mt-2 text-sm text-parish-700/70">{formatDate(day.calendar_date)}</p>
      <h3 className="mt-1 font-display text-xl text-parish-900">{day.celebration_name}</h3>
      <div className="mt-3 flex items-center gap-2">
        <span className={`h-3 w-3 rounded-full ${color.dot}`} />
        <span className={`text-sm font-medium ${color.text}`}>Warna Liturgi: {color.label}</span>
      </div>
      {day.gospel && (
        <p className="mt-3 text-sm text-parish-700/80">
          <span className="font-semibold">Bacaan Injil:</span> {day.gospel}
        </p>
      )}
    </Card>
  );
}
