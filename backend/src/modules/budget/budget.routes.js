import { Router } from "express";

import { BudgetController } from "./budget.controller.js";

const budgetRoute = Router();

budgetRoute.post("/", BudgetController.createBudget);
budgetRoute.get("/", BudgetController.getBudgets);
budgetRoute.get("/:id", BudgetController.getBudgetById);
budgetRoute.patch("/:id", BudgetController.updateBudget);
budgetRoute.patch("/:id/archive", BudgetController.archiveBudget);

export default budgetRoute;
