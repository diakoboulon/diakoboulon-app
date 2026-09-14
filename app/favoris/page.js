import { getProducts } from "@/lib/data";
import FavorisClient from "./FavorisClient";

export default async function FavorisPage() {
  const products = await getProducts();
  return <FavorisClient products={products} />;
}
