import { eq, isNull } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  budgets,
  chartOfAccounts,
  analyticAccounts,
} from "../../../database/schema/index.js";

export class BudgetService {
    
  static async validateAccount(accountId) {
    const [account] = await database
      .select({
        id: chartOfAccounts.id,
        archivedAt: chartOfAccounts.archivedAt,
      })
      .from(chartOfAccounts)
      .where(eq(chartOfAccounts.id, accountId))
      .limit(1);

    if (!account) {
      const error = new Error("Account not found");

      error.statusCode = 404;
      error.code = "ACCOUNT_NOT_FOUND";

      throw error;
    }

    if (account.archivedAt) {
      const error = new Error("Account is archived");

      error.statusCode = 400;
      error.code = "ACCOUNT_ARCHIVED";

      throw error;
    }
  }

  static async validateAnalyticAccount(analyticAccountId) {
    const [analyticAccount] = await database
      .select({
        id: analyticAccounts.id,
        archivedAt: analyticAccounts.archivedAt,
      })
      .from(analyticAccounts)
      .where(eq(analyticAccounts.id, analyticAccountId))
      .limit(1);

    if (!analyticAccount) {
      const error = new Error("Analytic account not found");

      error.statusCode = 404;
      error.code = "ANALYTIC_ACCOUNT_NOT_FOUND";

      throw error;
    }

    if (analyticAccount.archivedAt) {
      const error = new Error("Analytic account is archived");

      error.statusCode = 400;
      error.code = "ANALYTIC_ACCOUNT_ARCHIVED";

      throw error;
    }
  }

  static async createBudget(data) {
    await this.validateAccount(data.accountId);
    await this.validateAnalyticAccount(data.analyticAccountId);

    const [budget] = await database
      .insert(budgets)
      .values({
        name: data.name,
        accountId: data.accountId,
        analyticAccountId: data.analyticAccountId,
        startDate: data.startDate,
        endDate: data.endDate,
        plannedAmount: data.plannedAmount,
      })
      .returning();

    return budget;
  }

  static async getBudgets() {
    return await database
      .select()
      .from(budgets)
      .where(isNull(budgets.archivedAt));
  }

  static async getBudgetById(id) {
    const [budget] = await database
      .select()
      .from(budgets)
      .where(eq(budgets.id, id))
      .limit(1);

    if (!budget || budget.archivedAt) {
      const error = new Error("Budget not found");

      error.statusCode = 404;
      error.code = "BUDGET_NOT_FOUND";

      throw error;
    }

    return budget;
  }

  static async updateBudget(id, data) {

    const existingBudget = await this.getBudgetById(id);

    if (data.accountId !== undefined) {
      await this.validateAccount(data.accountId);
    }

    if (data.analyticAccountId !== undefined) {
      await this.validateAnalyticAccount(data.analyticAccountId);
    }

    const startDate = data.startDate ?? existingBudget.startDate;

    const endDate = data.endDate ?? existingBudget.endDate;

    if (startDate > endDate) {
      const error = new Error("Start date cannot be after end date");

      error.statusCode = 400;
      error.code = "INVALID_BUDGET_DATE_RANGE";

      throw error;
    }

    const updateData = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.accountId !== undefined) {
      updateData.accountId = data.accountId;
    }

    if (data.analyticAccountId !== undefined) {
      updateData.analyticAccountId = data.analyticAccountId;
    }

    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate;
    }

    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate;
    }

    if (data.plannedAmount !== undefined) {
      updateData.plannedAmount = data.plannedAmount;
    }

    if (Object.keys(updateData).length === 0) {
      const error = new Error("No fields provided for update");

      error.statusCode = 400;
      error.code = "NO_UPDATE_FIELDS";

      throw error;
    }

    const [updatedBudget] = await database
      .update(budgets)
      .set(updateData)
      .where(eq(budgets.id, id))
      .returning();

    return updatedBudget;
  }

  static async archiveBudget(id) {
    await this.getBudgetById(id);

    const [archivedBudget] = await database
      .update(budgets)
      .set({
        archivedAt: new Date(),
      })
      .where(eq(budgets.id, id))
      .returning();

    return archivedBudget;
  }
}
