-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Cafes table
create table cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  lat float,
  lng float,
  google_place_id text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Reviews table
create table reviews (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid references cafes(id) on delete cascade,
  user_id uuid references auth.users(id),
  wifi_score int check (wifi_score between 1 and 5),
  vibe_score int check (vibe_score between 1 and 5),
  noise_score int check (noise_score between 1 and 5),
  wifi_speed text check (wifi_speed in ('< 5 Mbps', '5-20 Mbps', '20-50 Mbps', '> 50 Mbps')),
  facilities text[],
  suitable_for text[],
  comment text,
  created_at timestamptz default now()
);

-- View: cafe with averaged ratings
create or replace view cafes_with_ratings as
select
  c.*,
  round(avg(r.wifi_score)::numeric, 1) as avg_wifi,
  round(avg(r.vibe_score)::numeric, 1) as avg_vibe,
  round(avg(r.noise_score)::numeric, 1) as avg_noise,
  count(r.id) as review_count
from cafes c
left join reviews r on r.cafe_id = c.id
group by c.id;

-- Row Level Security
alter table cafes enable row level security;
alter table reviews enable row level security;

-- Policies: anyone can read
create policy "cafes are public" on cafes for select using (true);
create policy "reviews are public" on reviews for select using (true);

-- Policies: only logged-in users can insert
create policy "authenticated can add cafe" on cafes for insert with check (auth.role() = 'authenticated');
create policy "authenticated can add review" on reviews for insert with check (auth.uid() = user_id);
