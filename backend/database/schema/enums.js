import { pgEnum } from "drizzle-orm/pg-core";

export const USER_ROLE = pgEnum("userRole", [
  "admin",
  "accountant",
]);

export const CONTACTS_TYPES = pgEnum("contacts", [
  "customer",
  "vendor",
  "both",
]);

export const PRODUCT_TYPES = pgEnum("types", [
  "goods",
  "services",
  "combo",
]);