import { Router } from "express";

import { JournalController } from "./journal.controller.js";

const journalRoute = Router();

journalRoute.post("/", JournalController.createJournal);
journalRoute.get("/", JournalController.getJournals);
journalRoute.get("/:id", JournalController.getJournalById);
journalRoute.patch("/:id", JournalController.updateJournal);
journalRoute.patch("/:id/archive", JournalController.archiveJournal);

export default journalRoute;
