import {
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
  purchaseOrderIdSchema,
} from "./purchaseOrder.validation.js";

import { PurchaseOrderService } from "./purchaseOrder.service.js";

export class PurchaseOrderController {
  static async createPurchaseOrder(req, res, next) {
    try {
      const validatedData = createPurchaseOrderSchema.parse(req.body);

      const purchaseOrder =
        await PurchaseOrderService.createPurchaseOrder(validatedData);

      return res.status(201).json({
        success: true,
        message: "Purchase order created successfully",
        data: {
          purchaseOrder,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchaseOrders(req, res, next) {
    try {
      const purchaseOrders = await PurchaseOrderService.getPurchaseOrders();

      return res.status(200).json({
        success: true,
        message: "Purchase orders retrieved successfully",
        data: {
          purchaseOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchaseOrderById(req, res, next) {
    try {
      const { id } = purchaseOrderIdSchema.parse(req.params);

      const purchaseOrder = await PurchaseOrderService.getPurchaseOrderById(id);

      return res.status(200).json({
        success: true,
        message: "Purchase order retrieved successfully",
        data: {
          purchaseOrder,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updatePurchaseOrder(req, res, next) {
    try {
      const { id } = purchaseOrderIdSchema.parse(req.params);

      const validatedData = updatePurchaseOrderSchema.parse(req.body);

      const purchaseOrder = await PurchaseOrderService.updatePurchaseOrder(
        id,
        validatedData,
      );

      return res.status(200).json({
        success: true,
        message: "Purchase order updated successfully",
        data: {
          purchaseOrder,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async archivePurchaseOrder(req, res, next) {
    try {
      const { id } = purchaseOrderIdSchema.parse(req.params);

      const purchaseOrder = await PurchaseOrderService.archivePurchaseOrder(id);

      return res.status(200).json({
        success: true,
        message: "Purchase order archived successfully",
        data: {
          purchaseOrder,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
