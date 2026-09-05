import { SalesOrderService } from "./salesOrder.service.js";

export class SalesOrderController {
    
  static async createSalesOrder(req, res, next) {
    try {
      const salesOrder = await SalesOrderService.createSalesOrder(req.body);

      return res.status(201).json({
        success: true,
        message: "Sales order created successfully",
        data: salesOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSalesOrders(req, res, next) {
    try {
      const salesOrders = await SalesOrderService.getSalesOrders();

      return res.status(200).json({
        success: true,
        data: salesOrders,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSalesOrderById(req, res, next) {
    try {
      const salesOrder = await SalesOrderService.getSalesOrderById(
        req.params.id,
      );

      return res.status(200).json({
        success: true,
        data: salesOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSalesOrder(req, res, next) {
    try {
      const salesOrder = await SalesOrderService.updateSalesOrder(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Sales order updated successfully",
        data: salesOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  static async archiveSalesOrder(req, res, next) {
    try {
      const salesOrder = await SalesOrderService.archiveSalesOrder(
        req.params.id,
      );

      return res.status(200).json({
        success: true,
        message: "Sales order archived successfully",
        data: salesOrder,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default SalesOrderController;
