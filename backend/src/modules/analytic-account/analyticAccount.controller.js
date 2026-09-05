import {
  createAnalyticAccountSchema,
  updateAnalyticAccountSchema,
  analyticAccountIdSchema,
} from "./analyticAccount.validation.js";

import { AnalyticAccountService } from "./analyticAccount.service.js";

export class AnalyticAccountController {
  static async createAnalyticAccount(req, res, next) {
    try {
      const validatedData = createAnalyticAccountSchema.parse(req.body);

      const analyticAccount =
        await AnalyticAccountService.createAnalyticAccount(validatedData);

      return res.status(201).json({
        success: true,
        message: "Analytic account created successfully",
        data: {
          analyticAccount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAnalyticAccounts(req, res, next) {
    try {
      const analyticAccounts =
        await AnalyticAccountService.getAnalyticAccounts();

      return res.status(200).json({
        success: true,
        message: "Analytic accounts retrieved successfully",
        data: {
          analyticAccounts,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAnalyticAccountById(req, res, next) {
    try {
      const { id } = analyticAccountIdSchema.parse(req.params);

      const analyticAccount =
        await AnalyticAccountService.getAnalyticAccountById(id);

      return res.status(200).json({
        success: true,
        message: "Analytic account retrieved successfully",
        data: {
          analyticAccount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAnalyticAccount(req, res, next) {
    try {
      const { id } = analyticAccountIdSchema.parse(req.params);

      const validatedData = updateAnalyticAccountSchema.parse(req.body);

      const analyticAccount =
        await AnalyticAccountService.updateAnalyticAccount(id, validatedData);

      return res.status(200).json({
        success: true,
        message: "Analytic account updated successfully",
        data: {
          analyticAccount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async archiveAnalyticAccount(req, res, next) {
    try {
      const { id } = analyticAccountIdSchema.parse(req.params);

      const analyticAccount =
        await AnalyticAccountService.archiveAnalyticAccount(id);

      return res.status(200).json({
        success: true,
        message: "Analytic account archived successfully",
        data: {
          analyticAccount,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
