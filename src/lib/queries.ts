import { createClient } from "@/lib/supabase/server";
import type {
  Announcement,
  AnnouncementImage,
  Article,
  ArticleImage,
  CategoricalGroup,
  Gallery,
  HeroSlide,
  LiturgicalDay,
  MassIntentionsInfo,
  MassSchedule,
  Neighborhood,
  OrganizationMember,
  ParishHistory,
  ParishProfile,
  Pastor,
  SacramentForm,
  SocialMinistry,
  Territory,
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
    .order("sort_order", { ascending: true });

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

export async function getLatestAnnouncements(limit = 4): Promise<Announcement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("is_priority", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("is_priority", { ascending: false })
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getAnnouncementBySlug(
  slug: string
): Promise<{ announcement: Announcement; images: AnnouncementImage[] } | null> {
  const supabase = createClient();
  const { data: announcement, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !announcement) return null;

  const { data: images } = await supabase
    .from("announcement_images")
    .select("*")
    .eq("announcement_id", announcement.id)
    .order("sort_order", { ascending: true });

  return { announcement, images: images ?? [] };
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

export async function getOrganizationMembers(
  groupName: "BGKS" | "DPS"
): Promise<OrganizationMember[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("organization_members")
    .select("*")
    .eq("group_name", groupName)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  const rows = (data ?? []) as OrganizationMember[];

  const byId = new Map(rows.map((r) => [r.id, { ...r, children: [] as OrganizationMember[] }]));
  const roots: OrganizationMember[] = [];

  for (const row of byId.values()) {
    if (row.parent_id && byId.has(row.parent_id)) {
      byId.get(row.parent_id)!.children!.push(row);
    } else {
      roots.push(row);
    }
  }

  return roots;
}

export async function getParishProfile(): Promise<ParishProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("parish_profile")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function getParishHistory(): Promise<ParishHistory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("parish_history")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getPastors(): Promise<Pastor[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pastors")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getCategoricalGroups(): Promise<CategoricalGroup[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categorical_groups")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSocialMinistries(): Promise<SocialMinistry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("social_ministries")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getSacramentForms(): Promise<SacramentForm[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sacrament_forms")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getGalleries(): Promise<Gallery[]> {
  const supabase = createClient();
  const { data: galleries, error } = await supabase
    .from("galleries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!galleries || galleries.length === 0) return [];

  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .in(
      "gallery_id",
      galleries.map((g) => g.id)
    )
    .order("sort_order", { ascending: true });

  return galleries.map((g) => ({
    ...g,
    images: (images ?? []).filter((img) => img.gallery_id === g.id),
  }));
}

export async function getMassIntentionsInfo(): Promise<MassIntentionsInfo | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("mass_intentions_info")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function getTerritories(): Promise<
  (Territory & { neighborhoods: Neighborhood[] })[]
> {
  const supabase = createClient();
  const { data: territories, error } = await supabase
    .from("territories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  if (!territories || territories.length === 0) return [];

  const { data: neighborhoods } = await supabase
    .from("neighborhoods")
    .select("*")
    .in(
      "territory_id",
      territories.map((t) => t.id)
    )
    .order("name", { ascending: true });

  return territories.map((t) => ({
    ...t,
    neighborhoods: (neighborhoods ?? []).filter((n) => n.territory_id === t.id),
  }));
}
