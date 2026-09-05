import { z } from "zod";

export const createPurchasePaymentSchema = z.object({
  vendorBillId: z.string().uuid("Invalid vendor bill ID"),

  paymentDate: z.string().date("Invalid payment date"),

  paymentMethod: z.enum(["cash", "bank"], {
    message: "Payment method must be cash or bank",
  }),

  amount: z
    .number({
      message: "Amount must be a number",
    })
    .int("Amount must be an integer")
    .positive("Amount must be greater than zero"),

  reference: z
    .string()
    .trim()
    .min(1, "Reference is required")
    .max(100, "Reference cannot exceed 100 characters"),
});

export const purchasePaymentIdSchema = z.object({
  id: z.string().uuid("Invalid purchase payment ID"),
});
