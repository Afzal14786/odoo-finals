import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

import { CONTACT_TYPE } from "./enums.js";
import { users } from "./users.schema.js";

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),

  name: varchar("name", {
    length: 100,
  }).notNull(),

  type: CONTACT_TYPE("type").notNull(),

  email: varchar("email", {
    length: 255,
  }),

  mobile: varchar("mobile", {
    length: 15,
  }),

  address: text("address"),

  city: varchar("city", {
    length: 100,
  }),

  state: varchar("state", {
    length: 100,
  }),

  pincode: varchar("pincode", {
    length: 10,
  }),

  profileUrl: text("profile_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),

  archivedAt: timestamp("archived_at"),
});

export default contacts;
