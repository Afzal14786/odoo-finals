import { ProfitLossService } from "./profitLoss.service.js";

export class ProfitLossController {
  static async getProfitLossReport(req, res, next) {
    try {
      const report = await ProfitLossService.getProfitLossReport({
        fromDate: req.query.fromDate,
        toDate: req.query.toDate,
      });

      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ProfitLossController;
