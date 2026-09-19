"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { formatFcfa } from "@/components/ProductCard";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("boutiques");
  const [vendors, setVendors] = useState(null);
  const [orders, setOrders] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("diakoboulon-admin-pw");
    if (saved) {
      setPassword(saved);
      loadVendors(saved);
    }
  }, []);

  async function loadOrders(pw) {
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-password": pw } });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders);
    }
  }

  function openTab(t) {
    setTab(t);
    if (t === "commandes" && orders === null) loadOrders(password);
  }

  async function loadVendors(pw) {
    setErrorMsg("");
    const res = await fetch("/api/admin/vendors", { headers: { "x-admin-password": pw } });
    if (!res.ok) {
      setErrorMsg("Mot de passe incorrect ou erreur serveur.");
      setAuthed(false);
      sessionStorage.removeItem("diakoboulon-admin-pw");
      return;
    }
    const data = await res.json();
    setVendors(data.vendors);
    setAuthed(true);
    sessionStorage.setItem("diakoboulon-admin-pw", pw);
  }

  async function toggleVerifie(v) {
    setBusyId(v.id);
    const res = await fetch("/api/admin/vendors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id: v.id, verifie: !v.verifie }),
    });
    if (res.ok) {
      setVendors((list) => list.map((x) => (x.id === v.id ? { ...x, verifie: !x.verifie } : x)));
    }
    setBusyId(null);
  }

  if (!authed) {
    return (
      <>
        <Header showSearch={false} />
        <div className="app" style={{ padding: "60px 0", maxWidth: 360 }}>
          <h1 style={{ fontSize: 22 }}>Administration</h1>
          <p style={{ color: "var(--encre-soft)", fontSize: 13.5 }}>Réservé à l'équipe Diakoboulon.</p>
          <input
            className="field"
            type="password"
            placeholder="Mot de passe administrateur"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadVendors(password)}
          />
          {errorMsg && <div style={{ color: "#B3261E", fontSize: 13.5, marginTop: 8 }}>{errorMsg}</div>}
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => loadVendors(password)}>
            Entrer
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showSearch={false} />
      <div className="app" style={{ padding: "30px 0 60px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            className="btn"
            style={{ border: "1px solid var(--ligne)", background: tab === "boutiques" ? "var(--encre)" : "#fff", color: tab === "boutiques" ? "#fff" : "var(--encre)" }}
            onClick={() => openTab("boutiques")}
          >
            Boutiques
          </button>
          <button
            className="btn"
            style={{ border: "1px solid var(--ligne)", background: tab === "commandes" ? "var(--encre)" : "#fff", color: tab === "commandes" ? "#fff" : "var(--encre)" }}
            onClick={() => openTab("commandes")}
          >
            Commandes
          </button>
        </div>

        {tab === "boutiques" && (
          <>
            <h1 style={{ fontSize: 22 }}>Boutiques ({vendors?.length || 0})</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
              {vendors?.map((v) => (
                <div key={v.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{v.boutique}</div>
                      <div style={{ fontSize: 13, color: "var(--encre-soft)" }}>{v.ville} · {v.telephone}</div>
                      {v.description && <div style={{ fontSize: 12.5, color: "var(--encre-soft)", marginTop: 4 }}>{v.description}</div>}
                    </div>
                    {v.verifie ? (
                      <span className="pay-chip" style={{ background: "var(--vert)", color: "#fff" }}>✓ Validée</span>
                    ) : (
                      <span className="pay-chip" style={{ background: "var(--or)", color: "var(--encre)" }}>En attente</span>
                    )}
                  </div>
                  <button
                    className="btn"
                    style={{ marginTop: 10, border: "1px solid var(--ligne)" }}
                    disabled={busyId === v.id}
                    onClick={() => toggleVerifie(v)}
                  >
                    {busyId === v.id ? "…" : v.verifie ? "Retirer la validation" : "✓ Valider cette boutique"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "commandes" && (
          <>
            <h1 style={{ fontSize: 22 }}>Commandes ({orders?.length || 0})</h1>
            <p style={{ fontSize: 12.5, color: "var(--encre-soft)" }}>
              Commission Diakoboulon : 5% du total. Le reste ("à verser") est ce que tu dois payer au vendeur (Mobile Money) après livraison.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {orders?.map((o) => (
                <div key={o.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--encre-soft)" }}>
                    <span>{new Date(o.created_at).toLocaleString("fr-FR")}</span>
                    <span className="pay-chip">{o.status}</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13.5 }}>
                    {o.items?.map((it, i) => (
                      <div key={i}>{it.qty}× {it.name}</div>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13.5 }}>
                    <span>Total : <strong>{formatFcfa(o.total)}</strong></span>
                    <span>Commission (5%) : <strong>{formatFcfa(o.commission || 0)}</strong></span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 13.5, color: "var(--vert)" }}>
                    À verser au vendeur : <strong>{formatFcfa(o.vendor_payout ?? o.total)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
