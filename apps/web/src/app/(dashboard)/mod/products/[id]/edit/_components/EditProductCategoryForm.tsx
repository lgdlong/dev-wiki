"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Package, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Product } from "@/types/product";
import { Category } from "@/types/category";
import {
  EditProductFormValues,
  EditCategoryFormValues,
  editProductSchema,
  editCategorySchema,
} from "@/validations/edit-product-category-schema";
import { assignCategoriesToProduct, updateProduct, getProductCategories } from "@/utils/api/productApi";
import { getAllCategories } from "@/utils/api/categories";
import { ProductCategory } from "@/types/product-categories";

interface EditProductCategoryFormProps {
  product: Product;
}

export default function EditProductCategoryForm({ product }: EditProductCategoryFormProps) {
  const router = useRouter();
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // Category management state
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Product form
  const productForm = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema) as any,
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      homepageUrl: product.homepageUrl || "",
      githubUrl: product.githubUrl || "",
    },
  });

  // Category form - Updated for multiple categories
  const categoryForm = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategorySchema) as any,
    defaultValues: {
      categoryIds: [], // Will be populated from selectedCategories
    },
  });

  // Filter categories based on search query, excluding already selected ones
  const filteredCategories = useMemo(() => {
    const selectedIds = selectedCategories.map(cat => cat.id);
    const availableCategories = allCategories.filter(cat => !selectedIds.includes(cat.id));

    if (!searchQuery.trim()) return availableCategories;

    return availableCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allCategories, selectedCategories, searchQuery]);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetched: Category[] = await getAllCategories();
        setAllCategories(fetched);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Reset forms when product changes
  useEffect(() => {
    productForm.reset({
      name: product.name || "",
      description: product.description || "",
      homepageUrl: product.homepageUrl || "",
      githubUrl: product.githubUrl || "",
    });

    // Normalize API response: it could be ProductCategory[] (with .category)
    // or Category[] depending on backend/relations. We extract Category[] safely.
    const extractCategories = (rows: (ProductCategory | Category)[]): Category[] => {
    if (!Array.isArray(rows)) return [];
      return rows
        .map((row: any) => (row?.category ? row.category : row))
        .filter((c: any): c is Category => c && typeof c.id === "number" && typeof c.name === "string");
    };

    const loadProductCategories = async () => {
      try {
        const res = await getProductCategories(product.id);
        const categories = extractCategories(res as any[]);

        setSelectedCategories(categories);

        // Initialize the form with existing category IDs
        const categoryIds = categories.map(cat => cat.id);
        categoryForm.reset({
          categoryIds: categoryIds,
        });
      } catch (error) {
        console.error("Failed to load product categories:", error);
        toast.error("Failed to load product categories");
        // Reset to empty state on error
        setSelectedCategories([]);
        categoryForm.reset({
          categoryIds: [],
        });
      }
    };

    loadProductCategories();
  }, [product.id, productForm, categoryForm]);

  // Update categoryIds in form when selectedCategories changes
  useEffect(() => {
    const categoryIds = selectedCategories.map(cat => cat.id);
    categoryForm.setValue("categoryIds", categoryIds, { shouldDirty: categoryIds.length > 0 });
  }, [selectedCategories, categoryForm]);

  const handleCategoryAdd = useCallback((category: Category) => {
    setSelectedCategories(prev => {
      if (prev.find(cat => cat.id === category.id)) return prev;
      return [...prev, category];
    });
    setSearchQuery("");
    setIsSearchFocused(false);
  }, []);

  const handleCategoryRemove = useCallback((categoryId: number) => {
    setSelectedCategories(prev => prev.filter(cat => cat.id !== categoryId));
  }, []);

  const onProductSubmit = async (data: EditProductFormValues) => {
    setIsProductLoading(true);
    try {
      const originalValues = {
        name: product.name || "",
        description: product.description || "",
        homepageUrl: product.homepageUrl || "",
        githubUrl: product.githubUrl || "",
      };

      const changedFields: Partial<EditProductFormValues> = {};
      (Object.keys(data) as Array<keyof EditProductFormValues>).forEach((key) => {
        if (data[key] !== originalValues[key as keyof typeof originalValues]) {
          (changedFields as any)[key] = data[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes to save");
        return;
      }

      await updateProduct(product.id, changedFields);
      toast.success("Product information updated successfully");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsProductLoading(false);
    }
  };

  const onCategorySubmit = async (data: EditCategoryFormValues) => {
    setIsCategoryLoading(true);
    try {
      const result = await assignCategoriesToProduct(product.id, data.categoryIds);

      // Provide detailed feedback to the user
      if (result.assigned > 0 && result.skipped > 0) {
        toast.success(
          `Successfully assigned ${result.assigned} categories. ${result.skipped} were already assigned.`
        );
      } else if (result.assigned > 0) {
        toast.success(`Successfully assigned ${result.assigned} categories!`);
      } else if (result.skipped > 0) {
        toast.info(`All ${result.skipped} categories were already assigned.`);
      }

      console.log('Category assignment result:', result);
    } catch (error) {
      console.error("Failed to update categories:", error);
      toast.error("Failed to update categories. Please try again.");
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/mod/products/manage-products");
  };

  const isProductDirty = productForm.formState.isDirty;
  const isCategoryDirty = categoryForm.formState.isDirty;
  const canSaveProduct = isProductDirty && !isProductLoading;
  const canSaveCategory = isCategoryDirty && !isCategoryLoading;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Product</h1>
            <p className="text-sm text-muted-foreground">
              Edit product details and assign categories for {product.name}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...productForm}>
              <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                <FormField
                  control={productForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={productForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter product description" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={productForm.control}
                  name="homepageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Homepage URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={productForm.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/user/repo"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Read-only metadata */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>{" "}
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Product Save Button */}
                <div className="flex items-center justify-end gap-2 pt-4">
                  <Button type="submit" disabled={!canSaveProduct}>
                    {isProductLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Product Info
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Category Management Card - TagManager Style */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base">Category Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Current Categories */}
            <section className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Categories assigned to this product ({selectedCategories.length})
              </div>
              {selectedCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge key={category.id} variant="secondary" className="px-2 py-1 gap-1">
                      {category.name}
                      <button
                        aria-label={`Remove ${category.name}`}
                        className="ml-1 inline-flex rounded hover:bg-muted"
                        onClick={() => handleCategoryRemove(category.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No categories assigned yet. Search and add categories below.
                </div>
              )}
            </section>

            <Separator />

            {/* Search & Add Categories */}
            <section className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Search & add existing categories
              </div>

              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery.trim().length >= 2 && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-0 shadow-md">
                    {filteredCategories.length > 0 ? (
                      <div className="max-h-60 overflow-auto p-1">
                        {filteredCategories.slice(0, 10).map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryAdd(category)}
                            className="flex w-full flex-col items-start gap-1 rounded-sm px-3 py-2 text-left hover:bg-accent"
                          >
                            <div className="font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-muted-foreground">
                                {category.description}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground">
                        No categories found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Save Categories Button */}
            <Form {...categoryForm}>
              <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="pt-4">
                <div className="flex items-center justify-end gap-2">
                  <Button type="submit" disabled={!canSaveCategory} className="cursor-pointer">
                    {isCategoryLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Categories
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
