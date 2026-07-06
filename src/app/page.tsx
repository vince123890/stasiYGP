import { Container } from "@/components/ui/Container";
import { HeroSlider } from "@/components/home/HeroSlider";
import { MassScheduleSection } from "@/components/home/MassScheduleSection";
import { LatestArticlesSection } from "@/components/home/LatestArticlesSection";
import { EventSection } from "@/components/home/EventSection";
import { LiturgicalTodayCard } from "@/components/home/LiturgicalTodayCard";
import {
  getHeroSlides,
  getUpcomingMassSchedules,
  getLatestArticles,
  getUpcomingEvents,
  getTodayLiturgicalDay,
} from "@/lib/queries";

export const revalidate = 300;

export default async function HomePage() {
  const [slides, schedules, articles, events, liturgicalDay] = await Promise.all([
    getHeroSlides(),
    getUpcomingMassSchedules(4),
    getLatestArticles(6),
    getUpcomingEvents(3),
    getTodayLiturgicalDay(),
  ]);

  return (
    <div className="pb-24">
      <HeroSlider slides={slides} />

      <Container className="mt-14 space-y-20">
        {liturgicalDay && (
          <div className="-mt-24 sm:-mt-28">
            <div className="mx-auto max-w-md">
              <LiturgicalTodayCard day={liturgicalDay} />
            </div>
          </div>
        )}

        <MassScheduleSection schedules={schedules} />
        <LatestArticlesSection articles={articles} />
        <EventSection events={events} />
      </Container>
    </div>
  );
}
