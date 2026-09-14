"use client";

import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/components/FavoritesProvider";

export default function FavorisClient({ products }) {
  const { favorites } = useFavorites();
  const favProducts = products.filter((p) => favorites[p.id]);

  return (
    <>
      <Header showSearch={false} />
      <div className="app" style={{ paddingBottom: 90 }}>
        <div className="sec-head" style={{ marginTop: 24 }}>
          <h2>Mes favoris</h2>
          <span className="sub">{favProducts.length} produit(s)</span>
        </div>
        {favProducts.length === 0 ? (
          <p style={{ color: "var(--encre-soft)" }}>
            Vous n'avez pas encore de favoris. Touchez le cœur sur un produit pour l'ajouter ici.
          </p>
        ) : (
          <div className="grid">
            {favProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
