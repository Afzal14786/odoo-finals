import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

import { PRODUCT_TYPES } from "./enums.js";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", {
    length: 100,
  }).notNull(),

  type: PRODUCT_TYPES("type").notNull(),

  salesPrice: integer("sales_price").notNull(),

  purchasePrice: integer("purchase_price").notNull(),

  category: varchar("category", {
    length: 100,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  archivedAt: timestamp("archived_at"),
});

export default products;
