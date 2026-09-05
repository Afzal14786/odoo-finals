import { Router } from "express";

import { CustomerPaymentController } from "./customerPayment.controller.js";

const customerPaymentRoute = Router();

customerPaymentRoute.post("/", CustomerPaymentController.createCustomerPayment);
customerPaymentRoute.get("/", CustomerPaymentController.getCustomerPayments);
customerPaymentRoute.get(
  "/:id",
  CustomerPaymentController.getCustomerPaymentById,
);

export default customerPaymentRoute;
