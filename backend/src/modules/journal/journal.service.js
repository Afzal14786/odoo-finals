import { eq, isNull } from "drizzle-orm";

import { database } from "../../../database/index.js";
import { journals } from "../../../database/schema/index.js";

export class JournalService {
  static async createJournal(data) {
    const [journal] = await database
      .insert(journals)
      .values({
        journalName: data.journalName,
        journalType: data.journalType,
        defaultDebitAccountId: data.defaultDebitAccountId,
        defaultCreditAccountId: data.defaultCreditAccountId,
      })
      .returning();

    return journal;
  }

  static async getJournals() {
    return await database
      .select()
      .from(journals)
      .where(isNull(journals.archivedAt));
  }

  static async getJournalById(id) {
    const [journal] = await database
      .select()
      .from(journals)
      .where(eq(journals.id, id))
      .limit(1);

    if (!journal || journal.archivedAt) {
      const error = new Error("Journal not found");

      error.statusCode = 404;
      error.code = "JOURNAL_NOT_FOUND";

      throw error;
    }

    return journal;
  }

  static async updateJournal(id, data) {
    await this.getJournalById(id);

    const updateData = {};

    if (data.journalName !== undefined) {
      updateData.journalName = data.journalName;
    }

    if (data.journalType !== undefined) {
      updateData.journalType = data.journalType;
    }

    if (data.defaultDebitAccountId !== undefined) {
      updateData.defaultDebitAccountId = data.defaultDebitAccountId;
    }

    if (data.defaultCreditAccountId !== undefined) {
      updateData.defaultCreditAccountId = data.defaultCreditAccountId;
    }

    if (Object.keys(updateData).length === 0) {
      const error = new Error("No fields provided for update");

      error.statusCode = 400;
      error.code = "NO_UPDATE_FIELDS";

      throw error;
    }

    const [updatedJournal] = await database
      .update(journals)
      .set(updateData)
      .where(eq(journals.id, id))
      .returning();

    return updatedJournal;
  }

  static async archiveJournal(id) {
    await this.getJournalById(id);

    const [archivedJournal] = await database
      .update(journals)
      .set({
        archivedAt: new Date(),
      })
      .where(eq(journals.id, id))
      .returning();

    return archivedJournal;
  }
}
