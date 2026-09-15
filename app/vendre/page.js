"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SellerPage() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    boutique: "", ville: "", telephone: "", email: "", motdepasse: "", description: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Mode démonstration : Supabase pas encore connecté (.env.local vide)
    if (!supabase) {
      console.log("Nouvelle demande de boutique (démonstration) :", form);
      setSent(true);
      return;
    }

    setLoading(true);

    // 1. Crée le compte de connexion (email + mot de passe) du vendeur
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.motdepasse,
    });
    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }

    // 2. Crée la fiche boutique liée à ce compte
    const { error: vendorError } = await supabase.from("vendors").insert({
      user_id: authData.user.id,
      boutique: form.boutique,
      ville: form.ville,
      telephone: form.telephone,
      email: form.email,
      description: form.description,
    });
    setLoading(false);

    if (vendorError) {
      setError(vendorError.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-wrap">
        <div className="login-brand">
          <Image src="/logo.jpg" alt="Diakoboulon" width={110} height={110} className="login-logo" priority />
        </div>
        <div className="login-card">
          <h1>Ouvrir ma boutique</h1>
          <p className="login-sub">Vendez vos produits sur Diakoboulon</p>

          {sent ? (
            <>
              <p style={{ color: "var(--encre-soft)", fontSize: 14, marginBottom: 18 }}>
                Votre boutique a été créée{supabase ? "" : " (démonstration)"} ! Vous pouvez maintenant vous
                connecter pour ajouter vos produits.
              </p>
              <Link href="/connexion" className="btn btn-primary" style={{ display: "block", textAlign: "center" }}>
                Se connecter
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input className="field" placeholder="Nom de la boutique" required
                value={form.boutique} onChange={(e) => setForm({ ...form, boutique: e.target.value })} />
              <input className="field" placeholder="Ville" required
                value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
              <input className="field" placeholder="Numéro Mobile Money" required
                value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
              <input className="field" type="email" placeholder="Adresse email" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="field" type="password" placeholder="Mot de passe (min. 6 caractères)" required minLength={6}
                value={form.motdepasse} onChange={(e) => setForm({ ...form, motdepasse: e.target.value })} />
              <textarea className="field" placeholder="Décrivez vos produits" rows={4}
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              {error && <p style={{ color: "var(--terre)", fontSize: 13 }}>{error}</p>}
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer ma boutique"}
              </button>
            </form>
          )}

          <p className="login-signup" style={{ marginTop: 18 }}>
            Déjà une boutique ? <Link href="/connexion">Se connecter</Link>
          </p>
          <Link href="/" className="login-back">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}
