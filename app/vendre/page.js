"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function SellerPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ boutique: "", ville: "", telephone: "", email: "", description: "" });

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: envoyer ces informations à votre backend/Supabase (table "vendors")
    // au lieu de simplement les afficher ici.
    console.log("Nouvelle demande de boutique :", form);
    setSent(true);
  }

  return (
    <>
      <Header />
      <div className="app" style={{ padding: "30px 0 60px", maxWidth: 480 }}>
        <h1 style={{ fontSize: 24 }}>Ouvrir ma boutique</h1>
        {sent ? (
          <p style={{ color: "var(--encre-soft)" }}>
            Merci ! Votre demande de boutique a été envoyée. Notre équipe vous contactera pour valider votre profil vendeur.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <input className="field" placeholder="Nom de la boutique" required
              value={form.boutique} onChange={(e) => setForm({ ...form, boutique: e.target.value })} />
            <input className="field" placeholder="Ville" required
              value={form.ville} onChange={(e) => setForm({ ...form, ville: e.target.value })} />
            <input className="field" placeholder="Numéro Mobile Money" required
              value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            <input className="field" type="email" placeholder="Adresse email" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <textarea className="field" placeholder="Décrivez vos produits" rows={4}
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn btn-primary" type="submit">Envoyer ma demande</button>
          </form>
        )}
      </div>
    </>
  );
}
