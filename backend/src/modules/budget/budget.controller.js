import {
  createBudgetSchema,
  updateBudgetSchema,
  budgetIdSchema,
} from "./budget.validation.js";

import { BudgetService } from "./budget.service.js";

export class BudgetController {
  static async createBudget(req, res, next) {
    try {
      const validatedData = createBudgetSchema.parse(req.body);

      const budget = await BudgetService.createBudget(validatedData);

      return res.status(201).json({
        success: true,
        message: "Budget created successfully",
        data: {
          budget,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBudgets(req, res, next) {
    try {
      const budgets = await BudgetService.getBudgets();

      return res.status(200).json({
        success: true,
        message: "Budgets retrieved successfully",
        data: {
          budgets,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getBudgetById(req, res, next) {
    try {
      const { id } = budgetIdSchema.parse(req.params);

      const budget = await BudgetService.getBudgetById(id);

      return res.status(200).json({
        success: true,
        message: "Budget retrieved successfully",
        data: {
          budget,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBudget(req, res, next) {
    try {
      const { id } = budgetIdSchema.parse(req.params);

      const validatedData = updateBudgetSchema.parse(req.body);

      const budget = await BudgetService.updateBudget(id, validatedData);

      return res.status(200).json({
        success: true,
        message: "Budget updated successfully",
        data: {
          budget,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async archiveBudget(req, res, next) {
    try {
      const { id } = budgetIdSchema.parse(req.params);

      const budget = await BudgetService.archiveBudget(id);

      return res.status(200).json({
        success: true,
        message: "Budget archived successfully",
        data: {
          budget,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
