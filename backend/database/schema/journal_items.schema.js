import { pgTable, uuid, integer } from "drizzle-orm/pg-core";

import { journalEntries } from "./journal_entries.schema.js";
import { chartOfAccounts } from "./chart_of_accounts.schema.js";

export const journalItems = pgTable("journal_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  journalEntryId: uuid("journal_entry_id")
    .notNull()
    .references(() => journalEntries.id, {
      onDelete: "cascade",
    }),

  accountId: uuid("account_id")
    .notNull()
    .references(() => chartOfAccounts.id, {
      onDelete: "restrict",
    }),

  debit: integer("debit").notNull().default(0),

  credit: integer("credit").notNull().default(0),
});

export default journalItems;
