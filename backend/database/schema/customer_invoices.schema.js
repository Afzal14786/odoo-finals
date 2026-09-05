import { pgTable, uuid, date, varchar, timestamp } from "drizzle-orm/pg-core";

import { contacts } from "./contacts.schema.js";
import { salesOrders } from "./sales_orders.schema.js";

export const customerInvoices = pgTable("customer_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => contacts.id, {
      onDelete: "restrict",
    }),

  salesOrderId: uuid("sales_order_id")
    .notNull()
    .unique()
    .references(() => salesOrders.id, {
      onDelete: "restrict",
    }),

  invoiceDate: date("invoice_date").notNull(),

  dueDate: date("due_date").notNull(),

  reference: varchar("reference", {
    length: 100,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  archivedAt: timestamp("archived_at"),
});

export default customerInvoices;
