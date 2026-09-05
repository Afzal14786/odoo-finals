import { Router } from "express";

import { StockReportsController } from "./stockReports.controller.js";

const stockReportsRoute = Router();

stockReportsRoute.get("/", StockReportsController.getStockReport);
stockReportsRoute.get(
  "/:productId",
  StockReportsController.getProductStockReport,
);

export default stockReportsRoute;
