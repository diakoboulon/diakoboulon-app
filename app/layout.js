import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { FavoritesProvider } from "@/components/FavoritesProvider";
import BottomNav from "@/components/BottomNav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://diakoboulon.com";
const title = "Diakoboulon — Le marché aux bonnes affaires";
const description = "La marketplace malienne qui connecte vendeurs et acheteurs : électronique, mode, maison, beauté, agroalimentaire et plus, partout au Mali.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: ["Diakoboulon", "marketplace Mali", "acheter en ligne Mali", "vendre en ligne Mali", "Bamako", "e-commerce Mali"],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Diakoboulon",
    images: [{ url: "/logo.jpg", width: 800, height: 800, alt: "Diakoboulon" }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
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
