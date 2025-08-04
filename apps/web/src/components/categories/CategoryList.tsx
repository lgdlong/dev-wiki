import { Category } from "@/types/category";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import CategoryCard from "./CategoryCard";

export default function CategoryList({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <ul className="grid grid-cols-3 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </ul>
  );
}
