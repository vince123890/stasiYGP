export type LiturgicalColor = "putih" | "merah" | "hijau" | "ungu" | "merah_muda";

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  is_announcement: boolean;
  published_at: string;
  created_at: string;
  category?: Category | null;
}

export interface ArticleImage {
  id: string;
  article_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface MassSchedule {
  id: string;
  day_of_week: number;
  time: string;
  label: string;
  location: string;
  stream_url: string | null;
  sort_order: number;
}

export interface ParishEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string | null;
  image_url: string | null;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  image_url: string;
  title: string;
  subtitle: string | null;
  link_url: string | null;
  sort_order: number;
}

export interface LiturgicalDay {
  id: string;
  calendar_date: string;
  celebration_name: string;
  liturgical_color: LiturgicalColor;
  rank: string | null;
  first_reading: string | null;
  psalm: string | null;
  second_reading: string | null;
  gospel: string | null;
}
