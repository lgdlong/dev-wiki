import { z } from "zod";

const urlOptional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? undefined : v))
  .refine((v) => !v || /^https?:\/\//i.test(v), {
    message: "Must start with http(s)://",
  });

// Product information schema (without category)
export const editProductSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().optional(),
  logoUrl: urlOptional,
  homepageUrl: urlOptional,
  githubUrl: urlOptional,
  pros: z.string().optional(),
  cons: z.string().optional(),
});

// Category assignment schema (separate)
export const editCategorySchema = z.object({
  categoryId: z.number().int().nonnegative().nullable(),
});

// Combined schema (for backward compatibility)
export const editProductCategorySchema = z.object({
  // Product information fields
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().optional(),
  logoUrl: urlOptional,
  homepageUrl: urlOptional,
  githubUrl: urlOptional,
  pros: z.string().optional(),
  cons: z.string().optional(),

  // Category assignment
  categoryId: z.number().int().nonnegative().nullable(),
});

export type EditProductFormValues = z.infer<typeof editProductSchema>;
export type EditCategoryFormValues = z.infer<typeof editCategorySchema>;
export type EditProductCategoryFormValues = z.infer<
  typeof editProductCategorySchema
>;
