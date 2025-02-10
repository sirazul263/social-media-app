import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1, "Display Name is required"),
  bio: z
    .string()
    .max(1000, "Bio must not be greater than 1000 characters")
    .optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
