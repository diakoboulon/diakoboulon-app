"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartProvider";

export default function Header({ search, onSearch }) {
  const { count } = useCart();

  return (
    <header>
      <div className="app header-row">
        <Link href="/" className="logo-link">
          <Image src="/logo.jpg" alt="Diakoboulon — La maison du commerce" width={44} height={44} className="logo-img" priority />
        </Link>
        {onSearch && (
          <div className="search">
            <span>🔎</span>
            <input
              type="text"
              placeholder="Chercher un produit, une boutique, une ville..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}
        <Link href="/panier" className="icon-btn" title="Panier">
          🧺<span className="badge">{count}</span>
        </Link>
      </div>
    </header>
  );
}
