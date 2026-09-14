"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { useFavorites } from "./FavoritesProvider";

export function formatFcfa(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);
  const isFav = !!favorites?.[product.id];

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
      <button
        className={"fav-btn" + (isFav ? " active" : "")}
        onClick={() => toggleFavorite(product.id)}
        aria-label="Ajouter aux favoris"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
      </button>
      <div className="card-body">
        <div className="card-vendor">
          <span>{product.vendor}</span>
          <span>{product.city}</span>
        </div>
        <Link href={`/produit/${product.id}`} className="card-name">
          {product.name}
        </Link>
        <div className="stars">
          ★ {product.rating} {product.ratingCount ? <span className="rating-count">({product.ratingCount})</span> : null}
        </div>
        <div className="card-foot">
          <span className="card-price">{formatFcfa(product.price)}</span>
          <button
            className={"add-btn-round" + (justAdded ? " just-added" : "")}
            onClick={handleAdd}
            aria-label="Ajouter au panier"
          >
            {justAdded ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
