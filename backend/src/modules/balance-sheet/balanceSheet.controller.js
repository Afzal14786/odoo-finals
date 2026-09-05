import { BalanceSheetService } from "./balanceSheet.service.js";

export class BalanceSheetController {
  static async getBalanceSheetReport(req, res, next) {
    try {
      const report = await BalanceSheetService.getBalanceSheetReport({
        asOfDate: req.query.asOfDate,
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

export default BalanceSheetController;
