-- Adds a Google Maps embed URL to the parish profile for the location map.
-- Run this in the Supabase SQL editor after migrations 001-003.

alter table parish_profile add column if not exists map_embed_url text;

update parish_profile
set map_embed_url = 'https://www.google.com/maps?q=-7.2703455,112.812843&z=17&output=embed'
where id = 1 and map_embed_url is null;
