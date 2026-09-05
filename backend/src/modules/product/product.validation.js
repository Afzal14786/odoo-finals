import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must contain at least 2 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  type: z.enum(["goods", "service", "combo"], {
    message: "Type must be goods, service, or combo",
  }),

  salesPrice: z
    .number()
    .int("Sales price must be an integer")
    .nonnegative("Sales price cannot be negative"),

  purchasePrice: z
    .number()
    .int("Purchase price must be an integer")
    .nonnegative("Purchase price cannot be negative"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(100, "Category cannot exceed 100 characters"),
});

export const updateProductSchema = createProductSchema.partial();

export const productIdSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
});
