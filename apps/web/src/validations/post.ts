import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  summary: z.string().max(300).optional().or(z.literal('')),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  coverUrl: z.union([z.string().url(), z.literal('')]),
  tags: z.array(z.string().min(1)).max(10).default([]),
});
