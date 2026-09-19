"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import { useCart } from "./CartProvider";
import { formatFcfa } from "./ProductCard";
import { CATEGORY_LABELS, getVendorInfo } from "@/lib/data";
import Link from "next/link";
import ProductThumb from "./ProductThumb";

export default function ProductDetail({ product }) {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [vendorPhone, setVendorPhone] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product?.vendor_id) {
      getVendorInfo(product.vendor_id).then((v) => setVendorPhone(v?.telephone || null));
    }
  }, [product?.vendor_id]);

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

  const gallery = product.images && product.images.length ? product.images : (product.image_url ? [product.image_url] : []);

  return (
    <>
      <Header />
      <div className="app" style={{ padding: "30px 0 60px" }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--encre-soft)" }}>← Retour au catalogue</Link>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 16 }}>
          <div>
            {gallery.length > 0 ? (
              <div className="motif" style={{ borderRadius: 18, backgroundImage: `url(${gallery[activeImg]})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            ) : (
              <ProductThumb product={product} style={{ borderRadius: 18 }} />
            )}
            {gallery.length > 1 && (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 56, height: 56, borderRadius: 10, padding: 0, cursor: "pointer",
                      border: i === activeImg ? "2px solid var(--or-fonce)" : "1px solid var(--ligne)",
                      backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center",
                    }}
                    aria-label={`Photo ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12.5, color: "var(--encre-soft)" }}>
              {product.vendor_id ? (
                <Link href={`/boutique/${product.vendor_id}`} style={{ color: "var(--terre-fonce)", fontWeight: 600 }}>
                  {product.vendor}
                </Link>
              ) : (
                product.vendor
              )}
              {" "}· {product.city}
            </div>
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
            {vendorPhone ? (
              <a
                className="btn btn-ghost"
                href={`https://wa.me/${vendorPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour, je suis intéressé(e) par "${product.name}" sur Diakoboulon.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Contacter {product.vendor} sur WhatsApp
              </a>
            ) : (
              <button className="btn btn-ghost" disabled>
                💬 Contacter {product.vendor}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
