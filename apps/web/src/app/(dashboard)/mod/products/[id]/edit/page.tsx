import EditProductCategoryForm from "./_components/EditProductCategoryForm";
import { getProductById } from "@/utils/api/productApi";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await getProductById(productId);

  return <EditProductCategoryForm product={product} />;
}
