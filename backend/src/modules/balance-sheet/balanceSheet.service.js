import { and, eq, lte, isNull, sql, gte } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  chartOfAccounts,
  journalEntries,
  journalItems,
} from "../../../database/schema/index.js";

export class BalanceSheetService {
  static async getBalanceSheetReport({ asOfDate }) {
    const conditions = [isNull(chartOfAccounts.archivedAt)];

    if (asOfDate) {
      conditions.push(lte(journalEntries.entryDate, asOfDate));
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

    const assets = [];
    const liabilities = [];
    const capital = [];

    for (const row of rows) {
      const debit = Number(row.debit);
      const credit = Number(row.credit);

      if (row.accountType === "asset") {
        assets.push({
          accountId: row.accountId,
          accountName: row.accountName,
          amount: debit - credit,
        });
      }

      if (row.accountType === "liability") {
        liabilities.push({
          accountId: row.accountId,
          accountName: row.accountName,
          amount: credit - debit,
        });
      }

      if (row.accountType === "capital") {
        capital.push({
          accountId: row.accountId,
          accountName: row.accountName,
          amount: credit - debit,
        });
      }
    }

    const totalAssets = assets.reduce(
      (total, account) => total + account.amount,
      0,
    );

    const totalLiabilities = liabilities.reduce(
      (total, account) => total + account.amount,
      0,
    );

    const totalCapital = capital.reduce(
      (total, account) => total + account.amount,
      0,
    );

    const profitLossConditions = [isNull(chartOfAccounts.archivedAt)];

    if (asOfDate) {
      profitLossConditions.push(lte(journalEntries.entryDate, asOfDate));
    }

    const profitLossRows = await database
      .select({
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
      .where(and(...profitLossConditions))
      .groupBy(chartOfAccounts.accountType);

    let totalIncome = 0;
    let totalExpenses = 0;

    for (const row of profitLossRows) {
      const debit = Number(row.debit);
      const credit = Number(row.credit);

      if (row.accountType === "income") {
        totalIncome += credit - debit;
      }

      if (row.accountType === "expense") {
        totalExpenses += debit - credit;
      }
    }

    const netProfit = totalIncome - totalExpenses;

    const totalEquity = totalCapital + netProfit;

    const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

    return {
      asOfDate: asOfDate ?? null,

      assets,

      liabilities,

      capital,

      currentProfitLoss: {
        totalIncome,
        totalExpenses,
        netProfit,
        result: netProfit >= 0 ? "profit" : "loss",
      },

      totalAssets,

      totalLiabilities,

      totalCapital,

      totalEquity,

      totalLiabilitiesAndEquity,

      balanced: totalAssets === totalLiabilitiesAndEquity,
    };
  }
}

export default BalanceSheetService;
