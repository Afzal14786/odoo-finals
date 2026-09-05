import { pgTable, uuid, date, varchar, timestamp } from "drizzle-orm/pg-core";

import { contacts } from "./contacts.schema.js";
import { purchaseOrders } from "./purchase_orders.schema.js";

export const vendorBills = pgTable("vendor_bills", {
  id: uuid("id").primaryKey().defaultRandom(),

  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => contacts.id, {
      onDelete: "restrict",
    }),

  purchaseOrderId: uuid("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id, {
      onDelete: "restrict",
    }),

  billDate: date("bill_date").notNull(),

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

export default vendorBills;
