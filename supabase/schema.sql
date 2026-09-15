-- À exécuter dans Supabase → SQL Editor.
-- Une fois ces tables créées et vos clés ajoutées dans .env.local,
-- le site utilisera automatiquement Supabase (vrais vendeurs et produits)
-- au lieu des données de démonstration.

-- Un vendeur = un compte Supabase Auth (email + mot de passe) + une ligne
-- ici avec les infos de sa boutique. user_id relie les deux.
create table vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  boutique text not null,
  ville text not null,
  telephone text not null,
  email text not null,
  description text,
  verifie boolean default false,
  created_at timestamp default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete cascade,
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

-- Sécurité (Row Level Security) :
alter table vendors enable row level security;
alter table products enable row level security;

-- Tout le monde peut voir les boutiques et produits (catalogue public)
create policy "Lecture publique des boutiques" on vendors for select using (true);
create policy "Lecture publique des produits" on products for select using (true);

-- Un vendeur ne peut créer/modifier que SA PROPRE boutique
create policy "Un vendeur crée sa boutique" on vendors for insert with check (auth.uid() = user_id);
create policy "Un vendeur modifie sa boutique" on vendors for update using (auth.uid() = user_id);

-- Un vendeur ne peut ajouter/modifier/supprimer que SES PROPRES produits
create policy "Un vendeur ajoute ses produits" on products for insert
  with check (vendor_id in (select id from vendors where user_id = auth.uid()));
create policy "Un vendeur modifie ses produits" on products for update
  using (vendor_id in (select id from vendors where user_id = auth.uid()));
create policy "Un vendeur supprime ses produits" on products for delete
  using (vendor_id in (select id from vendors where user_id = auth.uid()));
