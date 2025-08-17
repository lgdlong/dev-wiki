// apps/web/src/validations/post-video-schema.ts
import { YOUTUBE_URL_REGEX } from "@/app/mod/youtube/constant";
import { z } from "zod";

export const postVideoSchema = z.object({
  youtubeUrl: z.string().regex(YOUTUBE_URL_REGEX, {
    message:
      "Invalid YouTube URL. Please enter a valid link like https://www.youtube.com/watch?v=-GFigzht4G0",
  }),
});

export type PostVideoFormValues = z.infer<typeof postVideoSchema>;
