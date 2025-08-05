// apps/web/src/validations/post-video-schema.ts
import { z } from "zod";

export const postVideoSchema = z.object({
  youtubeUrl: z
    .string()
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}(&.*)?$/,
      { message: "Invalid Youtube URL." },
    ),
});

export type PostVideoFormValues = z.infer<typeof postVideoSchema>;
