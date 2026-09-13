"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";

function SuccesContent() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app" style={{ padding: "60px 0", maxWidth: 480, textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--terre)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 16px" }}>✓</div>
      <h1 style={{ fontSize: 22 }}>Paiement confirmé</h1>
      <p style={{ color: "var(--encre-soft)" }}>
        {ref ? `Commande ${ref} reçue. ` : ""}Vous recevrez une notification à chaque étape de la livraison.
      </p>
      <Link href="/" className="btn btn-primary">Retour à la boutique</Link>
    </div>
  );
}

export default function PaiementSuccesPage() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <SuccesContent />
      </Suspense>
    </>
  );
}
