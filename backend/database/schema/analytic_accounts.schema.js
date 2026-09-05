import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

import { ANALYTIC_ACCOUNT_TYPE } from "./enums.js";

export const analyticAccounts = pgTable("analytic_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", {
    length: 100,
  }).notNull(),

  type: ANALYTIC_ACCOUNT_TYPE("type").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  archivedAt: timestamp("archived_at"),
});

export default analyticAccounts;
