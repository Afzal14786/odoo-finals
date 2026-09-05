import {
  createJournalSchema,
  updateJournalSchema,
  journalIdSchema,
} from "./journal.validation.js";

import { JournalService } from "./journal.service.js";

export class JournalController {
  static async createJournal(req, res, next) {
    try {
      const validatedData = createJournalSchema.parse(req.body);

      const journal = await JournalService.createJournal(validatedData);

      return res.status(201).json({
        success: true,
        message: "Journal created successfully",
        data: {
          journal,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getJournals(req, res, next) {
    try {
      const journals = await JournalService.getJournals();

      return res.status(200).json({
        success: true,
        message: "Journals retrieved successfully",
        data: {
          journals,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getJournalById(req, res, next) {
    try {
      const { id } = journalIdSchema.parse(req.params);

      const journal = await JournalService.getJournalById(id);

      return res.status(200).json({
        success: true,
        message: "Journal retrieved successfully",
        data: {
          journal,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateJournal(req, res, next) {
    try {
      const { id } = journalIdSchema.parse(req.params);

      const validatedData = updateJournalSchema.parse(req.body);

      const journal = await JournalService.updateJournal(id, validatedData);

      return res.status(200).json({
        success: true,
        message: "Journal updated successfully",
        data: {
          journal,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async archiveJournal(req, res, next) {
    try {
      const { id } = journalIdSchema.parse(req.params);

      const journal = await JournalService.archiveJournal(id);

      return res.status(200).json({
        success: true,
        message: "Journal archived successfully",
        data: {
          journal,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
