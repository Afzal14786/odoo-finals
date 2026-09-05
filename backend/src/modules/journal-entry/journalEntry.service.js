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
      /*
       * 1. Verify journal exists
       *    and is not archived.
       */
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

      /*
       * 2. Verify all accounts exist
       *    and are not archived.
       */
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

      /*
       * 3. Create journal entry header.
       */
      const [journalEntry] = await tx
        .insert(journalEntries)
        .values({
          journalId: data.journalId,
          entryDate: data.entryDate,
          reference: data.reference,
        })
        .returning();

      /*
       * 4. Create journal items.
       */
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

      /*
       * 5. Return complete journal entry.
       */
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
