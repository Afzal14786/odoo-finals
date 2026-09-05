import { Router } from "express";

import { ChartOfAccountController } from "./chartOfAccount.controller.js";

const chartOfAccountRoute = Router();

chartOfAccountRoute.post("/", ChartOfAccountController.createAccount);
chartOfAccountRoute.get("/", ChartOfAccountController.getAccounts);
chartOfAccountRoute.get("/:id", ChartOfAccountController.getAccountById);
chartOfAccountRoute.patch("/:id", ChartOfAccountController.updateAccount);

chartOfAccountRoute.patch(
  "/:id/archive",
  ChartOfAccountController.archiveAccount,
);

export default chartOfAccountRoute;
