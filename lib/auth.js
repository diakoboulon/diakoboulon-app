import { supabase } from "./supabaseClient";

// Supabase Auth exige un email. Comme nos utilisateurs se connectent avec un
// numéro de téléphone (clients) ou un nom d'utilisateur (vendeurs), on
// fabrique une adresse "technique" à partir de cet identifiant.
function toEmail(identifiant) {
  const clean = identifiant.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${clean}@diakoboulon.local`;
}

export function authDisabledError() {
  return new Error(
    "La connexion n'est pas encore configurée sur ce site (Supabase n'est pas branché)."
  );
}

export async function signUpClient({ nom, telephone, password }) {
  if (!supabase) throw authDisabledError();
  const email = toEmail(telephone);
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      role: "client",
      identifiant: telephone,
      nom,
      telephone,
    });
    if (profileError) throw profileError;
  }
  return data;
}

export async function signUpVendeur({ username, password, boutique, ville, telephone, description }) {
  if (!supabase) throw authDisabledError();
  const email = toEmail(username);
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      role: "vendeur",
      identifiant: username,
      nom: boutique,
      telephone,
    });
    if (profileError) throw profileError;

    const { error: vendorError } = await supabase.from("vendors").insert({
      profile_id: userId,
      boutique,
      ville,
      telephone,
      description,
      verifie: false,
    });
    if (vendorError) throw vendorError;
  }
  return data;
}

export async function signIn({ identifiant, password }) {
  if (!supabase) throw authDisabledError();
  const email = toEmail(identifiant);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  return { session: data, profile };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentProfile() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return profile;
}

export async function getMyVendorProfile(profileId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from("vendors")
    .select("*")
    .eq("profile_id", profileId)
    .single();
  return data;
}

export async function updateVendorProfile(vendorId, { boutique, ville, telephone, description }) {
  if (!supabase) throw authDisabledError();
  const { error } = await supabase
    .from("vendors")
    .update({ boutique, ville, telephone, description })
    .eq("id", vendorId);
  if (error) throw error;
}

export async function updateVendorLogo(vendorId, file) {
  if (!supabase) throw authDisabledError();
  const ext = file.name.split(".").pop();
  const path = `avatars/${vendorId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from("produit").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("produit").getPublicUrl(path);

  const { error } = await supabase.from("vendors").update({ logo_url: data.publicUrl }).eq("id", vendorId);
  if (error) throw error;

  return data.publicUrl;
}
