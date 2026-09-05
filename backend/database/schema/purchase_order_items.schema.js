import { pgTable, uuid, integer } from "drizzle-orm/pg-core";

import { purchaseOrders } from "./purchase_orders.schema.js";

import { products } from "./products.schema.js";

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  purchaseOrderId: uuid("purchase_order_id")
    .notNull()
    .references(() => purchaseOrders.id, {
      onDelete: "cascade",
    }),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "restrict",
    }),

  quantity: integer("quantity").notNull(),

  unitPrice: integer("unit_price").notNull(),

  total: integer("total").notNull(),
});

export default purchaseOrderItems;
