import { supabase } from "./supabaseClient";

const FALLBACK_COLORS = ["#BE5A2A", "#22405C", "#D19A34", "#9A4720", "#2A1C12"];

function randomColor() {
  return FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)];
}

// Envoie la photo dans le bucket Supabase Storage "produits" et renvoie son URL publique.
export async function uploadProductImage(file, vendorId) {
  if (!supabase || !file) return null;
  const ext = file.name.split(".").pop();
  const path = `${vendorId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from("produits").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("produits").getPublicUrl(path);
  return data.publicUrl;
}

export async function addProduct({ vendorId, boutique, ville, cat, name, price, description, imageFile }) {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");

  let imageUrl = null;
  if (imageFile) {
    imageUrl = await uploadProductImage(imageFile, vendorId);
  }

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
    image_url: imageUrl,
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
