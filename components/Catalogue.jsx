"use client";

import { useMemo, useState } from "react";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Link from "next/link";

const CATS = [
  {
    id: "electronique",
    label: "Électronique",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    id: "mode",
    label: "Mode",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3 4 6l2 3-2 2v10h16V11l-2-2 2-3-4-3-2 2h-2Z" />
      </svg>
    ),
  },
  {
    id: "maison",
    label: "Maison",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    id: "beaute",
    label: "Beauté",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2Z" />
      </svg>
    ),
  },
  {
    id: "agroalimentaire",
    label: "Agroalimentaire",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11a8 8 0 0 1 16 0v0a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
        <path d="M12 3c0 3-2 3-2 6" />
        <path d="M4 20h16" />
      </svg>
    ),
  },
];

export default function Catalogue({ products }) {
  const [cat, setCat] = useState("tous");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

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

  const popular = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [products]
  );
  const isFiltering = cat !== "tous" || search.trim() !== "";
  const displayed = isFiltering || showAll ? filtered : popular;

  return (
    <>
      <Header search={search} onSearch={setSearch} />
      <div className="app" style={{ paddingBottom: 90 }}>
        <div className="banner-promo">
          <div className="banner-promo-content">
            <h2>
              Des milliers de produits<br />
              Des vendeurs fiables<br />
              Une seule plateforme
            </h2>
            <a href="#categories" className="banner-btn">Découvrir</a>
          </div>
        </div>

        <div id="categories" className="cat-grid">
          {CATS.map((c) => (
            <button
              key={c.id}
              className={"cat-icon-item" + (cat === c.id ? " active" : "")}
              onClick={() => setCat(cat === c.id ? "tous" : c.id)}
            >
              <span className="cat-icon-circle">{c.icon}</span>
              <span className="cat-icon-label">{c.label}</span>
            </button>
          ))}
        </div>

        <div className="sec-head">
          <h2>{isFiltering ? "Résultats" : showAll ? "Tous les produits" : "Produits populaires"}</h2>
          {isFiltering ? (
            <span className="sub">{filtered.length} produit(s)</span>
          ) : !showAll ? (
            <button className="seeall" onClick={() => setShowAll(true)}>Voir tout</button>
          ) : (
            <span className="sub">{filtered.length} produit(s)</span>
          )}
        </div>
        <div className="grid">
          {displayed.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="sell-banner">
          <div className="sell-banner-content">
            <h2>Vendez facilement<br />Développez votre boutique</h2>
            <Link href="/vendre" className="sell-btn">Devenir vendeur</Link>
          </div>
        </div>
      </div>

      <footer style={{ paddingBottom: 90 }}>
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
