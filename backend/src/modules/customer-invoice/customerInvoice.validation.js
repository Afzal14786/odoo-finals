import { z } from "zod";

export const createCustomerInvoiceSchema = z.object({
  salesOrderId: z.string().uuid("Invalid sales order ID"),

  invoiceDate: z.string().date("Invalid invoice date"),

  dueDate: z.string().date("Invalid due date"),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters"),
});

export const updateCustomerInvoiceSchema = z.object({
  invoiceDate: z.string().date("Invalid invoice date").optional(),

  dueDate: z.string().date("Invalid due date").optional(),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters")
    .optional(),
});

export const customerInvoiceIdSchema = z.object({
  id: z.string().uuid("Invalid customer invoice ID"),
});
