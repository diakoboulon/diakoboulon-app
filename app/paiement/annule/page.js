import Header from "@/components/Header";
import Link from "next/link";

export default function PaiementAnnulePage() {
  return (
    <>
      <Header />
      <div className="app" style={{ padding: "60px 0", maxWidth: 480, textAlign: "center" }}>
        <h1 style={{ fontSize: 22 }}>Paiement annulé</h1>
        <p style={{ color: "var(--encre-soft)" }}>Votre commande est toujours dans votre panier — vous pouvez réessayer à tout moment.</p>
        <Link href="/panier" className="btn btn-primary">Retour au panier</Link>
      </div>
    </>
  );
}
