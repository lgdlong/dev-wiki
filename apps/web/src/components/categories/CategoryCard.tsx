import { Category } from "@/types/category";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <li className="cursor-pointer" key={category.id}>
      <Link
        href={`/categories/${category.slug}`}
        className="flex flex-col gap-2 p-4 border rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-2xl">{category.name}</h3>
          <ChevronRight size={16} strokeWidth={2.5} />
        </div>
        <p className="text-sm font-normal text-zinc-500">
          {category.description}
        </p>
      </Link>
    </li>
  );
}
