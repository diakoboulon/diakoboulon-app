import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { getVendorInfo } from "@/lib/data";
import { getVendorProducts } from "@/lib/products";
import Link from "next/link";

export default async function BoutiquePage({ params }) {
  const vendor = await getVendorInfo(params.id);
  const products = vendor ? await getVendorProducts(vendor.id) : [];

  if (!vendor) {
    return (
      <>
        <Header showSearch={false} />
        <div className="app" style={{ padding: "60px 0" }}>
          <p>Boutique introuvable. <Link href="/">Retour à l'accueil</Link></p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showSearch={false} />
      <div className="app" style={{ padding: "24px 0 60px" }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--encre-soft)" }}>← Retour au catalogue</Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, background: "var(--vert)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, flexShrink: 0,
          }}>
            {vendor.boutique?.[0]?.toUpperCase() || "B"}
          </div>
          <div>
            <h1 style={{ fontSize: 20, margin: 0 }}>{vendor.boutique}</h1>
            <p style={{ margin: "2px 0 0", color: "var(--encre-soft)", fontSize: 13.5 }}>{vendor.ville}</p>
          </div>
          {vendor.verifie && (
            <span className="pay-chip" style={{ background: "var(--vert)", color: "#fff", marginLeft: "auto" }}>
              ✓ Validée
            </span>
          )}
        </div>

        {vendor.description && (
          <p style={{ color: "var(--encre-soft)", fontSize: 14, marginTop: 14 }}>{vendor.description}</p>
        )}

        <div className="sec-head" style={{ marginTop: 26 }}>
          <h2>Produits de la boutique</h2>
          <span className="sub">{products.length} produit(s)</span>
        </div>

        {products.length === 0 ? (
          <p style={{ color: "var(--encre-soft)", fontSize: 14 }}>Cette boutique n'a pas encore ajouté de produit.</p>
        ) : (
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
