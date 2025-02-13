import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(3, "Content must be at least 3 characters"),
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
});

export type CreatePostValues = z.infer<typeof createPostSchema>;
