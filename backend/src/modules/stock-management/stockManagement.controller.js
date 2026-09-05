import { StockManagementService } from "./stockManagement.service.js";

export class StockManagementController {
  static async createStockMovement(req, res, next) {
    try {
      const stockMovement = await StockManagementService.createStockMovement(
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: "Stock movement created successfully",
        data: stockMovement,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStockMovements(req, res, next) {
    try {
      const stockMovements = await StockManagementService.getStockMovements();

      return res.status(200).json({
        success: true,
        data: stockMovements,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStockMovementById(req, res, next) {
    try {
      const stockMovement = await StockManagementService.getStockMovementById(
        req.params.id,
      );

      return res.status(200).json({
        success: true,
        data: stockMovement,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductStockDetails(req, res, next) {
    try {
      const stockDetails = await StockManagementService.getProductStockDetails(
        req.params.productId,
      );

      return res.status(200).json({
        success: true,
        data: stockDetails,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default StockManagementController;
