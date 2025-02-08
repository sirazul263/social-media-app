import { z } from "zod";

export const signUpSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "User name must be at least 3 characters")
    .max(20, "Username should not be more than 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters , numbers , and underscores are allowed"
    ),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z.string().min(8, "Password must at least 8 characters"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "User name is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginValues = z.infer<typeof loginSchema>;
