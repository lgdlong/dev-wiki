import { z } from "zod";

/**
 * Chuỗi URL tuỳ chọn:
 * - Cho phép rỗng ("" -> undefined)
 * - Nếu có giá trị phải bắt đầu bằng http(s)://
 */
const urlOptional = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" ? undefined : v))
  .refine((v) => !v || /^https?:\/\//i.test(v), {
    message: "Must start with http(s)://",
  });

/**
 * Schema thông tin sản phẩm (không bao gồm category)
 * Lưu ý: các field URL dùng urlOptional để tránh lỗi khi để trống.
 */
export const editProductSchema = z.object({
  // Tên sản phẩm: bắt buộc, tối thiểu 2 ký tự (sau khi trim)
  name: z.string().trim().min(2, "Name is required"),

  // Mô tả: không bắt buộc
  description: z.string().optional(),

  // Logo / homepage / github: không bắt buộc, nếu có phải là http(s)
  logoUrl: urlOptional,
  homepageUrl: urlOptional,
  githubUrl: urlOptional,

  // Pros/Cons: không bắt buộc
  pros: z.string().optional(),
  cons: z.string().optional(),
});

/**
 * Schema gán nhiều category cho sản phẩm.
 * - Bắt buộc phải có ít nhất 1 category (nonempty).
 * - Mỗi phần tử là số nguyên dương.
 *
 * Nếu muốn cho phép mảng rỗng (VD: cho phép chọn dần rồi mới lưu),
 * thay `.nonempty(...)` bằng `.default([])` và xử lý điều kiện ở UI.
 */
export const editCategorySchema = z.object({
  categoryIds: z
    .array(z.number().int().positive())
    .nonempty("Select at least one category"),
});

/**
 * Schema kết hợp: thông tin sản phẩm + danh sách categoryIds
 * (Phù hợp cho form chỉnh sửa tổng hợp)
 */
export const editProductCategorySchema = editProductSchema.extend({
  categoryIds: z
    .array(z.number().int().positive())
    .nonempty("Select at least one category"),
});

// Kiểu dữ liệu TypeScript suy ra từ schema
export type EditProductFormValues = z.infer<typeof editProductSchema>;
export type EditCategoryFormValues = z.infer<typeof editCategorySchema>;
export type EditProductCategoryFormValues = z.infer<typeof editProductCategorySchema>;
