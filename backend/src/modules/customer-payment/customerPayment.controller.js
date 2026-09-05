import { CustomerPaymentService } from "./customerPayment.service.js";

export class CustomerPaymentController {
    
  static async createCustomerPayment(req, res, next) {
    try {
      const customerPayment =
        await CustomerPaymentService.createCustomerPayment(req.body);

      return res.status(201).json({
        success: true,
        message: "Customer payment created successfully",
        data: customerPayment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerPayments(req, res, next) {
    try {
      const customerPayments =
        await CustomerPaymentService.getCustomerPayments();

      return res.status(200).json({
        success: true,
        data: customerPayments,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerPaymentById(req, res, next) {
    try {
      const customerPayment =
        await CustomerPaymentService.getCustomerPaymentById(req.params.id);

      return res.status(200).json({
        success: true,
        data: customerPayment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CustomerPaymentController;
