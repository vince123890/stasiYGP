-- Renames "Romo" -> "Pastor" across pastors data (priest_type, nickname, biography)
-- and free-text content that mentions "Romo" (articles, announcements, history).
-- Run this in the Supabase SQL editor after migrations 001-007.

-- priest_type: enum-like column + constraint
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

update pastors set priest_type = 'Pastor Paroki' where priest_type = 'Romo Paroki';
update pastors set priest_type = 'Pastor Rekan' where priest_type = 'Romo Rekan';

alter table pastors add constraint pastors_priest_type_check
  check (priest_type in ('Pastor Paroki', 'Pastor Rekan'));

-- Free-text mentions of "Romo" elsewhere in pastor records and content.
update pastors
  set nickname = replace(nickname, 'Romo', 'Pastor')
  where nickname ilike '%Romo%';

update pastors
  set biography = replace(biography, 'Romo', 'Pastor')
  where biography ilike '%Romo%';

update articles
  set content = replace(content, 'Romo', 'Pastor')
  where content ilike '%Romo%';

update announcements
  set content = replace(content, 'Romo', 'Pastor')
  where content ilike '%Romo%';

update parish_history
  set content = replace(content, 'Romo', 'Pastor')
  where content ilike '%Romo%';
