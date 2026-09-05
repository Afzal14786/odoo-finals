import { budgetReportSchema } from "./budgetReport.validation.js";
import { BudgetReportService } from "./budgetReport.service.js";

export class BudgetReportController {
  static async getBudgetReport(req, res, next) {
    try {
      const validatedData = budgetReportSchema.parse(req.query);

      const report = await BudgetReportService.getBudgetReport(validatedData);

      return res.status(200).json({
        success: true,
        message: "Budget report retrieved successfully",
        data: {
          report,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BudgetReportController;
