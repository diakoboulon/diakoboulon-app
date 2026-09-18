import { createClient } from "@supabase/supabase-js";

// ⚠️ Ce client utilise la clé "service_role" : il a tous les droits et
// contourne les règles de sécurité (RLS). Il ne doit JAMAIS être utilisé
// côté navigateur — seulement dans les routes API (dossier app/api/...),
// qui s'exécutent uniquement sur le serveur.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = url && serviceKey ? createClient(url, serviceKey) : null;
