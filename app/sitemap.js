import { getProducts } from "@/lib/data";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://diakoboulon.com";
  const products = await getProducts();

  const staticPages = ["", "/vendre", "/connexion", "/inscription"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const productPages = products.map((p) => ({
    url: `${siteUrl}/produit/${p.id}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...productPages];
}
