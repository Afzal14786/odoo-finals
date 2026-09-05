import { Router } from "express";

import { StockManagementController } from "./stockManagement.controller.js";

const stockManagementRoute = Router();

stockManagementRoute.post("/", StockManagementController.createStockMovement);
stockManagementRoute.get("/", StockManagementController.getStockMovements);
stockManagementRoute.get(
  "/product/:productId",
  StockManagementController.getProductStockDetails,
);
stockManagementRoute.get(
  "/:id",
  StockManagementController.getStockMovementById,
);

export default stockManagementRoute;
