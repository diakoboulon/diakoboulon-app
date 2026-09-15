"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ConnexionPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ identifiant: "", motdepasse: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!supabase) {
      alert("Connexion (démonstration) — Supabase n'est pas encore connecté.");
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.identifiant,
      password: form.motdepasse,
    });

    if (authError) {
      setLoading(false);
      setError("Identifiant ou mot de passe incorrect.");
      return;
    }

    // Le compte est-il une boutique vendeur ? Si oui, direction le tableau de bord.
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    setLoading(false);
    router.push(vendor ? "/vendeur/dashboard" : "/");
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-wrap">
        <div className="login-brand">
          <Image src="/logo.jpg" alt="Diakoboulon — La maison du commerce" width={110} height={110} className="login-logo" priority />
        </div>

        <div className="login-card">
          <h1>Connexion</h1>
          <p className="login-sub">Accédez à votre espace</p>

          <form onSubmit={handleSubmit}>
            <label className="login-label">Identifiant</label>
            <div className="login-field">
              <span>👤</span>
              <input
                type="text"
                placeholder="Email (ou numéro pour les clients)"
                value={form.identifiant}
                onChange={(e) => setForm({ ...form, identifiant: e.target.value })}
                required
              />
            </div>
            <div className="login-hint">Vendeur : email de votre boutique | Client : numéro de téléphone</div>

            <label className="login-label" style={{ marginTop: 16 }}>Mot de passe</label>
            <div className="login-field">
              <span>🔒</span>
              <input
                type="password"
                placeholder="••••••••••••"
                value={form.motdepasse}
                onChange={(e) => setForm({ ...form, motdepasse: e.target.value })}
                required
              />
            </div>

            <div className="login-row">
              <label className="login-remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Se souvenir de moi
              </label>
              <a href="#" className="login-link">Mot de passe oublié ?</a>
            </div>

            {error && <p style={{ color: "var(--terre)", fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="login-divider"><span>Vous êtes client ?</span></div>

          <p className="login-signup">
            Pas encore de compte ? <Link href="/inscription">Créer un compte client</Link>
          </p>
          <p className="login-signup" style={{ marginTop: -8 }}>
            Vous vendez sur Diakoboulon ? <Link href="/vendre">Ouvrir une boutique</Link>
          </p>

          <Link href="/" className="login-back">← Retour à l'accueil</Link>
        </div>

        <div className="login-footer">© 2026 Diakoboulon. Tous droits réservés.</div>
      </div>
    </div>
  );
}
