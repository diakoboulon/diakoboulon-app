import { getProducts } from "@/lib/data";
import Catalogue from "@/components/Catalogue";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();
  return <Catalogue products={products} />;
}
