import { Router } from "express";

import { BalanceSheetController } from "./balanceSheet.controller.js";

const balanceSheetRoute = Router();

balanceSheetRoute.get("/", BalanceSheetController.getBalanceSheetReport);

export default balanceSheetRoute;
