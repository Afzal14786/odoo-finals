import {
  pgTable,
  uuid,
  date,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { PAYMENT_METHOD } from "./enums.js";

import { customerInvoices } from "./customer_invoices.schema.js";

import { journalEntries } from "./journal_entries.schema.js";

export const customerPayments = pgTable("customer_payments", {
  id: uuid("id").primaryKey().defaultRandom(),

  customerInvoiceId: uuid("customer_invoice_id")
    .notNull()
    .references(() => customerInvoices.id, {
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

export default customerPayments;
