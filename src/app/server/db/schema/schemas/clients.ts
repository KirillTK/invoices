import { type InferSelectModel } from 'drizzle-orm';
import { createTable } from "../utils/createTable";
import { uuid, varchar } from "drizzle-orm/pg-core";

export const clients = createTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  city: varchar("city", { length: 50 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  zip: varchar("zip", { length: 50 }).notNull(),
  address: varchar("address", { length: 50 }).notNull(),
  taxIndex: varchar("tax_index", { length: 50 }).notNull().unique(),
  userId: varchar("user_id", { length: 256 }).notNull(),
}); 

export type ClientModel = InferSelectModel<typeof clients>;