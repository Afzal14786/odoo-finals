import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import { ACCOUNT_TYPE } from "./enums.js";

export const chartOfAccounts = pgTable("chart_of_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),

  accountName: varchar("account_name", {
    length: 100,
  }).notNull(),

  accountType: ACCOUNT_TYPE("account_type").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  archivedAt: timestamp("archived_at"),
});

export default chartOfAccounts;
