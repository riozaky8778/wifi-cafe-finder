-- Run this in Supabase SQL Editor to add photo support

-- 1. Create storage bucket for cafe photos
insert into storage.buckets (id, name, public)
values ('cafe-photos', 'cafe-photos', true);

-- 2. Allow anyone to view photos
create policy "photos are public"
on storage.objects for select
using ( bucket_id = 'cafe-photos' );

-- 3. Allow authenticated users to upload photos
create policy "authenticated can upload photos"
on storage.objects for insert
with check (
  bucket_id = 'cafe-photos'
  and auth.role() = 'authenticated'
);

-- 4. Allow users to delete their own photos
create policy "users can delete own photos"
on storage.objects for delete
using (
  bucket_id = 'cafe-photos'
  and auth.uid() = owner
);

-- 5. Add photo_urls column to reviews table
alter table reviews add column if not exists photo_urls text[] default '{}';

-- 6. Add cover_photo_url to cafes table
alter table cafes add column if not exists cover_photo_url text;
