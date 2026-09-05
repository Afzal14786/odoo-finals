
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { CONTACTS_TYPES } from "./enums.js";

export const contacts = pgTable("contacts", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", {length: 30}).notNull(),
    type: CONTACTS_TYPES("types").default("customer"),
    email: varchar("email", {length: 30}).unique().notNull(),
    mobile: varchar("mobile", {length: 12}).unique().notNull(),
    address: varchar("address", {length: 200}),
    profileUrl: text("profile_url").default(""),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").notNull().$onUpdate(()=> new Date()),
    archieveAt: timestamp("archieveAt")
});

export default contacts;