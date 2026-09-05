import { pgTable, uuid, integer } from "drizzle-orm/pg-core";

import { salesOrders } from "./sales_orders.schema.js";

import { products } from "./products.schema.js";

export const salesOrderItems = pgTable("sales_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  salesOrderId: uuid("sales_order_id")
    .notNull()
    .references(() => salesOrders.id, {
      onDelete: "cascade",
    }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "restrict",
    }),

  quantity: integer("quantity").notNull(),

  unitPrice: integer("unit_price").notNull(),

  tax: integer("tax").notNull().default(0),

  total: integer("total").notNull(),
});

export default salesOrderItems;
