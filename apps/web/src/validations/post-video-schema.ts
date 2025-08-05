// apps/web/src/validations/post-video-schema.ts
import { z } from "zod";

export const postVideoSchema = z.object({
  youtubeUrl: z.string().min(5, {
    message: "Youtube URL không hợp lệ.",
  }),
});

export type PostVideoFormValues = z.infer<typeof postVideoSchema>;
