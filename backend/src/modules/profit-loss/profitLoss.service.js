import { and, eq, gte, lte, isNull, sql } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  chartOfAccounts,
  journalEntries,
  journalItems,
} from "../../../database/schema/index.js";

export class ProfitLossService {
  static async getProfitLossReport({ fromDate, toDate }) {
    if (fromDate && toDate && fromDate > toDate) {
      const error = new Error("From date cannot be greater than to date");

      error.statusCode = 400;
      error.code = "INVALID_DATE_RANGE";

      throw error;
    }

    const conditions = [isNull(chartOfAccounts.archivedAt)];

    if (fromDate) {
      conditions.push(gte(journalEntries.entryDate, fromDate));
    }

    if (toDate) {
      conditions.push(lte(journalEntries.entryDate, toDate));
    }

    const rows = await database
      .select({
        accountId: chartOfAccounts.id,
        accountName: chartOfAccounts.accountName,
        accountType: chartOfAccounts.accountType,

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
      .from(chartOfAccounts)
      .innerJoin(journalItems, eq(chartOfAccounts.id, journalItems.accountId))
      .innerJoin(
        journalEntries,
        eq(journalItems.journalEntryId, journalEntries.id),
      )
      .where(and(...conditions))
      .groupBy(
        chartOfAccounts.id,
        chartOfAccounts.accountName,
        chartOfAccounts.accountType,
      );

    const income = [];
    const expenses = [];

    for (const row of rows) {
      const debit = Number(row.debit);
      const credit = Number(row.credit);

      if (row.accountType === "income") {
        const amount = credit - debit;

        income.push({
          accountId: row.accountId,
          accountName: row.accountName,
          amount,
        });
      }

      if (row.accountType === "expense") {
        const amount = debit - credit;

        expenses.push({
          accountId: row.accountId,
          accountName: row.accountName,
          amount,
        });
      }
    }

    const totalIncome = income.reduce(
      (total, account) => total + account.amount,
      0,
    );

    const totalExpenses = expenses.reduce(
      (total, account) => total + account.amount,
      0,
    );

    const netProfit = totalIncome - totalExpenses;

    return {
      fromDate: fromDate ?? null,
      toDate: toDate ?? null,

      income,
      expenses,

      totalIncome,
      totalExpenses,
      netProfit,

      result: netProfit >= 0 ? "profit" : "loss",
    };
  }
}

export default ProfitLossService;
