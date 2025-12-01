"use client";
import { Category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/utils/api/categories";
import CategoryList from "@/components/categories/CategoryList";

export default function CategoriesPage() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  return (
    <div className="px-20 pt-10">
      <h1 className="text-center text-3xl mb-5">All categories</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading categories.</p>}
      {/* Render the list of categories using the CategoryList component */}
      {categories.length === 0 && <p>No categories found.</p>}
      <CategoryList categories={categories}></CategoryList>
    </div>
  );
}
