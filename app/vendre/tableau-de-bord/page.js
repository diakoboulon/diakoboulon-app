"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { getCurrentProfile, getMyVendorProfile, signOut } from "@/lib/auth";

export default function TableauDeBordVendeur() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [vendor, setVendor] = useState(null);

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
      setLoading(false);
    })();
  }, [router]);

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

        <p style={{ color: "var(--encre-soft)", fontSize: 13.5, marginTop: 18 }}>
          La gestion des produits (ajout, modification) sera disponible ici prochainement.
          Pour l'instant, contactez l'équipe Diakoboulon pour mettre vos produits en ligne.
        </p>

        <button className="btn" style={{ marginTop: 20, border: "1px solid var(--ligne)" }} onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </>
  );
}
