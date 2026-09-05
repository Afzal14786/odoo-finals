import { StockReportsService } from "./stockReports.service.js";

export class StockReportsController {
  static async getStockReport(req, res, next) {
    try {
      const report = await StockReportsService.getStockReport();

      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductStockReport(req, res, next) {
    try {
      const report = await StockReportsService.getProductStockReport(
        req.params.productId,
      );

      return res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default StockReportsController;
