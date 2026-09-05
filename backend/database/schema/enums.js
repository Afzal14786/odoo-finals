import { pgEnum } from "drizzle-orm/pg-core";

export const USER_ROLE = pgEnum("userRole", [
  "admin",
  "accountant",
]);

export const CONTACT_TYPE = pgEnum("contact_type", [
    "customer",
    "vendor",
    "both",
]);

export const PRODUCT_TYPES = pgEnum("types", [
    "goods",
    "service",
    "combo",
]);

export const ACCOUNT_TYPE = pgEnum("account_type", [
    "asset",
    "liability",
    "expense",
    "income",
    "capital",
]);

export const JOURNAL_TYPE = pgEnum("journal_type", [
    "sales",
    "purchase",
    "bank",
    "cash",
]);