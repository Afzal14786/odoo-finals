import { Router } from "express";

import { BudgetReportController } from "./budgetReport.controller.js";

const budgetReportRoute = Router();

budgetReportRoute.get("/", BudgetReportController.getBudgetReport);

export default budgetReportRoute;