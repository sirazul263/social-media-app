import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(3, "Content must be at least 3 characters"),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;
