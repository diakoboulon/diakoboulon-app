import { supabase } from "./supabaseClient";

export const CATEGORY_LABELS = {
  alimentaire: "Alimentaire",
  beaute: "Beauté & bien-être",
  textile: "Mode & textile",
  artisanat: "Artisanat & déco",
};

// Produits de démonstration : utilisés tant que Supabase n'est pas connecté.
// Une fois vos variables d'environnement remplies (.env.local) et la table
// "products" créée (voir supabase/schema.sql), remplacez ces données par les
// vraies boutiques de vos vendeurs.
export const DEMO_PRODUCTS = [
  { id: 1, cat: "alimentaire", name: "Jus de mangue pasteurisé, 1L", vendor: "Saveurs de Sikasso", city: "Sikasso", price: 2000, rating: 4.8, color: "#D19A34", desc: "Jus 100% mangue locale, sans sucre ajouté, pasteurisé et conditionné à Sikasso." },
  { id: 2, cat: "beaute", name: "Beurre de karité brut, 500g", vendor: "Karité de Ségou", city: "Ségou", price: 3500, rating: 4.9, color: "#22405C", desc: "Beurre de karité pur, extrait à froid par une coopérative de femmes de Ségou." },
  { id: 3, cat: "textile", name: "Tissu bogolan fait main, 2m", vendor: "Atelier Bogolan Fana", city: "Bamako", price: 15000, rating: 4.7, color: "#BE5A2A", desc: "Bogolan traditionnel teint à la boue, motifs uniques peints à la main." },
  { id: 4, cat: "alimentaire", name: "Mangue séchée bio, 250g", vendor: "Saveurs de Sikasso", city: "Sikasso", price: 2500, rating: 4.6, color: "#9A4720", desc: "Mangues séchées sans additifs, séchage solaire artisanal." },
  { id: 5, cat: "artisanat", name: "Panier en fibres tressées", vendor: "Coopérative Djenné Artisanat", city: "Djenné", price: 8000, rating: 4.5, color: "#D19A34", desc: "Panier tressé à la main, idéal rangement ou décoration." },
  { id: 6, cat: "beaute", name: "Savon noir traditionnel", vendor: "Karité de Ségou", city: "Ségou", price: 1500, rating: 4.7, color: "#22405C", desc: "Savon noir africain à base de karité et de cendres de cacao, fait main." },
  { id: 7, cat: "artisanat", name: "Poterie en terre cuite", vendor: "Atelier Terre de Kati", city: "Kati", price: 6000, rating: 4.4, color: "#BE5A2A", desc: "Poterie utilitaire façonnée et cuite selon les techniques traditionnelles." },
  { id: 8, cat: "textile", name: "Boubou bazin riche brodé", vendor: "Atelier Bogolan Fana", city: "Bamako", price: 32000, rating: 4.9, color: "#9A4720", desc: "Bazin riche brodé main, coupe traditionnelle, sur mesure possible." },
];

// Renvoie les produits depuis Supabase si connecté, sinon les données de démo.
export async function getProducts() {
  if (!supabase) return DEMO_PRODUCTS;
  const { data, error } = await supabase.from("products").select("*");
  if (error || !data || data.length === 0) return DEMO_PRODUCTS;
  return data;
}

export async function getProduct(id) {
  const products = await getProducts();
  return products.find((p) => String(p.id) === String(id));
}
