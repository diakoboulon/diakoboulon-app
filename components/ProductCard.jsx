"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";

export function formatFcfa(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addToCart(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  }

  return (
    <div className="card">
      <Link href={`/produit/${product.id}`}>
        <div className="motif" style={{ "--m1": product.color }} />
      </Link>
      <div className="card-body">
        <div className="card-vendor">
          <span>{product.vendor}</span>
          <span>{product.city}</span>
        </div>
        <Link href={`/produit/${product.id}`} className="card-name">
          {product.name}
        </Link>
        <div className="stars">★★★★★ {product.rating}</div>
        <div className="card-foot">
          <span className="card-price">{formatFcfa(product.price)}</span>
          <button className={"add-btn" + (justAdded ? " just-added" : "")} onClick={handleAdd}>
            {justAdded ? "✓ Ajouté" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
