import { Router } from "express";

import { ProfitLossController } from "./profitLoss.controller.js";

const profitLossRoute = Router();

profitLossRoute.get("/", ProfitLossController.getProfitLossReport);

export default profitLossRoute;
