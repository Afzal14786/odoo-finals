import { Router } from "express";

import { JournalEntryController } from "./journalEntry.controller.js";

const journalEntryRoute = Router();

journalEntryRoute.post("/", JournalEntryController.createJournalEntry);
journalEntryRoute.get("/", JournalEntryController.getJournalEntries);
journalEntryRoute.get("/:id", JournalEntryController.getJournalEntryById);
journalEntryRoute.patch("/:id", JournalEntryController.updateJournalEntry);

export default journalEntryRoute;
