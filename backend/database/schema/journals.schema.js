import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import { JOURNAL_TYPE } from "./enums.js";
import { chartOfAccounts } from "./chart_of_accounts.schema.js";

export const journals = pgTable("journals", {
  id: uuid("id").primaryKey().defaultRandom(),

  journalName: varchar("journal_name", {
    length: 100,
  }).notNull(),

  journalType: JOURNAL_TYPE("journal_type").notNull(),

  defaultDebitAccountId: uuid("default_debit_account_id")
    .notNull()
    .references(() => chartOfAccounts.id, {
      onDelete: "restrict",
    }),

  defaultCreditAccountId: uuid("default_credit_account_id")
    .notNull()
    .references(() => chartOfAccounts.id, {
      onDelete: "restrict",
    }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  archivedAt: timestamp("archived_at"),
});

export default journals;
