export type LiturgicalColor = "putih" | "merah" | "hijau" | "ungu" | "merah_muda";
export type ContentStatus = "draft" | "published";
export type AnnouncementCategory =
  | "Pernikahan"
  | "Tahbisan Imam"
  | "Tahbisan Diakon"
  | "Pengumuman Paroki";
export type OrganizationGroup = "BGKS" | "DPS";
export type PastorType = "Gembala Kami" | "Pernah Berkarya";
export type PriestType = "Pastor Paroki" | "Pastor Rekan";

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
  author: string | null;
  content: string;
  cover_image_url: string | null;
  attachment_url: string | null;
  category_id: string | null;
  status: ContentStatus;
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

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  category: AnnouncementCategory;
  content: string;
  attachment_url: string | null;
  is_priority: boolean;
  status: ContentStatus;
  published_at: string;
  created_at: string;
}

export interface AnnouncementImage {
  id: string;
  announcement_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface MassSchedule {
  id: string;
  chapel: string;
  category: string;
  day_label: string;
  time: string;
  stream_url: string | null;
  sort_order: number;
}

export interface OrganizationMember {
  id: string;
  group_name: OrganizationGroup;
  position_title: string;
  member_name: string;
  photo_url: string | null;
  parent_id: string | null;
  sort_order: number;
  children?: OrganizationMember[];
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
  office_reading: string | null;
}

export interface SacramentForm {
  id: string;
  name: string;
  category: string;
  description: string | null;
  file_url: string;
  sort_order: number;
}

export interface Gallery {
  id: string;
  title: string;
  google_photo_url: string | null;
  created_at: string;
  images?: GalleryImage[];
}

export interface GalleryImage {
  id: string;
  gallery_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export interface MassIntentionsInfo {
  id: number;
  contact_wa: string | null;
  format_info: string | null;
  deadline_info: string | null;
  offering_info: string | null;
  church_account_name: string | null;
  church_bank_name: string | null;
  church_account_number: string | null;
  social_account_name: string | null;
  social_bank_name: string | null;
  social_account_number: string | null;
}

export interface SocialMinistry {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  activities: string | null;
  sort_order: number;
}

export interface CategoricalGroup {
  id: string;
  name: string;
  content: string;
  schedule: string | null;
  contact: string | null;
  sort_order: number;
}

export interface Territory {
  id: string;
  name: string;
  chairman: string;
}

export interface Neighborhood {
  id: string;
  territory_id: string | null;
  name: string;
  chairman: string;
  family_count: number;
}

export interface Pastor {
  id: string;
  pastor_type: PastorType;
  priest_type: PriestType;
  name: string;
  nickname: string | null;
  ordination_date: string | null;
  serve_from: number | null;
  serve_to: number | null;
  photo_url: string | null;
  biography: string | null;
  sort_order: number;
}

export interface ParishProfile {
  id: number;
  stasi_name: string;
  paroki_name: string | null;
  address: string;
  phone1: string | null;
  phone2: string | null;
  email: string | null;
  office_hours: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  facebook_url: string | null;
  map_embed_url: string | null;
  about_saint: string | null;
  vision: string | null;
  mission: string | null;
}

export interface ParishHistory {
  id: string;
  year: number;
  category: string;
  content: string;
  sort_order: number;
}
