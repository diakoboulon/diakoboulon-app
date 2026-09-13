-- À exécuter dans Supabase → SQL Editor.
-- Une fois ces tables créées et vos clés ajoutées dans .env.local,
-- lib/data.js utilisera automatiquement Supabase au lieu des données de démo.

create table vendors (
  id uuid primary key default gen_random_uuid(),
  boutique text not null,
  ville text not null,
  telephone text not null,
  description text,
  verifie boolean default false,
  created_at timestamp default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id),
  cat text not null, -- 'alimentaire' | 'beaute' | 'textile' | 'artisanat'
  name text not null,
  vendor text not null,
  city text not null,
  price integer not null, -- en FCFA
  rating numeric default 5,
  color text default '#BE5A2A',
  desc text,
  created_at timestamp default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null,
  total integer not null,
  payment_method text not null,
  status text default 'en_preparation', -- en_preparation | expediee | livree
  created_at timestamp default now()
);

-- Sécurité de base : lecture publique des produits, écriture restreinte
alter table products enable row level security;
create policy "Lecture publique des produits" on products for select using (true);
