import { getProduct } from "@/lib/data";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}
