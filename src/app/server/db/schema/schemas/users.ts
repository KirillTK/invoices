import { createTable } from "../utils/createTable";
import { varchar, json } from "drizzle-orm/pg-core";
import { type InferSelectModel } from 'drizzle-orm';

export const users = createTable("users", {
  id: varchar("id", { length: 256 }).primaryKey(), // Clerk user id
  email: varchar("email", { length: 256 }).unique(),
  name: varchar("name", { length: 256 }),
  city: varchar("city", { length: 50 }),
  country: varchar("country", { length: 50 }),
  zip: varchar("zip", { length: 50 }),
  address: varchar("address", { length: 256 }),
  taxIndex: varchar("tax_index", { length: 50 }),
  bankAccount: varchar("bank_account", { length: 50 }),
  metadata: json("metadata").default({})
});

export type UserModel = InferSelectModel<typeof users>; 