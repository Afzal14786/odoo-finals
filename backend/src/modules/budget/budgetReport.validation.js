import {z} from "zod";

export const budgetReportSchema = z.object({
  fromDate: z.string().date("Invalid from date").optional(),
  toDate: z.string().date("Invalid to date").optional(),
});