import {
  pgTable,
  uuid,
  varchar,
  date,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { chartOfAccounts } from "./chart_of_accounts.schema.js";
import { analyticAccounts } from "./analytic_accounts.schema.js";

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", {
    length: 100,
  }).notNull(),

  accountId: uuid("account_id")
    .notNull()
    .references(() => chartOfAccounts.id, {
      onDelete: "restrict",
    }),

  analyticAccountId: uuid("analytic_account_id")
    .notNull()
    .references(() => analyticAccounts.id, {
      onDelete: "restrict",
    }),

  startDate: date("start_date").notNull(),

  endDate: date("end_date").notNull(),

  plannedAmount: integer("planned_amount").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  archivedAt: timestamp("archived_at"),
});

export default budgets;
