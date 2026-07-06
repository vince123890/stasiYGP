import { LITURGICAL_COLOR_STYLES } from "@/lib/liturgical-color";
import type { LiturgicalColor } from "@/types/database";

const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export function LiturgicalDateBadge({
  date,
  color,
}: {
  date: string; // YYYY-MM-DD
  color: LiturgicalColor;
}) {
  const styles = LITURGICAL_COLOR_STYLES[color];
  const [, month, day] = date.split("-").map(Number);

  return (
    <div
      className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${styles.solid}`}
    >
      <span className={`font-display text-xl font-semibold leading-none ${styles.solidText}`}>
        {day}
      </span>
      <span className={`mt-0.5 text-[10px] font-medium uppercase ${styles.solidText} opacity-80`}>
        {MONTHS_ID[month - 1]}
      </span>
    </div>
  );
}
