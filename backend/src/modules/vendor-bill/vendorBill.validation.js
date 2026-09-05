import { z } from "zod";

const vendorBillItemSchema = z.object({
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

export const createVendorBillSchema = z.object({
  vendorId: z.string().uuid("Invalid vendor ID"),

  purchaseOrderId: z.string().uuid("Invalid purchase order ID"),

  billDate: z.string().date("Invalid bill date"),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters"),

  items: z
    .array(vendorBillItemSchema)
    .min(1, "Vendor bill must contain at least one item"),
});

export const updateVendorBillSchema = z.object({
  vendorId: z.string().uuid("Invalid vendor ID").optional(),

  billDate: z.string().date("Invalid bill date").optional(),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters")
    .optional(),
});

export const vendorBillIdSchema = z.object({
  id: z.string().uuid("Invalid vendor bill ID"),
});
