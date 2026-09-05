import { z } from "zod";

export const profitLossReportSchema = z.object({
  fromDate: z
    .string()
    .date("Invalid from date")
    .optional(),

  toDate: z
    .string()
    .date("Invalid to date")
    .optional(),
});