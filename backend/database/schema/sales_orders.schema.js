import { pgTable, uuid, date, varchar, timestamp } from "drizzle-orm/pg-core";

import { contacts } from "./contacts.schema.js";

export const salesOrders = pgTable("sales_orders", {
  id: uuid("id").primaryKey().defaultRandom(),

  customerId: uuid("customer_id")
    .notNull()
    .references(() => contacts.id, {
      onDelete: "restrict",
    }),

  orderDate: date("order_date").notNull(),

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

export default salesOrders;
