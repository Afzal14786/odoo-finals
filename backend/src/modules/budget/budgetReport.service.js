import { and, eq, gte, lte, isNull, sql } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  budgets,
  chartOfAccounts,
  journalEntries,
  journalItems,
} from "../../../database/schema/index.js";

export class BudgetReportService {
  static async getBudgetReport({ fromDate, toDate }) {
    if (fromDate && toDate && fromDate > toDate) {
      const error = new Error("From date cannot be greater than toDate");
      error.statusCode = 400;
      error.code = "INVALID_DATE_RANGE";
      throw error;
    }

    const budgetConditions = [
      isNull(budgets.archivedAt),
      isNull(chartOfAccounts.archivedAt),
    ];

    if (fromDate) {
      budgetConditions.push(gte(budgets.startDate, fromDate));
    }

    if (toDate) {
      budgetConditions.push(lte(budgets.endDate, toDate));
    }

    const budgetRows = await database
      .select({
        budgetId: budgets.id,
        budgetName: budgets.name,
        accountId: chartOfAccounts.id,
        accountName: chartOfAccounts.accountName,
        accountType: chartOfAccounts.accountType,
        analyticAccountId: budgets.analyticAccountId,
        startDate: budgets.startDate,
        endDate: budgets.endDate,
        plannedAmount: budgets.plannedAmount,
      })
      .from(budgets)
      .innerJoin(chartOfAccounts, eq(budgets.accountId, chartOfAccounts.id))
      .where(and(...budgetConditions));

    const report = [];

    for (const budget of budgetRows) {
      const actualConditions = [
        eq(journalItems.accountId, budget.accountId),
        gte(journalEntries.entryDate, budget.startDate),
        lte(journalEntries.entryDate, budget.endDate),
      ];

      const [actualRow] = await database
        .select({
          debit: sql`
            COALESCE(
              SUM(${journalItems.debit}),
              0
            )
          `,
          credit: sql`
            COALESCE(
              SUM(${journalItems.credit}),
              0
            )
          `,
        })
        .from(journalItems)
        .innerJoin(
          journalEntries,
          eq(journalItems.journalEntryId, journalEntries.id),
        )
        .where(and(...actualConditions));

      const debit = Number(actualRow?.debit ?? 0);
      const credit = Number(actualRow?.credit ?? 0);

      let actualAmount = 0;

      if (budget.accountType === "expense" || budget.accountType === "asset") {
        actualAmount = debit - credit;
      }

      if (
        budget.accountType === "income" ||
        budget.accountType === "liability" ||
        budget.accountType === "capital"
      ) {
        actualAmount = credit - debit;
      }

      const plannedAmount = Number(budget.plannedAmount);

      const variance = plannedAmount - actualAmount;

      const utilizationPercentage =
        plannedAmount === 0 ? 0 : (actualAmount / plannedAmount) * 100;

      report.push({
        budgetId: budget.budgetId,
        budgetName: budget.budgetName,
        accountId: budget.accountId,
        accountName: budget.accountName,
        accountType: budget.accountType,
        analyticAccountId: budget.analyticAccountId,
        startDate: budget.startDate,
        endDate: budget.endDate,
        plannedAmount,
        actualAmount,
        variance,
        utilizationPercentage,
      });
    }

    const totalPlannedAmount = report.reduce(
      (total, budget) => total + budget.plannedAmount,
      0,
    );

    const totalActualAmount = report.reduce(
      (total, budget) => total + budget.actualAmount,
      0,
    );

    const totalVariance = totalPlannedAmount - totalActualAmount;

    const overallUtilizationPercentage =
      totalPlannedAmount === 0
        ? 0
        : (totalActualAmount / totalPlannedAmount) * 100;

    return {
      fromDate: fromDate ?? null,
      toDate: toDate ?? null,
      budgets: report,
      summary: {
        totalPlannedAmount,
        totalActualAmount,
        totalVariance,
        overallUtilizationPercentage,
      },
    };
  }
}

export default BudgetReportService;
