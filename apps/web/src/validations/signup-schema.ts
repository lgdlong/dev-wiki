// apps/web/src/validations/signup-schema.ts

import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(1, "Name is required!"),
    email: z
      .string()
      .min(1, "Email is required!")
      .email("Please provide a valid email!"),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm: z.string().min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match!",
    path: ["confirm"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
