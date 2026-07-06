import { createClient } from "@/lib/supabase/server";
import type {
  Article,
  ArticleImage,
  HeroSlide,
  LiturgicalDay,
  MassSchedule,
  ParishEvent,
} from "@/types/database";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getAllMassSchedules(): Promise<MassSchedule[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mass_schedules")
    .select("*")
    .order("day_of_week", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getUpcomingMassSchedules(limit = 4): Promise<MassSchedule[]> {
  const all = await getAllMassSchedules();
  const today = new Date().getDay();
  const sorted = [...all].sort((a, b) => {
    const da = (a.day_of_week - today + 7) % 7;
    const db = (b.day_of_week - today + 7) % 7;
    return da - db || a.sort_order - b.sort_order;
  });
  return sorted.slice(0, limit);
}

export async function getUpcomingEvents(limit = 3): Promise<ParishEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getLatestArticles(limit = 6): Promise<Article[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getLatestAnnouncements(limit = 4): Promise<Article[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("is_announcement", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getArticles(options?: {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ articles: Article[]; total: number }> {
  const supabase = createClient();
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 9;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("articles")
    .select("*, category:categories(*)", { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, to);

  if (options?.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();
    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { articles: data ?? [], total: count ?? 0 };
}

export async function getArticleBySlug(
  slug: string
): Promise<{ article: Article; images: ArticleImage[] } | null> {
  const supabase = createClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();

  if (error || !article) return null;

  const { data: images } = await supabase
    .from("article_images")
    .select("*")
    .eq("article_id", article.id)
    .order("sort_order", { ascending: true });

  return { article, images: images ?? [] };
}

export async function getCategories() {
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getTodayLiturgicalDay(): Promise<LiturgicalDay | null> {
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("liturgical_calendar")
    .select("*")
    .eq("calendar_date", today)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function getLiturgicalCalendarRange(
  from: string,
  to: string
): Promise<LiturgicalDay[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("liturgical_calendar")
    .select("*")
    .gte("calendar_date", from)
    .lte("calendar_date", to)
    .order("calendar_date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
