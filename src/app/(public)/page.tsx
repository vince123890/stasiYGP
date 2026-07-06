import { Container } from "@/components/ui/Container";
import { HeroSlider } from "@/components/home/HeroSlider";
import { MassScheduleSection } from "@/components/home/MassScheduleSection";
import { LatestArticlesSection } from "@/components/home/LatestArticlesSection";
import { AnnouncementSection } from "@/components/home/AnnouncementSection";
import { LiturgicalTodayCard } from "@/components/home/LiturgicalTodayCard";
import {
  getHeroSlides,
  getAllMassSchedules,
  getLatestArticles,
  getLatestAnnouncements,
} from "@/lib/queries";
import { getEffectiveToday } from "@/lib/liturgical-effective";

export const revalidate = 300;

export default async function HomePage() {
  const [slides, schedules, articles, announcements, liturgicalDay] = await Promise.all([
    getHeroSlides(),
    getAllMassSchedules(),
    getLatestArticles(6),
    getLatestAnnouncements(3),
    getEffectiveToday(),
  ]);

  return (
    <div className="pb-24">
      <HeroSlider slides={slides} />

      <Container className="mt-10 space-y-20">
        {liturgicalDay && (
          <div className="mx-auto max-w-md">
            <LiturgicalTodayCard day={liturgicalDay} />
          </div>
        )}

        <MassScheduleSection schedules={schedules} />
        <AnnouncementSection announcements={announcements} />
        <LatestArticlesSection articles={articles} />
      </Container>
    </div>
  );
}
