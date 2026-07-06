-- Updates the stored parish display name from "Stasi" to "Paroki".
-- Run this in the Supabase SQL editor after migrations 001-005.

update parish_profile
set stasi_name = 'Paroki Yohanes Gabriel Perboyre'
where id = 1 and stasi_name = 'Stasi Yohanes Gabriel Perboyre';
