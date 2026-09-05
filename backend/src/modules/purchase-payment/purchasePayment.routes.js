import { Router } from "express";

import { PurchasePaymentController } from "./purchasePayment.controller.js";

const purchasePaymentRoute = Router();

purchasePaymentRoute.post("/", PurchasePaymentController.createPurchasePayment);
purchasePaymentRoute.get("/", PurchasePaymentController.getPurchasePayments);
purchasePaymentRoute.get(
  "/:id",
  PurchasePaymentController.getPurchasePaymentById,
);

export default purchasePaymentRoute;
