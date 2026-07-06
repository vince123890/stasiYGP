-- Corrects the parish location map to the right coordinates.
-- Run this in the Supabase SQL editor after migrations 001-006.

update parish_profile
set map_embed_url = 'https://www.google.com/maps?q=-7.2703455,112.812843&z=17&output=embed'
where id = 1;
