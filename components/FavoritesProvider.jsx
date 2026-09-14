"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState({}); // { productId: true }

  useEffect(() => {
    const saved = window.localStorage.getItem("diakoboulon-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("diakoboulon-favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites((f) => {
      const next = { ...f };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }

  const favCount = Object.keys(favorites).length;

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, favCount }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
