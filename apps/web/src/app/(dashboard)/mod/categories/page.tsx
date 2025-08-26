"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@/types/category";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/utils/api/categories";
import { CategoryTable } from "./_components/category-table";
import { CategoryDialog } from "./_components/category-dialog";
import { generateSlug, isValidSlugFormat, slugIfNameChanged } from "@/utils/category";

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCategory = async (data: {
    name: string;
    description?: string;
  }) => {
    try {
      const slug = generateSlug(data.name);

      if (!isValidSlugFormat(slug)) {
        toast.error("Generated slug has invalid format");
        return;
      }

      // Check if category with same slug already exists (client-side validation)
      const existingCategory = categories.find(
        (cat) => cat.slug === slug
      );

      if (existingCategory) {
        toast.error(`Category with slug "${slug}" already exists`);
        return;
      }

      await createCategory({
        name: data.name,
        slug,
        description: data.description || undefined,
      });

      toast.success("Category created successfully");
      await loadCategories();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to create category:", error);

      // Handle specific error types
      if (error?.response?.status === 409 || error?.message?.includes("already exists")) {
        toast.error(`Category with slug "${generateSlug(data.name)}" already exists`);
      } else if (error?.response?.status === 400) {
        toast.error("Invalid category data. Please check your input.");
      } else {
        toast.error("Failed to create category. Please try again.");
      }
    }
  };

  const handleUpdateCategory = async (data: {
    name: string;
    description?: string;
  }) => {
    if (!editingCategory) return;

    try {
      const slug = slugIfNameChanged(data.name, editingCategory.name);

      if (slug && !isValidSlugFormat(slug)) {
        toast.error("Generated slug has invalid format");
        return;
      }

      // Check if category with same slug already exists (excluding current category)
      if (slug) {
        const existingCategory = categories.find(
          (cat) => cat.slug === slug && cat.id !== editingCategory.id
        );

        if (existingCategory) {
          toast.error(`Category with slug "${slug}" already exists`);
          return;
        }
      }

      await updateCategory(editingCategory.id, {
        name: data.name,
        ...(slug ? { slug } : {}),
        description: data.description || undefined,
      });

      toast.success("Category updated successfully");
      await loadCategories();
      setIsDialogOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      console.error("Failed to update category:", error);

      // Handle specific error types
      if (error?.response?.status === 409 || error?.message?.includes('already exists')) {
        const attemptedSlug = slugIfNameChanged(data.name, editingCategory.name);
        toast.error(`Category with slug "${attemptedSlug || editingCategory.slug}" already exists`);
      } else if (error?.response?.status === 400) {
        toast.error("Invalid category data. Please check your input.");
      } else {
        toast.error("Failed to update category. Please try again.");
      }
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted successfully");
      await loadCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage product categories and their descriptions
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Category List</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryTable
            data={categories}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteCategory}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <CategoryDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        category={editingCategory}
        isEditing={!!editingCategory}
      />
    </div>
  );
}
