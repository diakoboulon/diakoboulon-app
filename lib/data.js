import { supabase } from "./supabaseClient";

export const CATEGORY_LABELS = {
  electronique: "Électronique",
  mode: "Mode",
  maison: "Maison",
  beaute: "Beauté",
  agroalimentaire: "Agroalimentaire",
  bien_etre: "Bien-être",
  accessoires: "Accessoires",
  mobilier: "Mobilier",
};

// Produits de démonstration : utilisés tant que Supabase n'est pas connecté.
// Une fois vos variables d'environnement remplies (.env.local) et la table
// "products" créée (voir supabase/schema.sql), remplacez ces données par les
// vraies boutiques de vos vendeurs.
export const DEMO_PRODUCTS = [
  { id: 1, cat: "agroalimentaire", name: "Jus de mangue pasteurisé, 1L", vendor: "Saveurs de Sikasso", city: "Sikasso", price: 2000, rating: 4.8, ratingCount: 64, color: "#D19A34", desc: "Jus 100% mangue locale, sans sucre ajouté, pasteurisé et conditionné à Sikasso." },
  { id: 2, cat: "beaute", name: "Beurre de karité brut, 500g", vendor: "Karité de Ségou", city: "Ségou", price: 3500, rating: 4.9, ratingCount: 41, color: "#22405C", desc: "Beurre de karité pur, extrait à froid par une coopérative de femmes de Ségou." },
  { id: 3, cat: "mode", name: "Tissu bogolan fait main, 2m", vendor: "Atelier Bogolan Fana", city: "Bamako", price: 15000, rating: 4.7, ratingCount: 58, color: "#BE5A2A", desc: "Bogolan traditionnel teint à la boue, motifs uniques peints à la main." },
  { id: 4, cat: "agroalimentaire", name: "Mangue séchée bio, 250g", vendor: "Saveurs de Sikasso", city: "Sikasso", price: 2500, rating: 4.6, ratingCount: 37, color: "#9A4720", desc: "Mangues séchées sans additifs, séchage solaire artisanal." },
  { id: 5, cat: "maison", name: "Panier en fibres tressées", vendor: "Coopérative Djenné Artisanat", city: "Djenné", price: 8000, rating: 4.5, ratingCount: 22, color: "#D19A34", desc: "Panier tressé à la main, idéal rangement ou décoration." },
  { id: 6, cat: "beaute", name: "Savon noir traditionnel", vendor: "Karité de Ségou", city: "Ségou", price: 1500, rating: 4.7, ratingCount: 96, color: "#22405C", desc: "Savon noir africain à base de karité et de cendres de cacao, fait main." },
  { id: 7, cat: "maison", name: "Poterie en terre cuite", vendor: "Atelier Terre de Kati", city: "Kati", price: 6000, rating: 4.4, ratingCount: 19, color: "#BE5A2A", desc: "Poterie utilitaire façonnée et cuite selon les techniques traditionnelles." },
  { id: 8, cat: "mode", name: "Boubou bazin riche brodé", vendor: "Atelier Bogolan Fana", city: "Bamako", price: 32000, rating: 4.9, ratingCount: 73, color: "#9A4720", desc: "Bazin riche brodé main, coupe traditionnelle, sur mesure possible." },
  { id: 9, cat: "electronique", name: "Chargeur solaire portable", vendor: "TechSahel Bamako", city: "Bamako", price: 12500, rating: 4.5, ratingCount: 128, color: "#22405C", desc: "Chargeur solaire nomade, idéal pour les zones à coupures fréquentes." },
  { id: 10, cat: "electronique", name: "Écouteurs sans fil", vendor: "TechSahel Bamako", city: "Bamako", price: 9000, rating: 4.3, ratingCount: 85, color: "#2A1C12", desc: "Écouteurs Bluetooth avec étui de charge, autonomie 20h." },
];

// Renvoie les produits depuis Supabase si connecté, sinon les données de démo.
export async function getProducts() {
  if (!supabase) return DEMO_PRODUCTS;
  const { data, error } = await supabase.from("products").select("*");
  if (error || !data || data.length === 0) return DEMO_PRODUCTS;
  return data;
}

export async function getVendorInfo(vendorId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from("vendors")
    .select("id, boutique, ville, description, verifie, telephone")
    .eq("id", vendorId)
    .single();
  return data;
}

export async function getProduct(id) {
  const products = await getProducts();
  return products.find((p) => String(p.id) === String(id));
}
