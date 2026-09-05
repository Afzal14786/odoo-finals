import { PurchasePaymentService } from "./purchasePayment.service.js";

export class PurchasePaymentController {
    
  static async createPurchasePayment(req, res, next) {
    try {
      const purchasePayment =
        await PurchasePaymentService.createPurchasePayment(req.body);

      return res.status(201).json({
        success: true,
        message: "Purchase payment registered successfully",
        data: purchasePayment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchasePayments(req, res, next) {
    try {
      const purchasePayments =
        await PurchasePaymentService.getPurchasePayments();

      return res.status(200).json({
        success: true,
        data: purchasePayments,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchasePaymentById(req, res, next) {
    try {
      const purchasePayment =
        await PurchasePaymentService.getPurchasePaymentById(req.params.id);

      return res.status(200).json({
        success: true,
        data: purchasePayment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default PurchasePaymentController;
