"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import PasswordField from "@/components/PasswordField";

export default function ConnexionPage() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ identifiant: "", motdepasse: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("diakoboulon-identifiant");
    if (saved) {
      setForm((f) => ({ ...f, identifiant: saved }));
      setRemember(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const { profile } = await signIn({ identifiant: form.identifiant, password: form.motdepasse });
      if (remember) {
        localStorage.setItem("diakoboulon-identifiant", form.identifiant);
      } else {
        localStorage.removeItem("diakoboulon-identifiant");
      }
      if (profile?.role === "vendeur") {
        router.push("/vendre/tableau-de-bord");
      } else {
        router.push("/");
      }
    } catch (err) {
      if (err.message?.includes("Invalid login")) {
        setErrorMsg("Identifiant ou mot de passe incorrect.");
      } else {
        setErrorMsg(err.message || "Une erreur est survenue, réessayez.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-wrap">
        <div className="login-brand">
          <Image src="/logo.jpg" alt="Diakoboulon — La maison du commerce" width={110} height={110} className="login-logo" priority />
        </div>

        <div className="login-card">
          <h1>Connexion</h1>
          <p className="login-sub">Accédez à votre espace</p>

          <form onSubmit={handleSubmit} autoComplete="off">
            <label className="login-label">Identifiant</label>
            <div className="login-field">
              <span>👤</span>
              <input
                type="text"
                name="diakoboulon-identifiant"
                placeholder="Nom d'utilisateur ou numéro de téléphone"
                value={form.identifiant}
                onChange={(e) => setForm({ ...form, identifiant: e.target.value })}
                autoComplete="off"
                required
              />
            </div>
            <div className="login-hint">Personnel : nom d'utilisateur | Client : numéro de téléphone</div>

            <label className="login-label" style={{ marginTop: 16 }}>Mot de passe</label>
            <PasswordField
              name="diakoboulon-motdepasse"
              value={form.motdepasse}
              onChange={(e) => setForm({ ...form, motdepasse: e.target.value })}
              autoComplete="new-password"
              required
            />

            {errorMsg && (
              <div style={{ color: "#B3261E", fontSize: 13.5, marginTop: 10 }}>{errorMsg}</div>
            )}

            <div className="login-row">
              <label className="login-remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Se souvenir de moi
              </label>
              <a
                href="#"
                className="login-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Pour réinitialiser votre mot de passe, contactez l'équipe Diakoboulon avec votre identifiant (numéro de téléphone ou nom d'utilisateur). Nous vous aiderons à en définir un nouveau.");
                }}
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="login-divider"><span>Vous êtes client ?</span></div>

          <p className="login-signup">
            Pas encore de compte ? <Link href="/inscription">Créer un compte client</Link>
          </p>
          <p className="login-signup" style={{ marginTop: 6 }}>
            Vous êtes vendeur ? <Link href="/vendre">Ouvrir ma boutique</Link>
          </p>

          <Link href="/" className="login-back">← Retour à l'accueil</Link>
        </div>

        <div className="login-footer">© 2026 Diakoboulon. Tous droits réservés.</div>
      </div>
    </div>
  );
}
