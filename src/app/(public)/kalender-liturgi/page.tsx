import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDate, jakartaDateString } from "@/lib/format";
import { LITURGICAL_COLOR_STYLES } from "@/lib/liturgical-color";
import { getEffectiveToday, getEffectiveRange } from "@/lib/liturgical-effective";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalender Liturgi — Stasi Yohanes Gabriel Perboyre",
};

export const revalidate = 21600;

export default async function KalenderLiturgiPage() {
  const from = jakartaDateString();
  const to = jakartaDateString(14);

  const [todayDay, upcoming] = await Promise.all([
    getEffectiveToday(),
    getEffectiveRange(from, to),
  ]);

  const rest = upcoming.filter((d) => d.calendar_date !== from);

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Liturgi"
        title="Kalender Liturgi"
        description="Perayaan liturgi, warna liturgi, dan bacaan harian."
      />

      {todayDay && (
        <Card className={`mt-10 p-6 sm:p-8 ${LITURGICAL_COLOR_STYLES[todayDay.liturgical_color].bg}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-parish-700/70">
            Hari Ini — {formatDate(todayDay.calendar_date)}
          </p>
          <h2 className="mt-2 font-display text-2xl text-parish-900 sm:text-3xl">
            {todayDay.celebration_name}
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${LITURGICAL_COLOR_STYLES[todayDay.liturgical_color].dot}`}
            />
            <span
              className={`text-sm font-medium ${LITURGICAL_COLOR_STYLES[todayDay.liturgical_color].text}`}
            >
              Warna Liturgi: {LITURGICAL_COLOR_STYLES[todayDay.liturgical_color].label}
            </span>
          </div>
          {todayDay.rank && (
            <p className="mt-2 text-sm text-parish-700/70">{todayDay.rank}</p>
          )}
        </Card>
      )}

      {rest.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-600">
            Hari-Hari Mendatang
          </h3>
          <Card className="divide-y divide-parish-100 p-0">
            {rest.map((day) => {
              const color = LITURGICAL_COLOR_STYLES[day.liturgical_color];
              return (
                <div key={day.calendar_date} className="flex items-start gap-4 p-5">
                  <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${color.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-parish-500">
                      {formatDate(day.calendar_date)}
                    </p>
                    <p className="mt-0.5 font-display text-base text-parish-900">
                      {day.celebration_name}
                    </p>
                    {day.rank && (
                      <p className="mt-1 text-sm text-parish-700/70">{day.rank}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      <p className="mt-8 text-xs text-parish-700/60">
        Kalender liturgi dihitung otomatis berdasarkan Kalender Romawi Umum. Untuk tanggal
        yang bersifat lokal/khusus paroki, data dapat diisi manual oleh admin.
      </p>
    </Container>
  );
}
