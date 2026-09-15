"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { formatFcfa } from "@/components/ProductCard";

const CATS = [
  { id: "alimentaire", label: "Alimentaire" },
  { id: "beaute", label: "Beauté & bien-être" },
  { id: "textile", label: "Mode & textile" },
  { id: "artisanat", label: "Artisanat & déco" },
];
const COLORS = ["#BE5A2A", "#D19A34", "#22405C", "#9A4720"];

export default function VendorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", cat: "alimentaire", desc: "" });

  useEffect(() => {
    async function load() {
      if (!supabase) {
        // Mode démonstration : pas de Supabase connecté, on ne peut pas
        // avoir de vrai tableau de bord — on renvoie vers l'accueil.
        router.push("/");
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/connexion");
        return;
      }
      const { data: vendorRow } = await supabase
        .from("vendors").select("*").eq("user_id", session.user.id).maybeSingle();
      if (!vendorRow) {
        router.push("/"); // connecté, mais ce n'est pas un compte vendeur
        return;
      }
      setVendor(vendorRow);
      const { data: productRows } = await supabase
        .from("products").select("*").eq("vendor_id", vendorRow.id).order("created_at", { ascending: false });
      setProducts(productRows || []);
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleAddProduct(e) {
    e.preventDefault();
    setSaving(true);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const { data, error } = await supabase.from("products").insert({
      vendor_id: vendor.id,
      cat: form.cat,
      name: form.name,
      vendor: vendor.boutique,
      city: vendor.ville,
      price: parseInt(form.price, 10),
      desc: form.desc,
      color,
    }).select().single();
    setSaving(false);
    if (!error && data) {
      setProducts([data, ...products]);
      setForm({ name: "", price: "", cat: "alimentaire", desc: "" });
    }
  }

  async function handleDelete(id) {
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter((p) => p.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="app" style={{ padding: "60px 0", textAlign: "center", color: "var(--encre-soft)" }}>
          Chargement...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="app" style={{ padding: "30px 0 60px" }}>
        <div className="sec-head">
          <h2>Ma boutique — {vendor.boutique}</h2>
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "var(--terre)", fontSize: 13, cursor: "pointer" }}>
            Se déconnecter
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 30, alignItems: "start" }}>
          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ marginTop: 0, fontSize: 17 }}>Ajouter un produit</h3>
            <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="field" placeholder="Nom du produit" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="field" type="number" placeholder="Prix (FCFA)" required
                value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <select className="field" value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {CATS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <textarea className="field" rows={3} placeholder="Description"
                value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Ajout..." : "Ajouter le produit"}
              </button>
            </form>
          </div>

          <div>
            <h3 style={{ marginTop: 0, fontSize: 17 }}>Mes produits ({products.length})</h3>
            {products.length === 0 ? (
              <p style={{ color: "var(--encre-soft)", fontSize: 14 }}>Aucun produit pour l'instant — ajoutez-en un à gauche.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {products.map((p) => (
                  <div key={p.id} className="card" style={{ flexDirection: "row", alignItems: "center", padding: 12, display: "flex", gap: 12 }}>
                    <div className="motif" style={{ "--m1": p.color, width: 56, height: 56, flex: "none", borderRadius: 10 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                      <div style={{ fontSize: 12.5, color: "var(--encre-soft)" }}>{formatFcfa(p.price)}</div>
                    </div>
                    <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "none", color: "var(--terre)", fontSize: 12.5, cursor: "pointer" }}>
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
