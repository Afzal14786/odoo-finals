import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

import { users } from "./users.schema.js";

export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  tokenHash: text("token_hash").notNull().unique(),

  expiresAt: timestamp("expires_at").notNull(),

  revokedAt: timestamp("revoked_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  lastUsedAt: timestamp("last_used_at"),

  userAgent: text("user_agent"),

  ipAddress: text("ip_address"),
});

export default authSessions;
