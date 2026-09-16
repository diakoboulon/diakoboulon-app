"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProductThumb from "@/components/ProductThumb";
import { formatFcfa } from "@/components/ProductCard";
import { getCurrentProfile, getMyVendorProfile, signOut } from "@/lib/auth";
import { addProduct, getVendorProducts, deleteProduct, MAX_IMAGES } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/data";

const CAT_OPTIONS = Object.entries(CATEGORY_LABELS);

export default function TableauDeBordVendeur() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({ name: "", cat: CAT_OPTIONS[0][0], price: "", description: "" });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function loadProducts(vendorId) {
    const list = await getVendorProducts(vendorId);
    setProducts(list);
  }

  useEffect(() => {
    (async () => {
      const p = await getCurrentProfile();
      if (!p || p.role !== "vendeur") {
        router.replace("/connexion");
        return;
      }
      setProfile(p);
      const v = await getMyVendorProfile(p.id);
      setVendor(v);
      if (v) await loadProducts(v.id);
      setLoading(false);
    })();
  }, [router]);

  function handleImageChange(e) {
    const files = Array.from(e.target.files || []).slice(0, MAX_IMAGES);
    if (e.target.files.length > MAX_IMAGES) {
      setErrorMsg(`Vous ne pouvez ajouter que ${MAX_IMAGES} photos maximum, les premières ont été gardées.`);
    } else {
      setErrorMsg("");
    }
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      await addProduct({
        vendorId: vendor.id,
        boutique: vendor.boutique,
        ville: vendor.ville,
        cat: form.cat,
        name: form.name,
        price: form.price,
        description: form.description,
        imageFiles,
      });
      setForm({ name: "", cat: CAT_OPTIONS[0][0], price: "", description: "" });
      setImageFiles([]);
      setImagePreviews([]);
      await loadProducts(vendor.id);
    } catch (err) {
      setErrorMsg(err.message || "Impossible d'ajouter ce produit, réessayez.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    await loadProducts(vendor.id);
  }

  async function handleLogout() {
    await signOut();
    router.replace("/connexion");
  }

  if (loading) {
    return (
      <>
        <Header showSearch={false} />
        <div className="app" style={{ padding: "30px 0" }}>Chargement…</div>
      </>
    );
  }

  return (
    <>
      <Header showSearch={false} />
      <div className="app" style={{ padding: "30px 0 60px", maxWidth: 520 }}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>{vendor?.boutique || profile?.nom}</h1>
        <p style={{ color: "var(--encre-soft)", marginTop: 0 }}>Espace vendeur</p>

        {vendor?.verifie ? (
          <div className="pay-chip" style={{ background: "var(--vert)", color: "#fff", display: "inline-block" }}>
            ✓ Boutique validée
          </div>
        ) : (
          <div className="pay-chip" style={{ background: "var(--or)", color: "var(--encre)", display: "inline-block" }}>
            En attente de validation par l'équipe Diakoboulon
          </div>
        )}

        <div className="card" style={{ marginTop: 24, padding: 18 }}>
          <p><strong>Ville :</strong> {vendor?.ville}</p>
          <p><strong>Téléphone :</strong> {vendor?.telephone}</p>
          <p><strong>Description :</strong> {vendor?.description || "—"}</p>
        </div>

        <h2 style={{ fontSize: 19, marginTop: 30 }}>Ajouter un produit</h2>
        <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
          <input className="field" placeholder="Nom du produit" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <select className="field" value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
            {CAT_OPTIONS.map(([id, label]) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>

          <input className="field" type="number" min="0" placeholder="Prix en FCFA" required
            value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

          <textarea className="field" placeholder="Description du produit" rows={3}
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div>
            <label className="btn" style={{ border: "1px solid var(--ligne)", cursor: "pointer", display: "inline-block" }}>
              📷 {imageFiles.length ? `Changer les photos (${imageFiles.length}/${MAX_IMAGES})` : `Ajouter des photos (jusqu'à ${MAX_IMAGES})`}
              <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none" }} />
            </label>
            {imagePreviews.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} alt="Aperçu" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 10 }} />
                ))}
              </div>
            )}
          </div>

          {errorMsg && <div style={{ color: "#B3261E", fontSize: 13.5 }}>{errorMsg}</div>}

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Ajout…" : "Ajouter ce produit"}
          </button>
        </form>

        <h2 style={{ fontSize: 19, marginTop: 32 }}>Mes produits ({products.length})</h2>
        {products.length === 0 ? (
          <p style={{ color: "var(--encre-soft)", fontSize: 14 }}>Vous n'avez pas encore ajouté de produit.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {products.map((p) => (
              <div key={p.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: 10 }}>
                <ProductThumb product={p} style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: "var(--encre-soft)" }}>{formatFcfa(p.price)}</div>
                </div>
                <button className="btn" style={{ border: "1px solid var(--ligne)", fontSize: 12.5, padding: "8px 12px" }} onClick={() => handleDelete(p.id)}>
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}

        <button className="btn" style={{ marginTop: 26, border: "1px solid var(--ligne)" }} onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </>
  );
}
