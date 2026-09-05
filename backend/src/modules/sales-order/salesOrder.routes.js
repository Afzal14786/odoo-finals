import { Router } from "express";

import { SalesOrderController } from "./salesOrder.controller.js";

const salesOrderRoute = Router();

salesOrderRoute.post("/", SalesOrderController.createSalesOrder);
salesOrderRoute.get("/", SalesOrderController.getSalesOrders);
salesOrderRoute.get("/:id", SalesOrderController.getSalesOrderById);
salesOrderRoute.patch("/:id", SalesOrderController.updateSalesOrder);
salesOrderRoute.patch("/:id/archive", SalesOrderController.archiveSalesOrder);

export default salesOrderRoute;
