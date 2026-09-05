import { z } from "zod";

const budgetDateSchema = z.string().date("Invalid date format");

export const createBudgetSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Budget name must contain at least 2 characters")
      .max(100, "Budget name cannot exceed 100 characters"),

    accountId: z.string().uuid("Invalid account ID"),

    analyticAccountId: z.string().uuid("Invalid analytic account ID"),

    startDate: budgetDateSchema,

    endDate: budgetDateSchema,

    plannedAmount: z
      .number({
        message: "Planned amount must be a number",
      })
      .int("Planned amount must be an integer")
      .nonnegative("Planned amount cannot be negative"),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Start date cannot be after end date",
    path: ["startDate"],
  });

export const updateBudgetSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Budget name must contain at least 2 characters")
      .max(100, "Budget name cannot exceed 100 characters")
      .optional(),

    accountId: z.string().uuid("Invalid account ID").optional(),

    analyticAccountId: z
      .string()
      .uuid("Invalid analytic account ID")
      .optional(),

    startDate: budgetDateSchema.optional(),

    endDate: budgetDateSchema.optional(),

    plannedAmount: z
      .number({
        message: "Planned amount must be a number",
      })
      .int("Planned amount must be an integer")
      .nonnegative("Planned amount cannot be negative")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate !== undefined && data.endDate !== undefined) {
        return data.startDate <= data.endDate;
      }

      return true;
    },
    {
      message: "Start date cannot be after end date",
      path: ["startDate"],
    },
  );

export const budgetIdSchema = z.object({
  id: z.string().uuid("Invalid budget ID"),
});
