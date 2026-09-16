"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";

const MENU_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/vendre", label: "Devenir vendeur" },
  { href: "/panier", label: "Mon panier" },
  { href: "/connexion", label: "Connexion" },
];

export default function Header({ search, onSearch, showSearch = true }) {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="app header-row">
        <button
          className="icon-btn menu-btn"
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link href="/" className="logo-link">
          <Image src="/logo.jpg" alt="Diakoboulon — La maison du commerce" width={40} height={40} className="logo-img" priority />
          <span className="brand-text">
            Diako<span>Boulon</span>
            <small>Le marché aux bonnes affaires</small>
          </span>
        </Link>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Notifications">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notif-dot" />
          </button>
          <Link href="/panier" className="icon-btn" title="Panier">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && <span className="badge">{count}</span>}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {MENU_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      {showSearch && onSearch && (
        <div className="app">
          <div className="search searchbar">
            <span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Rechercher un produit, une boutique..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
