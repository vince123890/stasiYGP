-- Adds Bacaan Ofisi / Liturgi Jam (office reading) to the liturgical calendar.
-- Run this in the Supabase SQL editor after migrations 001 and 002.

alter table liturgical_calendar add column if not exists office_reading text;
