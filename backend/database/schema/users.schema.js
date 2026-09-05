import {
    pgTable,
    uuid,
    text,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id")
        .primaryKey()
        .defaultRandom(),

    name: varchar("name", {
        length: 30,
    }).notNull(),

    email: text("email")
        .notNull()
        .unique(),

    mobile: text("mobile")
        .notNull()
        .unique(),

    address: text("address")
        .notNull(),

    passwordHash: text("password_hash")
        .notNull(),

    profileUrl: text("profile_url")
        .default(null),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});

export default users;