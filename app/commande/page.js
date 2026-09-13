"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useCart } from "@/components/CartProvider";
import { formatFcfa } from "@/components/ProductCard";
import { getProducts } from "@/lib/data";
import Link from "next/link";

const PAY_OPTIONS = [
  { id: "mobile_money", label: "Mobile Money (Orange, Moov Africa, Wave...)" },
  { id: "livraison", label: "Paiement à la livraison" },
];

const LIVRAISON = 1000;

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [pay, setPay] = useState("mobile_money");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const ids = Object.keys(cart);
  const items = ids
    .map((id) => ({ product: products.find((p) => String(p.id) === String(id)), qty: cart[id] }))
    .filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = items.length ? subtotal + LIVRAISON : 0;

  async function handleConfirm() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, total, pay }),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.ok) {
      alert(data.error || "Le paiement n'a pas pu être initié. Réessayez.");
      return;
    }
    if (data.checkoutUrl) {
      // Redirection vers la page de paiement sécurisée SenePay (Orange Money, Moov Africa, Wave...)
      window.location.href = data.checkoutUrl;
      return;
    }
    // Mode simulation (clés SenePay non configurées) ou paiement à la livraison
    setConfirmed(true);
    clearCart();
  }

  return (
    <>
      <Header />
      <div className="app" style={{ padding: "30px 0 60px", maxWidth: 560 }}>
        {confirmed ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--terre)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>✓</div>
            <h1 style={{ fontSize: 22 }}>Commande confirmée</h1>
            <p style={{ color: "var(--encre-soft)" }}>Total payé : {formatFcfa(total)}. Vous recevrez une notification à chaque étape de la livraison.</p>
            <Link href="/" className="btn btn-primary">Retour à la boutique</Link>
          </div>
        ) : items.length === 0 ? (
          <p>Votre panier est vide. <Link href="/">Retour au catalogue</Link></p>
        ) : (
          <>
            <h1 style={{ fontSize: 24 }}>Finaliser la commande</h1>
            <p style={{ color: "var(--encre-soft)", fontSize: 13.5 }}>Choisissez votre mode de paiement.</p>
            {items.map(({ product, qty }) => (
              <div className="order-line" key={product.id}>
                <span>{product.name} × {qty}</span>
                <span>{formatFcfa(product.price * qty)}</span>
              </div>
            ))}
            <div className="order-line"><span>Livraison</span><span>{formatFcfa(LIVRAISON)}</span></div>
            <div className="order-total"><span>Total</span><span>{formatFcfa(total)}</span></div>

            <div style={{ margin: "20px 0" }}>
              {PAY_OPTIONS.map((o) => (
                <div
                  key={o.id}
                  className={"pay-option" + (pay === o.id ? " selected" : "")}
                  onClick={() => setPay(o.id)}
                >
                  <span>{pay === o.id ? "●" : "○"}</span>
                  <span>{o.label}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={handleConfirm} disabled={loading}>
              {loading ? "Traitement..." : "Confirmer la commande"}
            </button>
          </>
        )}
      </div>
    </>
  );
}
