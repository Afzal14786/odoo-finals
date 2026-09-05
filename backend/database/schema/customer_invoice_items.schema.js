import { pgTable, uuid, integer } from "drizzle-orm/pg-core";

import { customerInvoices } from "./customer_invoices.schema.js";

import { products } from "./products.schema.js";

export const customerInvoiceItems = pgTable("customer_invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  customerInvoiceId: uuid("customer_invoice_id")
    .notNull()
    .references(() => customerInvoices.id, {
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

export default customerInvoiceItems;
