"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ConnexionPage() {
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ identifiant: "", motdepasse: "" });

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: brancher sur votre système d'authentification réel
    // (Supabase Auth, par exemple) une fois la base de données connectée.
    alert("Connexion (démonstration) — à connecter à votre système d'authentification.");
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
                placeholder="Nom d'utilisateur ou numéro de téléphone"
                value={form.identifiant}
                onChange={(e) => setForm({ ...form, identifiant: e.target.value })}
                required
              />
            </div>
            <div className="login-hint">Personnel : nom d'utilisateur | Client : numéro de téléphone</div>

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

            <button type="submit" className="login-btn">Se connecter</button>
          </form>

          <div className="login-divider"><span>Vous êtes client ?</span></div>

          <p className="login-signup">
            Pas encore de compte ? <Link href="/inscription">Créer un compte client</Link>
          </p>

          <Link href="/" className="login-back">← Retour à l'accueil</Link>
        </div>

        <div className="login-footer">© 2026 Diakoboulon. Tous droits réservés.</div>
      </div>
    </div>
  );
}
