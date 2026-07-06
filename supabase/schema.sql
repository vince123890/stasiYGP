-- StasiYGP database schema (full)
-- Run this in the Supabase SQL editor on a fresh or existing project.
-- Safe to re-run: drops and recreates all app tables (no production data yet).

create extension if not exists "pgcrypto";

-- ==========================================================================
-- Drop existing tables (clean slate — still pre-launch, seed data only)
-- ==========================================================================

drop table if exists article_images cascade;
drop table if exists articles cascade;
drop table if exists announcement_images cascade;
drop table if exists announcements cascade;
drop table if exists categories cascade;
drop table if exists mass_schedules cascade;
drop table if exists organization_members cascade;
drop table if exists parish_info cascade;
drop table if exists events cascade;
drop table if exists hero_slides cascade;
drop table if exists liturgical_calendar cascade;
drop table if exists sacrament_forms cascade;
drop table if exists gallery_images cascade;
drop table if exists galleries cascade;
drop table if exists mass_intentions_info cascade;
drop table if exists social_ministries cascade;
drop table if exists categorical_groups cascade;
drop table if exists territories cascade;
drop table if exists neighborhoods cascade;
drop table if exists pastors cascade;
drop table if exists parish_profile cascade;
drop table if exists parish_history cascade;

-- ==========================================================================
-- Tables
-- ==========================================================================

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  author text,
  content text not null,
  cover_image_url text,
  attachment_url text, -- optional Google Drive link
  category_id uuid references categories(id) on delete set null,
  status text not null default 'published' check (status in ('draft', 'published')),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table article_images (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('Pernikahan', 'Tahbisan Imam', 'Tahbisan Diakon', 'Pengumuman Paroki')),
  content text not null,
  attachment_url text, -- optional Google Drive link
  is_priority boolean not null default false,
  status text not null default 'published' check (status in ('draft', 'published')),
  published_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table announcement_images (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references announcements(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

create table mass_schedules (
  id uuid primary key default gen_random_uuid(),
  chapel text not null, -- e.g. 'Kapel IMAVI', 'Kapel YGP'
  category text not null, -- e.g. 'Misa Harian', 'Misa Minggu', 'English Mass'
  day_label text not null, -- e.g. 'Senin - Kamis', 'Jumat', '3rd Saturday'
  time text not null, -- e.g. '05.30'
  stream_url text,
  sort_order int not null default 0
);

create table organization_members (
  id uuid primary key default gen_random_uuid(),
  group_name text not null check (group_name in ('BGKS', 'DPS')),
  position_title text not null, -- e.g. 'Ketua', 'Kabid. Pembinaan', 'Kasie. BIAK', 'Subsie. Misdinar'
  member_name text not null,
  photo_url text,
  parent_id uuid references organization_members(id) on delete cascade,
  sort_order int not null default 0
);

create table hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null,
  subtitle text,
  link_url text,
  sort_order int not null default 0
);

create table liturgical_calendar (
  id uuid primary key default gen_random_uuid(),
  calendar_date date not null unique,
  celebration_name text not null,
  liturgical_color text not null check (liturgical_color in ('putih', 'merah', 'hijau', 'ungu', 'merah_muda')),
  rank text,
  first_reading text,
  psalm text,
  second_reading text,
  gospel text,
  office_reading text
);

create table sacrament_forms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  file_url text not null, -- Google Drive link
  sort_order int not null default 0
);

create table galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  google_photo_url text,
  created_at timestamptz not null default now()
);

create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

create table mass_intentions_info (
  id int primary key default 1 check (id = 1),
  contact_wa text,
  format_info text,
  deadline_info text,
  offering_info text,
  church_account_name text,
  church_bank_name text,
  church_account_number text,
  social_account_name text,
  social_bank_name text,
  social_account_number text
);

create table social_ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  icon text default 'Heart',
  activities text,
  sort_order int not null default 0
);

create table categorical_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  content text not null,
  schedule text,
  contact text,
  sort_order int not null default 0
);

create table territories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  chairman text not null
);

create table neighborhoods (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid references territories(id) on delete cascade,
  name text not null,
  chairman text not null,
  family_count int default 0
);

create table pastors (
  id uuid primary key default gen_random_uuid(),
  pastor_type text not null check (pastor_type in ('Gembala Kami', 'Pernah Berkarya')),
  priest_type text not null check (priest_type in ('Romo Paroki', 'Romo Rekan')),
  name text not null,
  nickname text,
  ordination_date date,
  serve_from int,
  serve_to int,
  photo_url text,
  biography text,
  sort_order int not null default 0
);

create table parish_profile (
  id int primary key default 1 check (id = 1),
  stasi_name text not null,
  paroki_name text,
  address text not null,
  phone1 text,
  phone2 text,
  email text,
  office_hours text,
  whatsapp_url text,
  instagram_url text,
  youtube_url text,
  facebook_url text,
  map_embed_url text,
  about_saint text,
  vision text,
  mission text
);

create table parish_history (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  category text not null,
  content text not null,
  sort_order int not null default 0
);

-- ==========================================================================
-- Row Level Security: public read-only access
-- ==========================================================================

alter table categories enable row level security;
alter table articles enable row level security;
alter table article_images enable row level security;
alter table announcements enable row level security;
alter table announcement_images enable row level security;
alter table mass_schedules enable row level security;
alter table organization_members enable row level security;
alter table hero_slides enable row level security;
alter table liturgical_calendar enable row level security;
alter table sacrament_forms enable row level security;
alter table galleries enable row level security;
alter table gallery_images enable row level security;
alter table mass_intentions_info enable row level security;
alter table social_ministries enable row level security;
alter table categorical_groups enable row level security;
alter table territories enable row level security;
alter table neighborhoods enable row level security;
alter table pastors enable row level security;
alter table parish_profile enable row level security;
alter table parish_history enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read articles" on articles for select using (status = 'published');
create policy "public read article_images" on article_images for select using (true);
create policy "public read announcements" on announcements for select using (status = 'published');
create policy "public read announcement_images" on announcement_images for select using (true);
create policy "public read mass_schedules" on mass_schedules for select using (true);
create policy "public read organization_members" on organization_members for select using (true);
create policy "public read hero_slides" on hero_slides for select using (true);
create policy "public read liturgical_calendar" on liturgical_calendar for select using (true);
create policy "public read sacrament_forms" on sacrament_forms for select using (true);
create policy "public read galleries" on galleries for select using (true);
create policy "public read gallery_images" on gallery_images for select using (true);
create policy "public read mass_intentions_info" on mass_intentions_info for select using (true);
create policy "public read social_ministries" on social_ministries for select using (true);
create policy "public read categorical_groups" on categorical_groups for select using (true);
create policy "public read territories" on territories for select using (true);
create policy "public read neighborhoods" on neighborhoods for select using (true);
create policy "public read pastors" on pastors for select using (true);
create policy "public read parish_profile" on parish_profile for select using (true);
create policy "public read parish_history" on parish_history for select using (true);

-- ==========================================================================
-- Seed data
-- ==========================================================================

-- Categories (for articles)
insert into categories (name, slug) values
  ('Kegiatan Paroki', 'kegiatan-paroki'),
  ('Kategorial', 'kategorial'),
  ('Sosial', 'sosial'),
  ('Liturgi', 'liturgi');

-- Hero slides (from `sliders`)
insert into hero_slides (image_url, title, subtitle, link_url, sort_order) values
  ('https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1600&q=80', 'Selamat Datang di Stasi Yohanes Gabriel Perboyre', 'Mari kita bersama-sama membangun komunitas beriman yang hidup dan penuh kasih', null, 0),
  ('https://images.unsplash.com/photo-1490127252417-7c393f993ee4?w=1600&q=80', 'Perayaan Ekaristi Mingguan', 'Bergabunglah bersama kami setiap Minggu di Kapel YGP pukul 07.00 dan 09.00', '/jadwal-misa', 1),
  ('https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&q=80', 'Komunitas yang Hidup', 'Berbagi kasih dalam kebersamaan melalui berbagai kegiatan kategorial', '/kategorial', 2),
  ('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80', 'Karya Sosial Peduli Sesama', 'Bersama melayani yang membutuhkan dengan kasih Kristus', '/karya-sosial', 3);

-- Mass schedules (real data from Sekretariat dan Jadwal Misa.xlsx)
insert into mass_schedules (chapel, category, day_label, time, sort_order) values
  ('Kapel IMAVI', 'Misa Harian', 'Senin - Kamis', '05.30', 0),
  ('Kapel IMAVI', 'Misa Harian', 'Jumat', '18.00', 1),
  ('Kapel IMAVI', 'Misa Harian', 'Sabtu', '05.30', 2),
  ('Kapel IMAVI', 'Jumat Pertama', 'Jumat Pertama', '17.00', 3),
  ('Kapel IMAVI', 'Misa Minggu', 'Sabtu', '17.00', 4),
  ('Kapel IMAVI', 'English Mass', '3rd Saturday', '17.00', 5),
  ('Kapel YGP', 'Misa Minggu', 'Minggu', '07.00', 6),
  ('Kapel YGP', 'Misa Minggu', 'Minggu', '09.00', 7);

-- Parish profile (real address/contact from Sekretariat.xlsx; vision/mission adapted from dump `profiles`)
insert into parish_profile (
  id, stasi_name, paroki_name, address, phone1, email, office_hours,
  whatsapp_url, instagram_url, youtube_url, map_embed_url,
  about_saint, vision, mission
) values (
  1,
  'Paroki Yohanes Gabriel Perboyre',
  'Paroki Marinus Yohanes Surabaya',
  'Auditorium Universitas Katolik Widya Mandala, Lt 2, Jl. Kalisari Selatan No.1 Kalisari, Pakuwon City, Kec. Mulyorejo, Surabaya, Jawa Timur 60112 (Kampus Pakuwon City, Universitas Katolik Widya Mandala Surabaya)',
  '0812-5902-2020',
  'sygp1109@gmail.com',
  'Senin - Sabtu: 08.00 - 16.00 (istirahat 13.30 - 14.30) | Minggu: 08.00 - 14.00',
  'https://chat.whatsapp.com/BCxQTo2NX5WAh658bShO25',
  'https://www.instagram.com/yohanesgabrielperboyre',
  'https://www.youtube.com/@KomsosYGP',
  'https://www.google.com/maps?q=-7.2702331,112.8091774&z=17&output=embed',
  '<p><strong>Santo Yohanes Gabriel Perboyre</strong> (1802-1840) adalah seorang imam Lazaris asal Prancis yang menjadi martir iman di Tiongkok.</p><h2>Kehidupan Awal</h2><p>Lahir pada 6 Januari 1802 di Le Puech, Prancis, dari keluarga yang taat beragama. Sejak kecil ia sudah menunjukkan kecintaan yang mendalam pada Tuhan dan pelayanan gereja.</p><h2>Panggilan Misionaris</h2><p>Setelah ditahbiskan menjadi imam pada tahun 1826, ia mengajar di seminari selama beberapa tahun. Namun hatinya terus terpanggil untuk menjadi misionaris. Pada 1835, ia berangkat ke Tiongkok untuk mewartakan Injil.</p><h2>Kemartiran</h2><p>Di Tiongkok, ia melayani umat dengan penuh kasih meskipun menghadapi banyak kesulitan dan penganiayaan. Pada 1839, ia ditangkap karena imannya. Setelah disiksa dengan keji, ia akhirnya dimartir dengan cara dicekik pada 11 September 1840 di Wuchang, Hubei.</p><h2>Kanonisasi</h2><p>Yohanes Gabriel Perboyre dibeatifikasi oleh Paus Leo XIII pada tahun 1889 dan dikanonisasi oleh Paus Yohanes Paulus II pada 2 Juni 1996. Ia adalah santo martir Tiongkok pertama yang dikanonisasi. Pesta liturginya dirayakan pada tanggal 11 September.</p>',
  '<p><strong>Menjadi komunitas beriman yang hidup, penuh kasih, dan bersaksi tentang Kristus di tengah masyarakat.</strong></p><p>Kami bercita-cita untuk:</p><ul><li>Membangun persekutuan umat yang kuat dan saling mendukung</li><li>Menghidupi iman Katolik dengan autentik dan penuh sukacita</li><li>Menjadi terang dan garam bagi lingkungan sekitar</li><li>Meneladani semangat misionaris Santo Yohanes Gabriel Perboyre dalam pewartaan Injil</li></ul>',
  '<p>Untuk mewujudkan visi tersebut, kami mengemban misi:</p><ul><li><strong>Pembinaan Iman</strong> — Menyelenggarakan kegiatan katekese, pendalaman Kitab Suci, dan pembinaan rohani bagi seluruh umat</li><li><strong>Liturgi yang Hidup</strong> — Merayakan Ekaristi dan sakramen-sakramen dengan khidmat dan penuh kehadiran</li><li><strong>Pelayanan Kasih</strong> — Melayani sesama, terutama yang miskin dan menderita, melalui berbagai karya sosial</li><li><strong>Kekeluargaan</strong> — Membangun relasi yang erat antar umat melalui kegiatan lingkungan dan kategorial</li><li><strong>Pewartaan</strong> — Mewartakan Kabar Gembira melalui kesaksian hidup dan berbagai kegiatan evangelisasi</li></ul>'
);

-- Parish history timeline (from `sejarahs`)
insert into parish_history (year, category, content, sort_order) values
  (1985, 'Pendirian', '<p>Sekelompok umat Katolik mulai berkumpul untuk merayakan misa bersama, menjadi cikal bakal berdirinya Stasi Yohanes Gabriel Perboyre.</p>', 0),
  (1990, 'Penetapan Status Stasi', '<p>Komunitas ini resmi ditetapkan sebagai Stasi. Santo Yohanes Gabriel Perboyre dipilih sebagai santo pelindung stasi — imam Vincentian yang menjadi martir di Tiongkok.</p>', 1),
  (2005, 'Pengembangan Organisasi', '<p>Dibentuknya struktur organisasi stasi yang lebih sistematis dengan pembentukan DPS (Dewan Pastoral Stasi) dan berbagai seksi pelayanan. Mulai aktifnya berbagai kategorial: Mudika, OMK, Wanita Katolik, Pria Katolik, dan Legio Maria.</p>', 2),
  (2015, 'Perayaan 30 Tahun', '<p>Stasi Yohanes Gabriel Perboyre merayakan 30 tahun perjalanannya dengan syukuran besar yang dihadiri oleh ratusan umat.</p>', 3),
  (2020, 'Era Digital', '<p>Pandemi COVID-19 mendorong stasi untuk bertransformasi ke era digital. Dimulainya misa online via streaming YouTube dan penggunaan aplikasi untuk administrasi stasi.</p>', 4),
  (2024, 'Peluncuran Website Baru', '<p>Diluncurkannya website resmi Stasi Yohanes Gabriel Perboyre yang lebih modern dan informatif, memudahkan umat untuk mengakses informasi, artikel, pengumuman, dan berbagai layanan stasi secara online.</p>', 5);

-- Pastors (from `pastors`)
insert into pastors (pastor_type, priest_type, name, nickname, ordination_date, serve_from, serve_to, biography, sort_order) values
  ('Gembala Kami', 'Romo Paroki', 'RD. Yohanes Dwi Harsanto, Pr.', 'Romo Yohanes', '2015-08-15', 2022, null, 'Ditahbiskan sebagai imam pada 15 Agustus 2015. Mulai berkarya di stasi sejak tahun 2022. Sebelumnya bertugas di beberapa paroki di Keuskupan.', 0),
  ('Gembala Kami', 'Romo Rekan', 'RD. Antonius Budi Santosa, CM', 'Romo Anton', '2018-06-10', 2023, null, 'Anggota Kongregasi Misi (CM) atau Vincentian. Bergabung membantu pelayanan di stasi sejak tahun 2023, khususnya dalam pembinaan kaum muda dan kategorial.', 1),
  ('Pernah Berkarya', 'Romo Paroki', 'RD. Petrus Sugiarto, Pr.', 'Romo Petrus', '2005-07-20', 2018, 2022, 'Berkarya di stasi periode 2018-2022. Dikenal sebagai pastor yang sangat peduli dengan karya sosial dan pemberdayaan umat.', 2),
  ('Pernah Berkarya', 'Romo Rekan', 'RD. Andreas Suryanto, CM', 'Romo Andreas', '2010-05-30', 2019, 2023, 'Membantu pelayanan di stasi periode 2019-2023. Fokus pada pembinaan liturgi dan pelayanan sakramen.', 3);

-- Categorical groups (from `kategoriales`)
insert into categorical_groups (name, content, schedule, contact, sort_order) values
  ('Mudika (Kaum Muda Katolik)', '<p>Wadah bagi pemuda-pemudi Katolik usia 18-35 tahun untuk berkumpul, berbagi iman, dan mengembangkan potensi diri dalam semangat Injili. Kegiatan meliputi sharing iman, retret tahunan, bakti sosial, dan pelayanan liturgi.</p>', 'Setiap Minggu Kedua, 16.00 - 18.00 WIB', 'Andreas', 0),
  ('OMK (Orang Muda Katolik)', '<p>Komunitas remaja Katolik usia 13-17 tahun, wadah pembinaan iman dan pengembangan karakter melalui katekese, sharing, outbound, dan pelayanan sebagai misdinar.</p>', 'Setiap Sabtu, 15.00 - 17.00 WIB', 'Ibu Maria', 1),
  ('Wanita Katolik', '<p>Organisasi wanita Katolik yang bergerak di bidang sosial, pendidikan, dan pemberdayaan perempuan: pembinaan rohani, kursus keterampilan, bakti sosial, dan pelayanan di gereja.</p>', 'Setiap Kamis Pertama, 09.00 - 11.00 WIB', 'Ibu Theresia', 2),
  ('Pria Katolik', '<p>Wadah bagi para pria Katolik untuk saling menguatkan dalam iman dan mengembangkan kepemimpinan Kristiani: rekoleksi bulanan, diskusi iman, bakti sosial, dan olahraga bersama.</p>', 'Setiap Sabtu Ketiga, 19.00 - 21.00 WIB', 'Bapak Yohanes', 3),
  ('Lansia', '<p>Komunitas bagi umat lanjut usia untuk tetap aktif dalam iman dan pelayanan: misa khusus lansia, rosario dan doa bersama, senam lansia, dan rekreasi rohani.</p>', 'Setiap Jumat Kedua, 09.00 - 11.00 WIB', 'Bapak Petrus', 4),
  ('Bina Iman Anak (BIA)', '<p>Program pembinaan iman bagi anak-anak usia 7-12 tahun melalui katekese interaktif, menyanyi, menggambar, dan drama alkitab, setiap Minggu setelah misa pagi.</p>', 'Setiap Minggu, 08.30 - 10.00 WIB (setelah misa)', 'Ibu Anna', 5),
  ('Legio Maria', '<p>Organisasi awam Katolik yang didedikasikan untuk pelayanan Gereja di bawah naungan Bunda Maria: pertemuan mingguan, doa rosario, visitasi umat, dan pelayanan kepada orang sakit.</p>', 'Setiap Rabu, 19.00 - 20.30 WIB', 'Ibu Elisabeth', 6);

-- Social ministries (from `karya_sosials`)
insert into social_ministries (name, description, icon, activities, sort_order) values
  ('Kunjungan Orang Sakit', 'Tim yang secara rutin mengunjungi umat yang sakit, baik di rumah maupun di rumah sakit, untuk memberikan dukungan rohani dan material.', 'Heart', '<ul><li>Kunjungan rutin mingguan</li><li>Pendampingan rohani</li><li>Bantuan materi sesuai kebutuhan</li></ul>', 0),
  ('Bantuan Sosial', 'Program bantuan untuk keluarga yang membutuhkan, terutama dalam situasi darurat atau kesulitan ekonomi.', 'Gift', '<ul><li>Bantuan sembako bulanan</li><li>Bantuan pendidikan anak</li><li>Bantuan biaya pengobatan</li><li>Santunan duka</li></ul>', 1),
  ('Panti Asuhan', 'Kemitraan dengan panti asuhan untuk memberikan dukungan material dan perhatian kepada anak-anak yatim piatu.', 'Calendar', '<ul><li>Kunjungan rutin bulanan</li><li>Bantuan kebutuhan sehari-hari</li><li>Kegiatan bersama anak-anak</li></ul>', 2),
  ('Panti Jompo', 'Program kunjungan dan bantuan untuk para lansia di panti jompo sebagai wujud hormat kepada orang tua.', 'BookOpen', '<ul><li>Kunjungan bulanan</li><li>Kegiatan bersama lansia</li><li>Bantuan kebutuhan harian</li></ul>', 3);

-- Mass intentions info (from `intensi_misas`)
insert into mass_intentions_info (
  id, contact_wa, format_info, deadline_info, offering_info,
  church_account_name, church_bank_name, church_account_number,
  social_account_name, social_bank_name, social_account_number
) values (
  1,
  '0812-5902-2020',
  '<p>Mohon mengirimkan intensi misa dengan format: Nama Pengaju, Nomor HP, Jenis Intensi (Syukur/Arwah/Niat Khusus), Nama yang Diintensikan, Tanggal & Waktu Misa yang diminta.</p>',
  '<p>Misa Minggu: paling lambat Kamis sebelum hari Minggu, jam 17.00 WIB. Misa Harian: H-2 sebelum tanggal yang diminta.</p>',
  '<p>Persembahan intensi misa bersifat sukarela sesuai kemampuan umat.</p>',
  'Stasi Yohanes Gabriel Perboyre', 'Bank Mandiri', '1234567890',
  'Karya Sosial Stasi Yohanes Gabriel Perboyre', 'Bank BCA', '0987654321'
);

-- Territories & neighborhoods (from `wilayahs` / `lingkungans`)
with t1 as (
  insert into territories (name, chairman) values ('Wilayah Santa Maria', 'Yohanes Budi Hartono') returning id
), t2 as (
  insert into territories (name, chairman) values ('Wilayah Santo Yoseph', 'Petrus Dwi Cahyono') returning id
), t3 as (
  insert into territories (name, chairman) values ('Wilayah Santo Paulus', 'Andreas Sugiarto') returning id
), t4 as (
  insert into territories (name, chairman) values ('Wilayah Santo Fransiskus', 'Thomas Agung Prasetyo') returning id
)
insert into neighborhoods (territory_id, name, chairman, family_count)
select id, 'Lingkungan Santo Stefanus', 'Stefanus Adi Nugroho', 45 from t1
union all select id, 'Lingkungan Santa Theresia', 'Maria Christina Dewi', 38 from t1
union all select id, 'Lingkungan Santo Lukas', 'Lukas Hendra Gunawan', 52 from t1
union all select id, 'Lingkungan Santo Markus', 'Markus Tri Handoko', 41 from t2
union all select id, 'Lingkungan Santa Anna', 'Anna Elisabeth Kurniawan', 36 from t2
union all select id, 'Lingkungan Santo Thomas', 'Thomas Agung Prasetyo', 48 from t3
union all select id, 'Lingkungan Santo Petrus', 'Petrus Antonius Wijaya', 44 from t3
union all select id, 'Lingkungan Santo Yohanes', 'Yohanes Paulus Santoso', 39 from t4
union all select id, 'Lingkungan Santa Maria Goretti', 'Maria Goretti Susilowati', 42 from t4;

-- Sacrament forms (from `formulirs` — file_url are placeholder Google Drive links, replace with real ones)
insert into sacrament_forms (name, category, description, file_url, sort_order) values
  ('Formulir Permohonan Baptis Dewasa', 'Sakramen Baptis', 'Untuk permohonan sakramen baptis bagi calon katekumen dewasa. Diserahkan ke sekretariat minimal 3 bulan sebelum pelaksanaan.', 'https://drive.google.com/drive/folders/PLACEHOLDER-baptis-dewasa', 0),
  ('Formulir Permohonan Baptis Bayi', 'Sakramen Baptis', 'Untuk permohonan sakramen baptis bayi. Orang tua diharapkan mengikuti kursus persiapan baptis sebelum pelaksanaan.', 'https://drive.google.com/drive/folders/PLACEHOLDER-baptis-bayi', 1),
  ('Formulir Permohonan Komuni Pertama', 'Sakramen Ekaristi', 'Pendaftaran untuk persiapan Komuni Pertama anak-anak. Anak harus berusia minimal 7 tahun dan sudah dibaptis.', 'https://drive.google.com/drive/folders/PLACEHOLDER-komuni-pertama', 2),
  ('Formulir Permohonan Krisma', 'Sakramen Krisma', 'Untuk calon penerima sakramen krisma. Calon harus sudah menerima sakramen baptis dan komuni pertama.', 'https://drive.google.com/drive/folders/PLACEHOLDER-krisma', 3),
  ('Formulir Permohonan Pemberkatan Nikah', 'Sakramen Pernikahan', 'Permohonan pemberkatan nikah Katolik. Diserahkan minimal 6 bulan sebelum tanggal pernikahan.', 'https://drive.google.com/drive/folders/PLACEHOLDER-nikah', 4),
  ('Surat Keterangan Aktif Mengikuti Misa', 'Administrasi', 'Permohonan surat keterangan aktif mengikuti misa untuk keperluan administrasi.', 'https://drive.google.com/drive/folders/PLACEHOLDER-surat-aktif-misa', 5),
  ('Formulir Permohonan Surat Baptis', 'Administrasi', 'Untuk meminta salinan surat baptis.', 'https://drive.google.com/drive/folders/PLACEHOLDER-surat-baptis', 6),
  ('Formulir Pendaftaran Katekumen Dewasa', 'Katekese', 'Pendaftaran untuk mengikuti program katekumen dewasa.', 'https://drive.google.com/drive/folders/PLACEHOLDER-katekumen', 7),
  ('Formulir Permohonan Intensi Misa', 'Liturgi', 'Untuk mengajukan intensi misa (syukur, arwah, niat khusus).', 'https://drive.google.com/drive/folders/PLACEHOLDER-intensi-misa', 8),
  ('Formulir Pendaftaran Kategorial', 'Kategorial', 'Pendaftaran untuk bergabung dengan berbagai kategorial (Mudika, OMK, Wanita Katolik, dll).', 'https://drive.google.com/drive/folders/PLACEHOLDER-kategorial', 9);

-- Announcements (from `pengumumans`)
insert into announcements (title, slug, category, content, is_priority, published_at) values
  ('Pengumuman: Jadwal Misa Minggu Paskah', 'jadwal-misa-minggu-paskah', 'Pengumuman Paroki', '<p>Kepada seluruh umat, berikut jadwal Misa pada Minggu Paskah:</p><ul><li>Sabtu Vigili Paskah: 19.00 WIB</li><li>Minggu Misa Paskah: 06.00 WIB &amp; 08.00 WIB</li></ul><p>Umat diharapkan hadir 15 menit sebelum misa dimulai. Selamat Paskah, Kristus telah bangkit, Alleluia!</p>', false, current_date - 30),
  ('Pengumuman: Pendaftaran Katekumen Dewasa', 'pendaftaran-katekumen-dewasa', 'Pengumuman Paroki', '<p>Stasi membuka pendaftaran Katekumen Dewasa. Waktu &amp; tempat: setiap hari Sabtu, 16.00-18.00 WIB di Ruang Katekese.</p><p>Informasi &amp; pendaftaran hubungi sekretariat stasi.</p>', true, current_date - 5),
  ('Pengumuman Paroki: Penutupan Sementara Sekretariat', 'penutupan-sementara-sekretariat', 'Pengumuman Paroki', '<p>Sekretariat akan ditutup sementara dalam rangka pemeliharaan sistem administrasi. Untuk keperluan mendesak, dapat menghubungi kontak sekretariat.</p>', false, current_date - 12);

-- Articles (from `artikels`, published only)
insert into articles (title, slug, author, content, cover_image_url, category_id, status, published_at)
select
  v.title, v.slug, v.author, v.content, v.cover_image_url,
  (select id from categories where slug = v.category_slug),
  v.status, v.published_at
from (
  values
    ('Perayaan Paskah di Stasi Yohanes Gabriel Perboyre', 'perayaan-paskah',
     'Tim Redaksi',
     'Perayaan Paskah di Stasi Yohanes Gabriel Perboyre berlangsung dengan khidmat dan meriah. Misa Paskah dipimpin oleh Romo Paroki dengan dihadiri ratusan umat dari berbagai lingkungan. Acara dimulai dengan Vigili Paskah pada Sabtu malam, dilanjutkan dengan Misa Paskah pada hari Minggu pagi.',
     'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1200&q=80',
     'kegiatan-paroki', 'published', current_date - 90),
    ('Retret Kaum Muda: Menemukan Makna Hidup di Era Digital', 'retret-kaum-muda',
     'Kategorial Mudika',
     'Kategorial Mudika mengadakan kegiatan retret dengan tema "Menemukan Makna Hidup di Era Digital", diikuti puluhan peserta dari berbagai lingkungan. Para peserta diajak merefleksikan hubungan mereka dengan Tuhan, sesama, dan diri sendiri melalui sharing session, adorasi, dan misa bersama.',
     'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80',
     'kategorial', 'published', current_date - 60),
    ('Bakti Sosial: Berbagi Kasih dengan Sesama', 'bakti-sosial-berbagi-kasih',
     'Panitia Baksos',
     'Dalam rangka mempererat tali persaudaraan, stasi mengadakan kegiatan bakti sosial berupa pembagian paket sembako kepada warga kurang mampu di sekitar wilayah stasi. Kegiatan ini rutin dilakukan sebagai bentuk kepedulian sosial.',
     'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80',
     'sosial', 'published', current_date - 45),
    ('Program Katekese Anak: Mengenal Kasih Yesus Sejak Dini', 'program-katekese-anak',
     'Tim Katekese',
     'Program katekese anak terus berjalan dengan antusias. Setiap hari Minggu setelah misa pagi, anak-anak berkumpul untuk belajar iman Katolik dengan cara menyenangkan: menggambar, menyanyi, permainan edukatif, dan drama.',
     'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1200&q=80',
     'kegiatan-paroki', 'published', current_date - 20)
) as v(title, slug, author, content, cover_image_url, category_slug, status, published_at)
;

-- Galleries (from `galeris`)
with g1 as (
  insert into galleries (title, google_photo_url) values ('Perayaan Paskah', 'https://photos.app.goo.gl/example-paskah') returning id
), g2 as (
  insert into galleries (title, google_photo_url) values ('Bakti Sosial', 'https://photos.app.goo.gl/example-baksos') returning id
)
insert into gallery_images (gallery_id, image_url, caption, sort_order)
select id, 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80', 'Vigili Paskah', 0 from g1
union all select id, 'https://images.unsplash.com/photo-1490127252417-7c393f993ee4?w=800&q=80', 'Misa Paskah Pagi', 1 from g1
union all select id, 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&q=80', 'Penyaluran sembako', 0 from g2
union all select id, 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80', 'Tim relawan', 1 from g2;

-- ==========================================================================
-- Organization members (BGKS & DPS) — from BGKS dan DPS Structure.xlsx
-- Hierarchical: Kabid/top-level > Kasie > Subsie > member
-- ==========================================================================

do $$
declare
  bgks_root uuid;
  dps_root uuid;
  kabid_pembinaan uuid;
  kasie_biak uuid;
  kasie_pra_rekat uuid;
  kasie_omk uuid;
  kasie_keluarga uuid;
  kasie_lansia uuid;
  kasie_difabel uuid;
  kabid_sumber uuid;
  kasie_liturgi uuid;
  subsie_misdinar uuid;
  subsie_lektor uuid;
  subsie_pemazmur uuid;
  subsie_koor uuid;
  subsie_puk uuid;
  subsie_dekorasi uuid;
  subsie_sakristan uuid;
  kasie_katekese uuid;
  kasie_kerasulan_kitab_suci uuid;
  kabid_kerasulan_umum uuid;
  kasie_pse uuid;
  kasie_hub_agama uuid;
  kasie_kerasulan_awam uuid;
  kabid_kerasulan_khusus uuid;
  kasie_pendidikan uuid;
  kasie_animasi_panggilan uuid;
  kasie_komsos uuid;
begin
  -- BGKS
  insert into organization_members (group_name, position_title, member_name, sort_order) values ('BGKS', 'Ketua', 'RD. AP Dwi Joko', 0) returning id into bgks_root;
  insert into organization_members (group_name, position_title, member_name, sort_order) values
    ('BGKS', 'Sekretaris', 'Nikolas Hendry Dinata', 1),
    ('BGKS', 'Sekretaris', 'Stefanus Gunawan Setiawan Hoetomo', 2),
    ('BGKS', 'Bendahara', 'Laurensia Lim Tjiu Lie [ Mei Hua ]', 3),
    ('BGKS', 'Bendahara', 'Fince Bakahusu', 4),
    ('BGKS', 'Bid. Kepegawaian', 'Frederikus Feliks Feryanto', 5),
    ('BGKS', 'Bid. Aset', 'Aloysius Ronny Prayitno', 6),
    ('BGKS', 'Bid. Aset', 'Eko Hanggara', 7),
    ('BGKS', 'Bid. Rumah Tangga Stasi', 'Brigitta Tjen Wan Wan', 8),
    ('BGKS', 'Bid. Rumah Tangga Stasi', 'Veronica Yinia', 9),
    ('BGKS', 'Bid. Rumah Tangga Stasi', 'Chatarina Novianti', 10);

  -- DPS — Kabid. Pembinaan branch
  insert into organization_members (group_name, position_title, member_name, sort_order) values ('DPS', 'Kabid. Pembinaan', 'Monica Widiasri', 20) returning id into kabid_pembinaan;

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. BIAK', 'Yohana Anita Damarastuti', kabid_pembinaan, 21) returning id into kasie_biak;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. BIAK', 'Rosalia Murni', kabid_pembinaan, 22);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Pra-Rekat & Rekat', 'Carolin Diana Sari', kabid_pembinaan, 23) returning id into kasie_pra_rekat;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Pra-Rekat & Rekat', 'Melania Lani Sutjiadi', kabid_pembinaan, 24);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. OMK', 'Elizabeth Luh Made Diandra A.K.', kabid_pembinaan, 25) returning id into kasie_omk;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. OMK', 'FX. Edwin Handojo', kabid_pembinaan, 26);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Keluarga', 'Paulus Sonny Kurniawan & Bernadette Defie Natalia', kabid_pembinaan, 27) returning id into kasie_keluarga;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Keluarga', 'Yohanes Kwa Sugianto & Agatha Erly Chistina', kabid_pembinaan, 28);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Lansia', 'Maria Felicitas Melani Hartanto', kabid_pembinaan, 29) returning id into kasie_lansia;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Difabel', 'Helena Caroline Kis Agustin', kabid_pembinaan, 30) returning id into kasie_difabel;

  -- DPS — Kabid. Sumber branch (Liturgi & sub-seksi)
  insert into organization_members (group_name, position_title, member_name, sort_order) values ('DPS', 'Kabid. Sumber', 'Veronica Ria Marina Erawati', 40) returning id into kabid_sumber;

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Liturgi', 'Eufrasia Julia', kabid_sumber, 41) returning id into kasie_liturgi;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Liturgi', 'Lidya Valentina Erlin S.', kabid_sumber, 42);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Misdinar', 'Andreas Andika Putera Sunhagia', kasie_liturgi, 43) returning id into subsie_misdinar;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values
    ('DPS', 'Subsie. Misdinar', 'Fransiska Tarman Niastuti', kasie_liturgi, 44),
    ('DPS', 'Subsie. Misdinar', 'Nickolas Billy Damadji', kasie_liturgi, 45);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Lektor', 'Maria Gabriella Gaby', kasie_liturgi, 46) returning id into subsie_lektor;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values
    ('DPS', 'Subsie. Lektor', 'Ellen Candrawaty', kasie_liturgi, 47),
    ('DPS', 'Subsie. Lektor', 'dr. Frans Octavius Hari Prasetyadi', kasie_liturgi, 48);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Pemazmur', 'Yohana Anita Damarastuti', kasie_liturgi, 49) returning id into subsie_pemazmur;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Pemazmur', 'Indrawasih', kasie_liturgi, 50);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Koor & Organis', 'Anna Husada', kasie_liturgi, 51) returning id into subsie_koor;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Koor & Organis', 'Maureen Angela', kasie_liturgi, 52);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. PUK', 'Antonius Xaverius Handoko Edy', kasie_liturgi, 53) returning id into subsie_puk;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. PUK', 'Agus Purnomo', kasie_liturgi, 54);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Dekorasi', 'Lydia Natalia Tantoso', kasie_liturgi, 55) returning id into subsie_dekorasi;

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Sakristan', 'Margaretta Fenny', kasie_liturgi, 56) returning id into subsie_sakristan;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Subsie. Sakristan', 'Jo Lenny Octavia', kasie_liturgi, 57);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Katekese', 'Marselina Phang Friska Milyanti', kabid_sumber, 58) returning id into kasie_katekese;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Katekese', 'Vincentia Ria Elleonora', kabid_sumber, 59);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Kerasulan Kitab Suci', 'F. Paulina Indrawati Djapri', kabid_sumber, 60) returning id into kasie_kerasulan_kitab_suci;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Kerasulan Kitab Suci', 'Lae Rita Maria Lasakar', kabid_sumber, 61);

  -- DPS — Kabid. Kerasulan Umum branch
  insert into organization_members (group_name, position_title, member_name, sort_order) values ('DPS', 'Kabid. Kerasulan Umum', 'Herman Yoseph Aiwan', 70) returning id into kabid_kerasulan_umum;

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. PSE', 'Robertus Armada', kabid_kerasulan_umum, 71) returning id into kasie_pse;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. PSE', 'Grace Anggeine', kabid_kerasulan_umum, 72);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Hub. Antar Agama & Kepercayaan', 'Simon Benyamin', kabid_kerasulan_umum, 73) returning id into kasie_hub_agama;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Hub. Antar Agama & Kepercayaan', 'Andreas Nunung Sulistya', kabid_kerasulan_umum, 74);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Kerasulan Awam', 'Dr. Frans Octavius Hari Prasetyadi', kabid_kerasulan_umum, 75) returning id into kasie_kerasulan_awam;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Kerasulan Awam', 'Albertus Adi Prastanto', kabid_kerasulan_umum, 76);

  -- DPS — Kabid. Kerasulan Khusus branch
  insert into organization_members (group_name, position_title, member_name, sort_order) values ('DPS', 'Kabid. Kerasulan Khusus', 'Petrus Kelake Raya Keban', 80) returning id into kabid_kerasulan_khusus;

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Pendidikan', 'Monika Maria Tjantri Trestanti', kabid_kerasulan_khusus, 81) returning id into kasie_pendidikan;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Pendidikan', 'Imelda Angkawijaya', kabid_kerasulan_khusus, 82);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Animasi Panggilan', 'V. Dahlia Adiati', kabid_kerasulan_khusus, 83) returning id into kasie_animasi_panggilan;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Animasi Panggilan', 'V. Ninuk Juliana Kristiani', kabid_kerasulan_khusus, 84);

  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Komunikasi Sosial', 'Alfonsus Ligouri Handoyo Gozali', kabid_kerasulan_khusus, 85) returning id into kasie_komsos;
  insert into organization_members (group_name, position_title, member_name, parent_id, sort_order) values ('DPS', 'Kasie. Komunikasi Sosial', 'Fidelis Vincent Edy Hartono', kabid_kerasulan_khusus, 86);
end $$;
