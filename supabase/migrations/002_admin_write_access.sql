-- Grants authenticated users (the admin account) write access to all content
-- tables, and sets up a public 'media' storage bucket for CMS image uploads.
-- Run this in the Supabase SQL editor after schema.sql and migration 001.

do $$
declare
  t text;
  tables text[] := array[
    'categories', 'articles', 'article_images',
    'announcements', 'announcement_images',
    'mass_schedules', 'organization_members', 'hero_slides',
    'liturgical_calendar', 'sacrament_forms',
    'galleries', 'gallery_images', 'mass_intentions_info',
    'social_ministries', 'categorical_groups',
    'territories', 'neighborhoods', 'pastors',
    'parish_profile', 'parish_history'
  ];
begin
  foreach t in array tables loop
    execute format(
      'create policy "authenticated insert %1$s" on %1$s for insert to authenticated with check (true)',
      t
    );
    execute format(
      'create policy "authenticated update %1$s" on %1$s for update to authenticated using (true) with check (true)',
      t
    );
    execute format(
      'create policy "authenticated delete %1$s" on %1$s for delete to authenticated using (true)',
      t
    );
  end loop;
end $$;

-- Storage bucket for CMS-uploaded images
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

create policy "authenticated upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

create policy "authenticated update media" on storage.objects
  for update to authenticated using (bucket_id = 'media');

create policy "authenticated delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
