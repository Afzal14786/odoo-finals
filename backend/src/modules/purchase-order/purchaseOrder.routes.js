import { Router } from "express";

import { PurchaseOrderController } from "./purchaseOrder.controller.js";

const purchaseOrderRoute = Router();

purchaseOrderRoute.post("/", PurchaseOrderController.createPurchaseOrder);

purchaseOrderRoute.get("/", PurchaseOrderController.getPurchaseOrders);

purchaseOrderRoute.get("/:id", PurchaseOrderController.getPurchaseOrderById);

purchaseOrderRoute.patch("/:id", PurchaseOrderController.updatePurchaseOrder);

purchaseOrderRoute.patch(
  "/:id/archive",
  PurchaseOrderController.archivePurchaseOrder,
);

export default purchaseOrderRoute;
