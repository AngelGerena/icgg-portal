-- ============================================================
-- ICGG Event Flyers — one-time Supabase Storage setup
-- Run this once in the Supabase SQL editor (project aiwvtlyggvesdgnwjvth)
-- ============================================================

-- 1. Create a public storage bucket for event flyers
insert into storage.buckets (id, name, public)
values ('event-flyers', 'event-flyers', true)
on conflict (id) do nothing;

-- 2. Allow ANYONE to READ flyers (public site needs this)
create policy "Public read event flyers"
on storage.objects for select
using ( bucket_id = 'event-flyers' );

-- 3. Allow AUTHENTICATED users (portal admins) to UPLOAD
create policy "Authenticated upload event flyers"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'event-flyers' );

-- 4. Allow AUTHENTICATED users to UPDATE/REPLACE their flyers
create policy "Authenticated update event flyers"
on storage.objects for update
to authenticated
using ( bucket_id = 'event-flyers' );

-- 5. Allow AUTHENTICATED users to DELETE flyers
create policy "Authenticated delete event flyers"
on storage.objects for delete
to authenticated
using ( bucket_id = 'event-flyers' );
