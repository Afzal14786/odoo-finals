import { z } from "zod";

export const balanceSheetReportSchema = z.object({
  asOfDate: z.string().date("Invalid as of date").optional(),
});
