import { eq, isNull } from "drizzle-orm";

import { database } from "../../../database/index.js";

import {
  journalEntries,
  journalItems,
  journals,
  chartOfAccounts,
} from "../../../database/schema/index.js";

export class JournalEntryService {
  static async createJournalEntry(data) {
    return await database.transaction(async (tx) => {
      const [journal] = await tx
        .select()
        .from(journals)
        .where(eq(journals.id, data.journalId))
        .limit(1);

      if (!journal || journal.archivedAt) {
        const error = new Error("Journal not found");

        error.statusCode = 404;
        error.code = "JOURNAL_NOT_FOUND";

        throw error;
      }

      for (const item of data.items) {
        if (item.debit < 0 || item.credit < 0) {
          const error = new Error(
            "Debit and credit amounts cannot be negative",
          );

          error.statusCode = 400;
          error.code = "NEGATIVE_JOURNAL_AMOUNT";

          throw error;
        }

        if (item.debit > 0 && item.credit > 0) {
          const error = new Error(
            "A journal item cannot contain both debit and credit",
          );

          error.statusCode = 400;
          error.code = "INVALID_JOURNAL_ITEM";

          throw error;
        }

        if (item.debit === 0 && item.credit === 0) {
          const error = new Error(
            "A journal item must contain either a debit or credit amount",
          );

          error.statusCode = 400;
          error.code = "EMPTY_JOURNAL_ITEM";

          throw error;
        }
      }

      const accountIds = [...new Set(data.items.map((item) => item.accountId))];

      const accounts = await tx
        .select({
          id: chartOfAccounts.id,
        })
        .from(chartOfAccounts)
        .where(isNull(chartOfAccounts.archivedAt));

      const existingAccountIds = new Set(accounts.map((account) => account.id));

      const missingAccountId = accountIds.find(
        (accountId) => !existingAccountIds.has(accountId),
      );

      if (missingAccountId) {
        const error = new Error(`Account not found: ${missingAccountId}`);

        error.statusCode = 404;
        error.code = "ACCOUNT_NOT_FOUND";

        throw error;
      }

      const totalDebit = data.items.reduce(
        (total, item) => total + item.debit,
        0,
      );

      const totalCredit = data.items.reduce(
        (total, item) => total + item.credit,
        0,
      );

      if (totalDebit !== totalCredit) {
        const error = new Error(
          "Journal entry must be balanced: total debit must equal total credit",
        );

        error.statusCode = 400;
        error.code = "UNBALANCED_JOURNAL_ENTRY";

        throw error;
      }

      const [journalEntry] = await tx
        .insert(journalEntries)
        .values({
          journalId: data.journalId,
          entryDate: data.entryDate,
          reference: data.reference,
        })
        .returning();

      const items = await tx
        .insert(journalItems)
        .values(
          data.items.map((item) => ({
            journalEntryId: journalEntry.id,
            accountId: item.accountId,
            debit: item.debit,
            credit: item.credit,
          })),
        )
        .returning();

      return {
        ...journalEntry,
        items,
      };
    });
  }

  static async getJournalEntries() {
    const entries = await database.select().from(journalEntries);

    const result = [];

    for (const entry of entries) {
      const items = await database
        .select()
        .from(journalItems)
        .where(eq(journalItems.journalEntryId, entry.id));

      result.push({
        ...entry,
        items,
      });
    }

    return result;
  }

  static async getJournalEntryById(id) {
    const [journalEntry] = await database
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.id, id))
      .limit(1);

    if (!journalEntry) {
      const error = new Error("Journal entry not found");

      error.statusCode = 404;
      error.code = "JOURNAL_ENTRY_NOT_FOUND";

      throw error;
    }

    const items = await database
      .select()
      .from(journalItems)
      .where(eq(journalItems.journalEntryId, id));

    return {
      ...journalEntry,
      items,
    };
  }

  static async updateJournalEntry(id, data) {
    await this.getJournalEntryById(id);

    const updateData = {};

    if (data.entryDate !== undefined) {
      updateData.entryDate = data.entryDate;
    }

    if (data.reference !== undefined) {
      updateData.reference = data.reference;
    }

    if (Object.keys(updateData).length === 0) {
      const error = new Error("No fields provided for update");

      error.statusCode = 400;
      error.code = "NO_UPDATE_FIELDS";

      throw error;
    }

    const [updatedJournalEntry] = await database
      .update(journalEntries)
      .set(updateData)
      .where(eq(journalEntries.id, id))
      .returning();

    const items = await database
      .select()
      .from(journalItems)
      .where(eq(journalItems.journalEntryId, id));

    return {
      ...updatedJournalEntry,
      items,
    };
  }
}
