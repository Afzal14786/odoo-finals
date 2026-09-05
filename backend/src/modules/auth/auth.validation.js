import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(30, "Name cannot exceed 30 characters"),

  email: z.string().trim().toLowerCase().email("Invalid email address"),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  address: z
    .string()
    .trim()
    .min(5, "Address is too short")
    .max(500, "Address is too long"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Invalid password"),
});
