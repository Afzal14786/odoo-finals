import { integer, pgTable, text, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import {PRODUCT_TYPES} from "./enums.js";

export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", {length: 50}).notNull(),
    type: PRODUCT_TYPES("types"),
    salesprice: integer("salesPrice").notNull(),  // must be > 0
    purchasePrice: integer("purchasePrice").notNull(),  // must be > 0
    category : text("category").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").notNull().$onUpdate(()=> new Date()),
});

export default products;