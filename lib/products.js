import { supabase } from "./supabaseClient";

const FALLBACK_COLORS = ["#BE5A2A", "#22405C", "#D19A34", "#9A4720", "#2A1C12"];
const BUCKET = "produit";
export const MAX_IMAGES = 5;

function randomColor() {
  return FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)];
}

// Envoie une photo dans le bucket Supabase Storage et renvoie son URL publique.
export async function uploadProductImage(file, vendorId) {
  if (!supabase || !file) return null;
  const ext = file.name.split(".").pop();
  const path = `${vendorId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Envoie jusqu'à 5 photos et renvoie la liste de leurs URLs publiques.
export async function uploadProductImages(files, vendorId) {
  const list = Array.from(files || []).slice(0, MAX_IMAGES);
  const urls = [];
  for (const file of list) {
    const url = await uploadProductImage(file, vendorId);
    if (url) urls.push(url);
  }
  return urls;
}

export async function addProduct({ vendorId, boutique, ville, cat, name, price, description, imageFiles }) {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");

  const images = imageFiles && imageFiles.length ? await uploadProductImages(imageFiles, vendorId) : [];

  const { error } = await supabase.from("products").insert({
    vendor_id: vendorId,
    cat,
    name,
    vendor: boutique,
    city: ville,
    price: Number(price),
    rating: 5,
    color: randomColor(),
    description,
    image_url: images[0] || null,
    images,
  });
  if (error) throw error;
}

export async function getVendorProducts(vendorId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function deleteProduct(id) {
  if (!supabase) return;
  await supabase.from("products").delete().eq("id", id);
}

export async function updateProduct(id, { name, cat, price, description }) {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");
  const { error } = await supabase
    .from("products")
    .update({ name, cat, price: Number(price), description })
    .eq("id", id);
  if (error) throw error;
}
