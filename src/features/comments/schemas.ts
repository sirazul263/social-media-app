import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
});

export type CreateCommentValues = z.infer<typeof createCommentSchema>;
