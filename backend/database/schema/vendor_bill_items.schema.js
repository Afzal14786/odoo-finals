import { pgTable, uuid, integer } from "drizzle-orm/pg-core";

import { vendorBills } from "./vendor_bills.schema.js";
import { products } from "./products.schema.js";

export const vendorBillItems = pgTable("vendor_bill_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  vendorBillId: uuid("vendor_bill_id")
    .notNull()
    .references(() => vendorBills.id, {
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

export default vendorBillItems;
