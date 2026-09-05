import { z } from "zod";

const accountTypeSchema = z.enum([
    "asset",
    "liability",
    "expense",
    "income",
    "capital",
], {
    message:
        "Account type must be asset, liability, expense, income, or capital",
});

export const createAccountSchema = z.object({
    accountName: z
        .string()
        .trim()
        .min(2, "Account name must contain at least 2 characters")
        .max(100, "Account name cannot exceed 100 characters"),

    accountType: accountTypeSchema,
});

export const updateAccountSchema =
    createAccountSchema.partial();

export const accountIdSchema = z.object({
    id: z.string().uuid("Invalid account ID"),
});