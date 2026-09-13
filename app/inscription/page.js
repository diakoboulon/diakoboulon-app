"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function InscriptionPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nom: "", telephone: "", motdepasse: "" });

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: brancher sur votre système d'authentification réel (ex: Supabase Auth)
    console.log("Nouveau compte client :", form);
    setSent(true);
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-wrap">
        <div className="login-brand">
          <Image src="/logo.jpg" alt="Diakoboulon — La maison du commerce" width={110} height={110} className="login-logo" priority />
        </div>

        <div className="login-card">
          <h1>Créer un compte</h1>
          <p className="login-sub">Rejoignez Diakoboulon en tant que client</p>

          {sent ? (
            <p style={{ color: "var(--encre-soft)", fontSize: 14 }}>
              Votre compte a été créé (démonstration). Vous pouvez maintenant vous connecter.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="login-label">Nom complet</label>
              <div className="login-field">
                <span>👤</span>
                <input type="text" placeholder="Votre nom" required
                  value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
              </div>

              <label className="login-label" style={{ marginTop: 16 }}>Numéro de téléphone</label>
              <div className="login-field">
                <span>📱</span>
                <input type="tel" placeholder="+223 ..." required
                  value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
              </div>

              <label className="login-label" style={{ marginTop: 16 }}>Mot de passe</label>
              <div className="login-field">
                <span>🔒</span>
                <input type="password" placeholder="••••••••••••" required
                  value={form.motdepasse} onChange={(e) => setForm({ ...form, motdepasse: e.target.value })} />
              </div>

              <button type="submit" className="login-btn" style={{ marginTop: 22 }}>Créer mon compte</button>
            </form>
          )}

          <p className="login-signup" style={{ marginTop: 20 }}>
            Déjà un compte ? <Link href="/connexion">Se connecter</Link>
          </p>
          <Link href="/" className="login-back">← Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  );
}
