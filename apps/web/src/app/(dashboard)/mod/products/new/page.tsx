"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { createProduct } from "@/utils/api/productApi";
import type { CreateProductDTO, Product } from "@/types/product";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// ---- Validation schema (zod) ----
const urlOptional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? undefined : v))
  .refine((v) => !v || /^https?:\/\//i.test(v), {
    message: "Must start with http(s)://",
  });

const postProductSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  logoUrl: urlOptional,
  homepageUrl: urlOptional,
  githubUrl: urlOptional,
  description: z.string().optional(),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

type PostProductFormValues = z.infer<typeof postProductSchema>;

export default function NewProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();

  const form = useForm<PostProductFormValues>({
    resolver: zodResolver(postProductSchema) as any,
    defaultValues: {
      name: "",
      logoUrl: "",
      homepageUrl: "",
      githubUrl: "",
      description: "",
      pros: "",
      cons: "",
    },
  });

  async function onSubmit(values: PostProductFormValues) {
    try {
      // Check if user is signed in
      if (isUserLoading || !currentUser?.id) {
        toast.error("You must be signed in to create a product.");
        return;
      }
      setIsSubmitting(true);
      // Map form values -> DTO (same keys here)
      const payload: CreateProductDTO = {
        name: values.name,
        logoUrl: values.logoUrl,
        homepageUrl: values.homepageUrl,
        githubUrl: values.githubUrl,
        description: values.description ?? null,
        pros: values.pros ?? null,
        cons: values.cons ?? null,
      };

      // Call API to create product
      const created: Product = await createProduct(payload);

      // Show the success message
      toast.success("Product created", {
        description: created?.name ?? "",
      });
    } catch (e: any) {
      toast.error("Failed to create product", {
        description: e?.message ?? "Unexpected error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const logoPreview = form.watch("logoUrl");

  return (
    <div className="flex flex-col items-center min-h-screen pt-20">
      <div className="w-full max-w-3xl px-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Create New Product</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bun, Vite, Prisma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description (big) */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What is this product? Key features, use cases, etc."
                          className="min-h-40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* URLs */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Home page url */}
                  <FormField
                    control={form.control}
                    name="homepageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Homepage URL</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* GitHub url */}
                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://github.com/org/repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-4 items-end">
                  {/* Logo url */}
                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://.../logo.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quick logo preview */}
                  <div className="flex items-center gap-1 md:border-l md:pl-4">
                    <div className="text-sm text-muted-foreground">Preview:</div>
                    <div className="h-10 w-10 overflow-hidden rounded border bg-muted">
                      {logoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logoPreview} alt="logo preview" className="h-full w-full object-contain" />
                      ) : null}
                    </div>
                  </div>
                </div>


                {/* Pros (big) */}
                <FormField
                  control={form.control}
                  name="pros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pros</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Bullet points or short lines — advantages, strengths, best use cases"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cons (big) */}
                <FormField
                  control={form.control}
                  name="cons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cons</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Limitations, trade-offs, what to watch out for"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end gap-2">
                  <Button type="reset" variant="outline" disabled={isSubmitting} onClick={() => form.reset()}>
                    Reset
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Product"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>

          <CardFooter />
        </Card>
      </div>
    </div>
  );
}
