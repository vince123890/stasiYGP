# StasiYGP

Website resmi Stasi Yohanes Gabriel Perboyre — Next.js (App Router) + Supabase.

## Menjalankan secara lokal

1. Salin `.env.local.example` menjadi `.env.local` dan isi kredensial Supabase Anda:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
2. Jalankan `supabase/schema.sql` di SQL Editor project Supabase Anda (membuat tabel + data contoh).
3. Install dependency dan jalankan dev server:
   ```
   npm install
   npm run dev
   ```

## Struktur

- `src/app` — halaman (Beranda, Jadwal Misa, Artikel & Pengumuman) dan API routes internal (`/api/*`).
- `src/components` — komponen UI, layout, dan section per halaman.
- `src/lib` — Supabase client/server, query data, util format tanggal & warna liturgi.
- `supabase/schema.sql` — skema database dan data contoh (seed).

## Deploy

Proyek ini siap di-deploy ke Vercel. Tambahkan environment variable `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` di pengaturan project Vercel.
