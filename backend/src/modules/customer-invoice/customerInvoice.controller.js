import { CustomerInvoiceService } from "./customerInvoice.service.js";

export class CustomerInvoiceController {
  static async createCustomerInvoice(req, res, next) {
    try {
      const customerInvoice =
        await CustomerInvoiceService.createCustomerInvoice(req.body);

      return res.status(201).json({
        success: true,
        message: "Customer invoice created successfully",
        data: customerInvoice,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerInvoices(req, res, next) {
    try {
      const customerInvoices =
        await CustomerInvoiceService.getCustomerInvoices();

      return res.status(200).json({
        success: true,
        data: customerInvoices,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerInvoiceById(req, res, next) {
    try {
      const customerInvoice =
        await CustomerInvoiceService.getCustomerInvoiceById(req.params.id);

      return res.status(200).json({
        success: true,
        data: customerInvoice,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCustomerInvoice(req, res, next) {
    try {
      const customerInvoice =
        await CustomerInvoiceService.updateCustomerInvoice(
          req.params.id,
          req.body,
        );

      return res.status(200).json({
        success: true,
        message: "Customer invoice updated successfully",
        data: customerInvoice,
      });
    } catch (error) {
      next(error);
    }
  }

  static async archiveCustomerInvoice(req, res, next) {
    try {
      const customerInvoice =
        await CustomerInvoiceService.archiveCustomerInvoice(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Customer invoice archived successfully",
        data: customerInvoice,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CustomerInvoiceController;
