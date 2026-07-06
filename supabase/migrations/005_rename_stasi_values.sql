-- Renames "Stasi" -> "Paroki" in constrained enum-like columns and existing data.
-- Run this in the Supabase SQL editor after migrations 001-004.

-- announcements.category: 'Pengumuman Stasi' -> 'Pengumuman Paroki'
do $$
declare
  conname text;
begin
  select con.conname into conname
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'announcements' and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%category%';
  if conname is not null then
    execute format('alter table announcements drop constraint %I', conname);
  end if;
end $$;

update announcements set category = 'Pengumuman Paroki' where category = 'Pengumuman Stasi';

alter table announcements add constraint announcements_category_check
  check (category in ('Pernikahan', 'Tahbisan Imam', 'Tahbisan Diakon', 'Pengumuman Paroki'));

-- pastors.priest_type: 'Romo Paroki/Stasi' -> 'Romo Paroki'
do $$
declare
  conname text;
begin
  select con.conname into conname
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'pastors' and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%priest_type%';
  if conname is not null then
    execute format('alter table pastors drop constraint %I', conname);
  end if;
end $$;

update pastors set priest_type = 'Romo Paroki' where priest_type = 'Romo Paroki/Stasi';

alter table pastors add constraint pastors_priest_type_check
  check (priest_type in ('Romo Paroki', 'Romo Rekan'));
