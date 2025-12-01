import CategoryDetail from "@/components/categories/CategoryDetail";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CategoryDetail slug={slug} />;
}
