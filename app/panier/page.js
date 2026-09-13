"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useCart } from "@/components/CartProvider";
import { formatFcfa } from "@/components/ProductCard";
import { getProducts } from "@/lib/data";
import Link from "next/link";

export default function CartPage() {
  const { cart, changeQty, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const ids = Object.keys(cart);
  const items = ids
    .map((id) => ({ product: products.find((p) => String(p.id) === String(id)), qty: cart[id] }))
    .filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <>
      <Header />
      <div className="app" style={{ padding: "30px 0 60px", maxWidth: 700 }}>
        <h1 style={{ fontSize: 26 }}>Votre panier</h1>
        {items.length === 0 ? (
          <p style={{ color: "var(--encre-soft)" }}>
            Votre panier est vide. <Link href="/">Retour au catalogue</Link>
          </p>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "20px 0" }}>
              {items.map(({ product, qty }) => (
                <div key={product.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="motif" style={{ "--m1": product.color, width: 64, height: 64, flex: "none" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5 }}>{product.name}</div>
                    <div style={{ fontSize: 12.5, color: "var(--encre-soft)" }}>{formatFcfa(product.price)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <button className="add-btn" style={{ borderRadius: "50%", width: 22, height: 22, padding: 0 }} onClick={() => changeQty(product.id, -1)}>−</button>
                      <span>{qty}</span>
                      <button className="add-btn" style={{ borderRadius: "50%", width: 22, height: 22, padding: 0 }} onClick={() => changeQty(product.id, 1)}>+</button>
                      <button style={{ background: "none", border: "none", color: "var(--terre)", fontSize: 11.5 }} onClick={() => removeFromCart(product.id)}>Retirer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>Sous-total</span>
              <span>{formatFcfa(subtotal)}</span>
            </div>
            <Link href="/commande" className="btn btn-primary" style={{ display: "block", textAlign: "center", marginTop: 16 }}>
              Commander
            </Link>
          </>
        )}
      </div>
    </>
  );
}
