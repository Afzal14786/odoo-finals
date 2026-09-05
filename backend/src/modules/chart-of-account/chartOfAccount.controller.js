import {
  createAccountSchema,
  updateAccountSchema,
  accountIdSchema,
} from "./chartOfAccount.validation.js";

import { ChartOfAccountService } from "./chartOfAccount.service.js";

export class ChartOfAccountController {
  static async createAccount(req, res, next) {
    try {
      const validatedData = createAccountSchema.parse(req.body);

      const account = await ChartOfAccountService.createAccount(validatedData);

      return res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: {
          account,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAccounts(req, res, next) {
    try {
      const accounts = await ChartOfAccountService.getAccounts();

      return res.status(200).json({
        success: true,
        message: "Accounts retrieved successfully",
        data: {
          accounts,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAccountById(req, res, next) {
    try {
      const { id } = accountIdSchema.parse(req.params);

      const account = await ChartOfAccountService.getAccountById(id);

      return res.status(200).json({
        success: true,
        message: "Account retrieved successfully",
        data: {
          account,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAccount(req, res, next) {
    try {
      const { id } = accountIdSchema.parse(req.params);

      const validatedData = updateAccountSchema.parse(req.body);

      const account = await ChartOfAccountService.updateAccount(
        id,
        validatedData,
      );

      return res.status(200).json({
        success: true,
        message: "Account updated successfully",
        data: {
          account,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async archiveAccount(req, res, next) {
    try {
      const { id } = accountIdSchema.parse(req.params);

      const account = await ChartOfAccountService.archiveAccount(id);

      return res.status(200).json({
        success: true,
        message: "Account archived successfully",
        data: {
          account,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
