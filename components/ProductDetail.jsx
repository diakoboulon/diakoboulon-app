"use client";

import { useState } from "react";
import Header from "./Header";
import { useCart } from "./CartProvider";
import { formatFcfa } from "./ProductCard";
import { CATEGORY_LABELS } from "@/lib/data";
import Link from "next/link";
import ProductThumb from "./ProductThumb";

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <>
        <Header />
        <div className="app" style={{ padding: "60px 0" }}>
          <p>Produit introuvable. <Link href="/">Retour au catalogue</Link></p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="app" style={{ padding: "30px 0 60px" }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--encre-soft)" }}>← Retour au catalogue</Link>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 16 }}>
          <ProductThumb product={product} style={{ borderRadius: 18 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12.5, color: "var(--encre-soft)" }}>{product.vendor} · {product.city}</div>
            <h1 style={{ margin: 0, fontSize: 26 }}>{product.name}</h1>
            <div className="stars">★★★★★ {product.rating} · {CATEGORY_LABELS[product.cat]}</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "var(--terre-fonce)", fontWeight: 600 }}>
              {formatFcfa(product.price)}
            </div>
            <p style={{ color: "var(--encre-soft)", lineHeight: 1.6 }}>{product.desc || product.description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="add-btn" style={{ borderRadius: "50%", width: 28, height: 28 }} onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button className="add-btn" style={{ borderRadius: "50%", width: 28, height: 28 }} onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="btn btn-primary" onClick={() => addToCart(product.id, qty)}>
              Ajouter au panier
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => alert(`Message envoyé à ${product.vendor} (la messagerie complète arrive bientôt).`)}
            >
              ✉️ Contacter {product.vendor}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
