"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Package } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Product } from "@/types/product";
import { Category } from "@/types/category";
import {
  EditProductFormValues,
  EditCategoryFormValues,
  editProductSchema,
  editCategorySchema,
} from "@/validations/edit-product-category-schema";
import { updateProductCategory, updateProduct } from "@/utils/api/productApi";
import { getAllCategories } from "@/utils/api/categories";

interface EditProductCategoryFormProps {
  product: Product;
}

export default function EditProductCategoryForm({
  product,
}: EditProductCategoryFormProps) {
  const router = useRouter();
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

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

  // Category form
  const categoryForm = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategorySchema) as any,
    defaultValues: {
      categoryId: null, // TODO: Add categoryId to Product type
    },
  });

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
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
    categoryForm.reset({
      categoryId: null, // TODO: Add categoryId to Product type
    });
  }, [product, productForm, categoryForm]);

  const onProductSubmit = async (data: EditProductFormValues) => {
    setIsProductLoading(true);
    try {
      // Get only changed fields
      const originalValues = {
        name: product.name || "",
        description: product.description || "",
        homepageUrl: product.homepageUrl || "",
        githubUrl: product.githubUrl || "",
      };

      const changedFields: Partial<EditProductFormValues> = {};

      (Object.keys(data) as Array<keyof EditProductFormValues>).forEach(
        (key) => {
          if (
            data[key] !== originalValues[key as keyof typeof originalValues]
          ) {
            (changedFields as any)[key] = data[key];
          }
        },
      );

      if (Object.keys(changedFields).length === 0) {
        toast.info("No changes to save");
        return;
      }

      // Update the product with only changed fields
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
      // Update product category
      await updateProductCategory(product.id, data.categoryId);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error("Failed to update category. Please try again.");
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/mod/products/manage-products");
  };

  // Check if forms have any changes
  const isProductDirty = productForm.formState.isDirty;
  const isCategoryDirty = categoryForm.formState.isDirty;
  const canSaveProduct = isProductDirty && !isProductLoading;
  const canSaveCategory =
    isCategoryDirty && !isCategoryLoading && categories.length > 0;

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
            <h1 className="text-2xl font-semibold tracking-tight">
              Edit Product
            </h1>
            <p className="text-sm text-muted-foreground">
              Edit product details and assign category for {product.name}
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
              <form
                onSubmit={productForm.handleSubmit(onProductSubmit)}
                className="space-y-4"
              >
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
                        <Textarea
                          placeholder="Enter product description"
                          rows={3}
                          {...field}
                        />
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
                        <Input
                          placeholder="https://example.com"
                          {...field}
                          value={field.value || ""}
                        />
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

        {/* Category Assignment Card */}
        <Card>
          <CardHeader>
            <CardTitle>Category Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...categoryForm}>
              <form
                onSubmit={categoryForm.handleSubmit(onCategorySubmit)}
                className="space-y-6"
              >
                <FormField
                  control={categoryForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => {
                          field.onChange(value ? parseInt(value, 10) : null);
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category Save Button */}
                <div className="flex items-center justify-end gap-2 pt-4">
                  <Button type="submit" disabled={!canSaveCategory}>
                    {isCategoryLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Category
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
