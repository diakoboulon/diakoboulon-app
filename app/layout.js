import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

export const metadata = {
  title: "Diakoboulon — Le marché malien",
  description: "La marketplace qui connecte les entreprises et artisans maliens aux acheteurs, au Mali et dans la diaspora.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
