import { Router } from "express";

import { AnalyticAccountController } from "./analyticAccount.controller.js";
const analyticAccountRoute = Router();

analyticAccountRoute.post("/", AnalyticAccountController.createAnalyticAccount);
analyticAccountRoute.get("/", AnalyticAccountController.getAnalyticAccounts);

analyticAccountRoute.get(
  "/:id",
  AnalyticAccountController.getAnalyticAccountById,
);

analyticAccountRoute.patch(
  "/:id",
  AnalyticAccountController.updateAnalyticAccount,
);

analyticAccountRoute.patch(
  "/:id/archive",
  AnalyticAccountController.archiveAnalyticAccount,
);

export default analyticAccountRoute;
