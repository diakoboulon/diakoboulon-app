"use client";

import { useMemo, useState } from "react";
import Header from "./Header";
import ProductCard from "./ProductCard";
import { CATEGORY_LABELS } from "@/lib/data";
import Link from "next/link";

const CATS = [
  { id: "tous", label: "Tous les produits" },
  { id: "alimentaire", label: "Alimentaire" },
  { id: "beaute", label: "Beauté & bien-être" },
  { id: "textile", label: "Mode & textile" },
  { id: "artisanat", label: "Artisanat & déco" },
];

export default function Catalogue({ products }) {
  const [cat, setCat] = useState("tous");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        (cat === "tous" || p.cat === cat) &&
        (q === "" ||
          p.name.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q))
    );
  }, [products, cat, search]);

  return (
    <>
      <Header search={search} onSearch={setSearch} />
      <div className="app">
        <section style={{ padding: "36px 0 20px" }}>
          <h1 className="hero-anim-title" style={{ fontSize: 34, lineHeight: 1.1, margin: "0 0 12px", fontWeight: 600 }}>
            Le marché malien,<br />à portée de main.
          </h1>
          <p className="hero-anim-sub" style={{ color: "var(--encre-soft)", maxWidth: "48ch", margin: "0 0 18px" }}>
            Diakoboulon connecte les entreprises et artisans du Mali directement aux acheteurs,
            à Bamako comme dans la diaspora.
          </p>
          <Link href="/vendre" className="btn btn-primary hero-anim-cta">Vendre sur Diakoboulon</Link>
        </section>

        <div className="cats">
          {CATS.map((c) => (
            <button
              key={c.id}
              className={"cat-pill" + (cat === c.id ? " active" : "")}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="sec-head">
          <h2>Produits</h2>
          <span className="sub">{filtered.length} produit(s)</span>
        </div>
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <footer>
        <div className="app">
          <div className="pay-methods">
            <span className="pay-chip">Orange Money</span>
            <span className="pay-chip">Moov Money</span>
            <span className="pay-chip">Paiement à la livraison</span>
            <span className="pay-chip">Carte (diaspora)</span>
          </div>
          <div style={{ marginTop: 16 }}>© 2026 Diakoboulon — Bamako, Mali</div>
        </div>
      </footer>
    </>
  );
}
