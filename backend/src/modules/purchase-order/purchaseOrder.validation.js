import { z } from "zod";

const purchaseOrderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),

  quantity: z
    .number({
      message: "Quantity must be a number",
    })
    .int("Quantity must be an integer")
    .positive("Quantity must be greater than zero"),

  unitPrice: z
    .number({
      message: "Unit price must be a number",
    })
    .int("Unit price must be an integer")
    .nonnegative("Unit price cannot be negative"),
});

export const createPurchaseOrderSchema = z.object({
  vendorId: z.string().uuid("Invalid vendor ID"),

  orderDate: z.string().date("Invalid order date"),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters"),

  items: z
    .array(purchaseOrderItemSchema)
    .min(1, "Purchase order must contain at least one item"),
});

export const updatePurchaseOrderSchema = z.object({
  orderDate: z.string().date("Invalid order date").optional(),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters")
    .optional(),

  vendorId: z.string().uuid("Invalid vendor ID").optional(),
});

export const purchaseOrderIdSchema = z.object({
  id: z.string().uuid("Invalid purchase order ID"),
});
