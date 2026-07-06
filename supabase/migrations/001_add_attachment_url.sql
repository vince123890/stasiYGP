-- Adds optional Google Drive attachment links to articles and announcements.
-- Run this in the Supabase SQL editor after the base schema.sql.

alter table articles add column if not exists attachment_url text;
alter table announcements add column if not exists attachment_url text;
