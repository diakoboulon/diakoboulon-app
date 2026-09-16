import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "Diakoboulon — Le marché malien",
  description: "La marketplace qui connecte les entreprises et artisans maliens aux acheteurs, au Mali et dans la diaspora.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <FavoritesProvider>
            {children}
            <BottomNav />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
