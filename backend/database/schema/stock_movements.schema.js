import {
  pgTable,
  uuid,
  date,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

import { products } from "./products.schema.js";
import { STOCK_MOVEMENT_TYPE } from "./enums.js";

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").primaryKey().defaultRandom(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "restrict",
    }),

  movementType: STOCK_MOVEMENT_TYPE("movement_type").notNull(),

  quantity: integer("quantity").notNull(),

  referenceType: varchar("reference_type", {
    length: 50,
  }).notNull(),

  referenceId: uuid("reference_id"),

  movementDate: date("movement_date").notNull(),

  reference: varchar("reference", {
    length: 100,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export default stockMovements;
