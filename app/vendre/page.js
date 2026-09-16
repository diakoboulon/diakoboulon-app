"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { signUpVendeur } from "@/lib/auth";

export default function SellerPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    boutique: "", ville: "", telephone: "", username: "", motdepasse: "", description: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await signUpVendeur({
        username: form.username,
        password: form.motdepasse,
        boutique: form.boutique,
        ville: form.ville,
        telephone: form.telephone,
        description: form.description,
      });
      setSent(true);
    } catch (err) {
      if (err.message?.includes("already registered") || err.message?.includes("already been registered")) {
        setErrorMsg("Ce nom d'utilisateur est déjà pris, choisissez-en un autre.");
      } else {
        setErrorMsg(err.message || "Une erreur est survenue, réessayez.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header showSearch={false} />
      <div className="app" style={{ padding: "30px 0 60px", maxWidth: 480 }}>
        <h1 style={{ fontSize: 24 }}>Ouvrir ma boutique</h1>
        {sent ? (
          <>
            <p style={{ color: "var(--encre-soft)" }}>
              Votre compte vendeur a été créé. Vous pouvez déjà vous connecter à votre espace vendeur
              avec votre nom d'utilisateur — votre boutique sera visible aux acheteurs une fois validée
              par notre équipe.
            </p>
            <Link href="/connexion" className="btn btn-primary" style={{ marginTop: 12, display: "inline-block" }}>
              Me connecter à mon espace vendeur
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <input className="field" placeholder="Nom de la boutique" required
              value={form.boutique} onChange={(e) => setForm({ ...form, boutique: e.target.value })} />
            <input className="field" placeholder="Ville" required
              value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
            <input className="field" placeholder="Numéro Mobile Money" required
              value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            <textarea className="field" placeholder="Décrivez vos produits" rows={4}
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

            <hr style={{ border: "none", borderTop: "1px solid var(--ligne)", margin: "6px 0" }} />
            <div style={{ fontSize: 13.5, color: "var(--encre-soft)" }}>
              Ces identifiants vous serviront à vous reconnecter à votre espace vendeur.
            </div>
            <input className="field" placeholder="Nom d'utilisateur" required
              value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <input className="field" type="password" placeholder="Mot de passe" required minLength={6}
              value={form.motdepasse} onChange={(e) => setForm({ ...form, motdepasse: e.target.value })} />

            {errorMsg && (
              <div style={{ color: "#B3261E", fontSize: 13.5 }}>{errorMsg}</div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Création…" : "Créer ma boutique"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
