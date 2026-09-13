"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({}); // { productId: qty }

  // Recharge le panier sauvegardé au démarrage (persistance simple côté navigateur)
  useEffect(() => {
    const saved = window.localStorage.getItem("diakoboulon-cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("diakoboulon-cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(id, qty = 1) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));
  }
  function changeQty(id, delta) {
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }
  function removeFromCart(id) {
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }
  function clearCart() {
    setCart({});
  }

  const count = Object.values(cart).reduce((s, q) => s + q, 0);

  return (
    <CartContext.Provider value={{ cart, count, addToCart, changeQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
