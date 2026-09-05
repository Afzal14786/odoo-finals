import { pgTable, uuid, date, varchar, timestamp } from "drizzle-orm/pg-core";

import { journals } from "./journals.schema.js";

export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),

  journalId: uuid("journal_id")
    .notNull()
    .references(() => journals.id, {
      onDelete: "restrict",
    }),

  entryDate: date("entry_date").notNull(),

  reference: varchar("reference", {
    length: 100,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default journalEntries;
