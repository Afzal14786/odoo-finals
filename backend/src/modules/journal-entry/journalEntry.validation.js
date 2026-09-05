import { z } from "zod";

const journalItemSchema = z
  .object({
    accountId: z.string().uuid("Invalid account ID"),

    debit: z
      .number()
      .int("Debit must be an integer")
      .min(0, "Debit cannot be negative"),

    credit: z
      .number()
      .int("Credit must be an integer")
      .min(0, "Credit cannot be negative"),
  })
  .superRefine((item, ctx) => {
    if (item.debit > 0 && item.credit > 0) {
      ctx.addIssue({
        code: "custom",
        message: "An item cannot have both debit and credit",
        path: ["debit"],
      });
    }

    if (item.debit === 0 && item.credit === 0) {
      ctx.addIssue({
        code: "custom",
        message: "An item must have either debit or credit",
        path: ["debit"],
      });
    }
  });

export const createJournalEntrySchema = z
  .object({
    journalId: z.string().uuid("Invalid journal ID"),

    entryDate: z.string().date("Invalid entry date"),

    reference: z
      .string()
      .trim()
      .min(1, "Reference is required")
      .max(100, "Reference cannot exceed 100 characters"),

    items: z
      .array(journalItemSchema)
      .min(2, "Journal entry must contain at least 2 items"),
  })
  .superRefine((data, ctx) => {
    const totalDebit = data.items.reduce((sum, item) => sum + item.debit, 0);

    const totalCredit = data.items.reduce((sum, item) => sum + item.credit, 0);

    if (totalDebit !== totalCredit) {
      ctx.addIssue({
        code: "custom",
        message: "Total debit must be equal to total credit",
        path: ["items"],
      });
    }
  });

export const updateJournalEntrySchema = z.object({
  entryDate: z.string().date("Invalid entry date").optional(),

  reference: z
    .string()
    .trim()
    .min(1, "Reference cannot be empty")
    .max(100, "Reference cannot exceed 100 characters")
    .optional(),
});

export const journalEntryIdSchema = z.object({
  id: z.string().uuid("Invalid journal entry ID"),
});
