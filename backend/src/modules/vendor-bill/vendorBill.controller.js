import {
  createVendorBillSchema,
  updateVendorBillSchema,
  vendorBillIdSchema,
} from "./vendorBill.validation.js";

import { VendorBillService } from "./vendorBill.service.js";

export class VendorBillController {
  static async createVendorBill(req, res, next) {
    try {
      const validatedData = createVendorBillSchema.parse(req.body);

      const vendorBill =
        await VendorBillService.createVendorBill(validatedData);

      return res.status(201).json({
        success: true,
        message: "Vendor bill created successfully",
        data: {
          vendorBill,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVendorBills(req, res, next) {
    try {
      const vendorBills = await VendorBillService.getVendorBills();

      return res.status(200).json({
        success: true,
        message: "Vendor bills retrieved successfully",
        data: {
          vendorBills,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVendorBillById(req, res, next) {
    try {
      const { id } = vendorBillIdSchema.parse(req.params);

      const vendorBill = await VendorBillService.getVendorBillById(id);

      return res.status(200).json({
        success: true,
        message: "Vendor bill retrieved successfully",
        data: {
          vendorBill,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateVendorBill(req, res, next) {
    try {
      const { id } = vendorBillIdSchema.parse(req.params);

      const validatedData = updateVendorBillSchema.parse(req.body);

      const vendorBill = await VendorBillService.updateVendorBill(
        id,
        validatedData,
      );

      return res.status(200).json({
        success: true,
        message: "Vendor bill updated successfully",
        data: {
          vendorBill,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async archiveVendorBill(req, res, next) {
    try {
      const { id } = vendorBillIdSchema.parse(req.params);

      const vendorBill = await VendorBillService.archiveVendorBill(id);

      return res.status(200).json({
        success: true,
        message: "Vendor bill archived successfully",
        data: {
          vendorBill,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
