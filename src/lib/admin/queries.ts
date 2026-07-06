import { createAuthClient } from "@/lib/supabase/server-auth";
import type {
  Article,
  ArticleImage,
  Announcement,
  AnnouncementImage,
  Category,
} from "@/types/database";

export async function getAllArticlesAdmin(): Promise<Article[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getArticleByIdAdmin(
  id: string
): Promise<{ article: Article; images: ArticleImage[] } | null> {
  const supabase = await createAuthClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !article) return null;

  const { data: images } = await supabase
    .from("article_images")
    .select("*")
    .eq("article_id", id)
    .order("sort_order", { ascending: true });

  return { article, images: images ?? [] };
}

export async function getAllAnnouncementsAdmin(): Promise<Announcement[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getAnnouncementByIdAdmin(
  id: string
): Promise<{ announcement: Announcement; images: AnnouncementImage[] } | null> {
  const supabase = await createAuthClient();
  const { data: announcement, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !announcement) return null;

  const { data: images } = await supabase
    .from("announcement_images")
    .select("*")
    .eq("announcement_id", id)
    .order("sort_order", { ascending: true });

  return { announcement, images: images ?? [] };
}

export async function getCategoriesAdmin(): Promise<Category[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getRowsAdmin<T>(table: string, orderBy = "sort_order"): Promise<T[]> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.from(table).select("*").order(orderBy);
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function getRowByIdAdmin<T>(table: string, id: string): Promise<T | null> {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
  if (error) return null;
  return data as T;
}
