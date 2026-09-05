import {
  createJournalEntrySchema,
  updateJournalEntrySchema,
  journalEntryIdSchema,
} from "./journalEntry.validation.js";

import { JournalEntryService } from "./journalEntry.service.js";

export class JournalEntryController {
  static async createJournalEntry(req, res, next) {
    try {
      const validatedData = createJournalEntrySchema.parse(req.body);

      const journalEntry =
        await JournalEntryService.createJournalEntry(validatedData);

      return res.status(201).json({
        success: true,
        message: "Journal entry created successfully",
        data: {
          journalEntry,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getJournalEntries(req, res, next) {
    try {
      const journalEntries = await JournalEntryService.getJournalEntries();

      return res.status(200).json({
        success: true,
        message: "Journal entries retrieved successfully",
        data: {
          journalEntries,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getJournalEntryById(req, res, next) {
    try {
      const { id } = journalEntryIdSchema.parse(req.params);

      const journalEntry = await JournalEntryService.getJournalEntryById(id);

      return res.status(200).json({
        success: true,
        message: "Journal entry retrieved successfully",
        data: {
          journalEntry,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateJournalEntry(req, res, next) {
    try {
      const { id } = journalEntryIdSchema.parse(req.params);

      const validatedData = updateJournalEntrySchema.parse(req.body);

      const journalEntry = await JournalEntryService.updateJournalEntry(
        id,
        validatedData,
      );

      return res.status(200).json({
        success: true,
        message: "Journal entry updated successfully",
        data: {
          journalEntry,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
