import {
  pgTable,
  uuid,
  date,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { PAYMENT_METHOD } from "./enums.js";
import { vendorBills } from "./vendor_bills.schema.js";
import { journalEntries } from "./journal_entries.schema.js";

export const purchasePayments = pgTable("purchase_payments", {
  id: uuid("id").primaryKey().defaultRandom(),

  vendorBillId: uuid("vendor_bill_id")
    .notNull()
    .references(() => vendorBills.id, {
      onDelete: "restrict",
    }),

  paymentDate: date("payment_date").notNull(),

  paymentMethod: PAYMENT_METHOD("payment_method").notNull(),

  amount: integer("amount").notNull(),

  reference: varchar("reference", {
    length: 100,
  }).notNull(),

  journalEntryId: uuid("journal_entry_id")
    .notNull()
    .references(() => journalEntries.id, {
      onDelete: "restrict",
    }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export default purchasePayments;
