-- StasiYGP database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ==========================================================================
-- Tables
-- ==========================================================================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  category_id uuid references categories(id) on delete set null,
  is_announcement boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists article_images (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

create table if not exists mass_schedules (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6), -- 0 = Minggu ... 6 = Sabtu
  time text not null, -- e.g. '06:00'
  label text not null, -- e.g. 'Misa Pagi', 'Misa Bahasa Inggris'
  location text not null default 'Gereja Utama',
  stream_url text,
  sort_order int not null default 0
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_date timestamptz not null,
  location text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null,
  subtitle text,
  link_url text,
  sort_order int not null default 0
);

create table if not exists liturgical_calendar (
  id uuid primary key default gen_random_uuid(),
  calendar_date date not null unique,
  celebration_name text not null,
  liturgical_color text not null check (liturgical_color in ('putih', 'merah', 'hijau', 'ungu', 'merah_muda')),
  rank text, -- e.g. 'Hari Raya', 'Pesta', 'Peringatan Wajib', 'Peringatan Fakultatif', 'Hari Biasa'
  first_reading text,
  psalm text,
  second_reading text,
  gospel text
);

-- ==========================================================================
-- Row Level Security: public read-only access
-- ==========================================================================

alter table categories enable row level security;
alter table articles enable row level security;
alter table article_images enable row level security;
alter table mass_schedules enable row level security;
alter table events enable row level security;
alter table hero_slides enable row level security;
alter table liturgical_calendar enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read articles" on articles for select using (true);
create policy "public read article_images" on article_images for select using (true);
create policy "public read mass_schedules" on mass_schedules for select using (true);
create policy "public read events" on events for select using (true);
create policy "public read hero_slides" on hero_slides for select using (true);
create policy "public read liturgical_calendar" on liturgical_calendar for select using (true);

-- ==========================================================================
-- Seed data
-- ==========================================================================

insert into categories (name, slug) values
  ('Pengumuman', 'pengumuman'),
  ('Kegiatan Paroki', 'kegiatan-paroki'),
  ('Kategorial', 'kategorial'),
  ('Sosial', 'sosial')
on conflict (slug) do nothing;

insert into hero_slides (image_url, title, subtitle, link_url, sort_order) values
  ('https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=80', 'Selamat Datang di Stasi Yohanes Gabriel Perboyre', 'Bersatu dalam iman, tumbuh dalam kasih', '/artikel', 1),
  ('https://images.unsplash.com/photo-1490127252417-7c393f993ee4?w=1600&q=80', 'Perayaan Ekaristi Setiap Hari', 'Lihat jadwal misa lengkap kami', '/jadwal-misa', 2),
  ('https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=1600&q=80', 'Mari Berkarya Bersama', 'Ikuti kegiatan kategorial dan sosial paroki', '/artikel', 3)
on conflict do nothing;

insert into mass_schedules (day_of_week, time, label, location, stream_url, sort_order) values
  (0, '06:00', 'Misa Pagi', 'Gereja Utama', null, 1),
  (0, '08:00', 'Misa Umat', 'Gereja Utama', 'https://youtube.com/live/contoh', 2),
  (0, '17:00', 'Misa Sore', 'Gereja Utama', null, 3),
  (6, '17:30', 'Misa Sabtu Sore (Antisipasi)', 'Gereja Utama', null, 4),
  (1, '05:30', 'Misa Harian', 'Kapel Adorasi', null, 5),
  (3, '05:30', 'Misa Harian', 'Kapel Adorasi', null, 6),
  (5, '19:00', 'Misa Jumat Pertama', 'Gereja Utama', null, 7)
on conflict do nothing;

insert into events (title, description, event_date, location, image_url) values
  ('Rekoleksi Adven', 'Rekoleksi persiapan Adven bagi seluruh umat paroki.', now() + interval '7 days', 'Aula Paroki', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80'),
  ('Pertemuan OMK', 'Pertemuan rutin Orang Muda Katolik membahas program tahunan.', now() + interval '3 days', 'Ruang Serbaguna', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80'),
  ('Bakti Sosial', 'Kegiatan bakti sosial bagi warga sekitar paroki.', now() + interval '14 days', 'Balai Warga', 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&q=80')
on conflict do nothing;

insert into liturgical_calendar (calendar_date, celebration_name, liturgical_color, rank, first_reading, psalm, second_reading, gospel) values
  (current_date, 'Hari Biasa', 'hijau', 'Hari Biasa', 'Kej 1:1-19', 'Mzm 104', null, 'Mrk 6:53-56'),
  (current_date + 1, 'Peringatan Wajib Orang Kudus', 'putih', 'Peringatan Wajib', 'Kej 1:20-2:4a', 'Mzm 8', null, 'Mrk 7:1-13'),
  (current_date + 2, 'Hari Biasa', 'hijau', 'Hari Biasa', 'Kej 2:4b-9,15-17', 'Mzm 104', null, 'Mrk 7:14-23'),
  (current_date + 7, 'Hari Minggu Biasa', 'hijau', 'Hari Raya', 'Yes 55:1-11', 'Mzm 19', '1Yoh 5:1-9', 'Mrk 1:7-11')
on conflict (calendar_date) do nothing;

-- Sample articles (category ids resolved via subquery)
insert into articles (title, slug, excerpt, content, cover_image_url, category_id, is_announcement, published_at)
select
  v.title, v.slug, v.excerpt, v.content, v.cover_image_url,
  (select id from categories where slug = v.category_slug),
  v.is_announcement, v.published_at
from (
  values
    ('Jadwal Perayaan Natal 2026', 'jadwal-perayaan-natal-2026',
     'Berikut jadwal lengkap perayaan Natal di paroki kita.',
     'Umat terkasih, berikut adalah jadwal lengkap perayaan Natal 2026 di Stasi Yohanes Gabriel Perboyre. Misa Malam Natal akan dilaksanakan pada pukul 17.00, 20.00, dan 23.00. Misa Hari Raya Natal dilaksanakan pukul 06.00, 08.00, dan 10.00. Mari kita sambut kelahiran Kristus dengan hati yang penuh sukacita.',
     'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=80',
     'pengumuman', true, now() - interval '2 days'),
    ('Pembukaan Pendaftaran Katekumen Baru', 'pembukaan-pendaftaran-katekumen-baru',
     'Pendaftaran katekumen baru dibuka mulai minggu depan.',
     'Bagi umat yang ingin mendaftarkan diri atau keluarga sebagai katekumen baru, pendaftaran dibuka mulai tanggal 10 hingga 24 bulan ini di sekretariat paroki pada jam kerja. Mohon membawa dokumen pendukung yang diperlukan.',
     'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=80',
     'pengumuman', true, now() - interval '5 days'),
    ('Kegiatan Rekoleksi OMK Berjalan Lancar', 'kegiatan-rekoleksi-omk-berjalan-lancar',
     'Rekoleksi Orang Muda Katolik diikuti puluhan peserta.',
     'Kegiatan rekoleksi Orang Muda Katolik (OMK) yang diselenggarakan akhir pekan lalu berjalan dengan lancar dan diikuti lebih dari 60 peserta dari berbagai lingkungan. Acara diisi dengan sesi refleksi, permainan kelompok, dan perayaan Ekaristi bersama.',
     'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80',
     'kategorial', false, now() - interval '10 days'),
    ('Bakti Sosial untuk Warga Sekitar Paroki', 'bakti-sosial-untuk-warga-sekitar-paroki',
     'Paroki menyalurkan bantuan sembako kepada warga sekitar.',
     'Sebagai wujud kepedulian sosial, paroki kita menyelenggarakan kegiatan bakti sosial dengan menyalurkan paket sembako kepada warga sekitar yang membutuhkan. Kegiatan ini merupakan bagian dari program sosial tahunan gereja.',
     'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80',
     'sosial', false, now() - interval '15 days'),
    ('Misa Syukur Ulang Tahun Paroki', 'misa-syukur-ulang-tahun-paroki',
     'Perayaan ulang tahun paroki dirayakan penuh syukur.',
     'Umat merayakan ulang tahun paroki dengan Misa Syukur yang dipimpin oleh Romo Paroki, dilanjutkan dengan ramah tamah dan berbagai pertunjukan dari kelompok kategorial.',
     'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&q=80',
     'kegiatan-paroki', false, now() - interval '20 days')
) as v(title, slug, excerpt, content, cover_image_url, category_slug, is_announcement, published_at)
on conflict (slug) do nothing;

insert into article_images (article_id, image_url, caption, sort_order)
select a.id, img.image_url, img.caption, img.sort_order
from articles a
join (
  values
    ('kegiatan-rekoleksi-omk-berjalan-lancar', 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80', 'Sesi refleksi bersama', 1),
    ('kegiatan-rekoleksi-omk-berjalan-lancar', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', 'Permainan kelompok', 2),
    ('bakti-sosial-untuk-warga-sekitar-paroki', 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&q=80', 'Penyaluran sembako', 1)
) as img(article_slug, image_url, caption, sort_order) on img.article_slug = a.slug
on conflict do nothing;
