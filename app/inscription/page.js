"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signUpClient } from "@/lib/auth";

export default function InscriptionPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ nom: "", telephone: "", motdepasse: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await signUpClient({ nom: form.nom, telephone: form.telephone, password: form.motdepasse });
      setSent(true);
    } catch (err) {
      if (err.message?.includes("already registered") || err.message?.includes("already been registered")) {
        setErrorMsg("Ce numéro de téléphone a déjà un compte. Essayez de vous connecter.");
      } else {
        setErrorMsg(err.message || "Une erreur est survenue, réessayez.");
      }
    } finally {
      setLoading(false);
    }
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
              Votre compte a été créé. Vous pouvez maintenant vous connecter avec votre numéro de téléphone.
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
              <div className="login-hint">Ce numéro sera votre identifiant de connexion.</div>

              <label className="login-label" style={{ marginTop: 16 }}>Mot de passe</label>
              <div className="login-field">
                <span>🔒</span>
                <input type="password" placeholder="••••••••••••" required minLength={6}
                  value={form.motdepasse} onChange={(e) => setForm({ ...form, motdepasse: e.target.value })} />
              </div>

              {errorMsg && (
                <div style={{ color: "#B3261E", fontSize: 13.5, marginTop: 10 }}>{errorMsg}</div>
              )}

              <button type="submit" className="login-btn" style={{ marginTop: 22 }} disabled={loading}>
                {loading ? "Création…" : "Créer mon compte"}
              </button>
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
