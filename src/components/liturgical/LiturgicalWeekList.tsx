import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { LITURGICAL_COLOR_STYLES } from "@/lib/liturgical-color";
import type { EffectiveLiturgicalDay } from "@/lib/liturgical-effective";

export function LiturgicalWeekList({ days }: { days: EffectiveLiturgicalDay[] }) {
  if (days.length === 0) return null;

  return (
    <Card className="divide-y divide-parish-100 p-0">
      {days.map((day) => {
        const color = LITURGICAL_COLOR_STYLES[day.liturgical_color];
        const readingLines = [
          day.readings.first_reading,
          day.readings.psalm,
          day.readings.second_reading,
          day.readings.gospel,
        ].filter(Boolean);

        return (
          <div key={day.calendar_date} className="flex items-start gap-4 p-5">
            <span className={`mt-1 h-8 w-2 shrink-0 rounded-full ${color.solid}`} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-parish-500">
                {formatDate(day.calendar_date)}
              </p>
              <p className="mt-0.5 font-display text-base text-parish-900">
                {day.celebration_name}
              </p>
              {day.rank && (
                <p className="mt-0.5 text-xs text-parish-700/60">{day.rank}</p>
              )}
              {readingLines.length > 0 && (
                <p className="mt-2 text-sm text-parish-700/80">
                  {readingLines.join(" · ")}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}
