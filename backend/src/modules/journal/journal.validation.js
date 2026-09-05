import { z } from "zod";

const journalTypeSchema = z.enum(["sales", "purchase", "bank", "cash"], {
  message: "Journal type must be sales, purchase, bank, or cash",
});

export const createJournalSchema = z.object({
  journalName: z
    .string()
    .trim()
    .min(2, "Journal name must contain at least 2 characters")
    .max(100, "Journal name cannot exceed 100 characters"),

  journalType: journalTypeSchema,

  defaultDebitAccountId: z.string().uuid("Invalid default debit account ID"),

  defaultCreditAccountId: z.string().uuid("Invalid default credit account ID"),
});

export const updateJournalSchema = createJournalSchema.partial();

export const journalIdSchema = z.object({
  id: z.string().uuid("Invalid journal ID"),
});
