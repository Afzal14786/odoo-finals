import { z } from "zod";

export const createSalesOrderSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID"),

  orderDate: z.string().date("Invalid order date"),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters"),

  items: z
    .array(
      z.object({
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
          .positive("Unit price must be greater than zero"),

        tax: z
          .number({
            message: "Tax must be a number",
          })
          .int("Tax must be an integer")
          .nonnegative("Tax cannot be negative"),
      }),
    )
    .min(1, "At least one product is required"),
});

export const updateSalesOrderSchema = z.object({
  customerId: z.string().uuid("Invalid customer ID").optional(),

  orderDate: z.string().date("Invalid order date").optional(),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters")
    .optional(),

  items: z
    .array(
      z.object({
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
          .positive("Unit price must be greater than zero"),

        tax: z
          .number({
            message: "Tax must be a number",
          })
          .int("Tax must be an integer")
          .nonnegative("Tax cannot be negative"),
      }),
    )
    .min(1, "At least one product is required")
    .optional(),
});

export const salesOrderIdSchema = z.object({
  id: z.string().uuid("Invalid sales order ID"),
});
