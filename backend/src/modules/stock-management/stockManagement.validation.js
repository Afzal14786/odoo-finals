import { z } from "zod";

export const createStockMovementSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),

  movementType: z.enum(["in", "out"], {
    message: "Movement type must be in or out",
  }),

  quantity: z
    .number({
      message: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than zero"),

  referenceType: z
    .string()
    .trim()
    .min(1, "Reference type is required")
    .max(50, "Reference type cannot exceed 50 characters"),

  referenceId: z.string().uuid("Invalid reference ID").optional(),

  movementDate: z.string().date("Invalid movement date"),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters"),
});

export const stockMovementIdSchema = z.object({
  id: z.string().uuid("Invalid stock movement ID"),
});

export const stockProductIdSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
});
