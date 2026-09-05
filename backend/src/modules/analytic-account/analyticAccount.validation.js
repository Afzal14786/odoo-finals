import { z } from "zod";

const analyticAccountTypeSchema = z.enum(["income", "expense"], {
  message: "Analytic account type must be income or expense",
});

export const createAnalyticAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Analytic account name must contain at least 2 characters")
    .max(100, "Analytic account name cannot exceed 100 characters"),

  type: analyticAccountTypeSchema,
});

export const updateAnalyticAccountSchema =
  createAnalyticAccountSchema.partial();

export const analyticAccountIdSchema = z.object({
  id: z.string().uuid("Invalid analytic account ID"),
});
