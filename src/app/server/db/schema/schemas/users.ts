import { createTable } from "../utils/createTable";
import { uuid, varchar } from "drizzle-orm/pg-core";

export const user = createTable("users", {
  id: uuid("id"),
  name: varchar("name", { length: 50 }).notNull().unique(),
  city: varchar("city", { length: 50 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  zip: varchar("zip", { length: 50 }).notNull(),
  address: varchar("address", { length: 50 }).notNull(),
  taxIndex: varchar("tax_index", { length: 50 }).notNull().unique(),
}); 