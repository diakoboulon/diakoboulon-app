import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si les variables d'environnement ne sont pas définies, l'app utilise
// automatiquement les données de démonstration (lib/data.js) à la place.
export const supabase = url && key ? createClient(url, key) : null;
