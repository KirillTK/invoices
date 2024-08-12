// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import {
  pgTableCreator,
  uuid,
  timestamp,
  varchar,
  doublePrecision,
  pgEnum,
  boolean,
  date,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `factura_${name}`);

export const unitEnum = pgEnum("invoice_unit", ["per/hours"]);

export const user = createTable("users", {
  id: uuid("id"),
  name: varchar("name", { length: 50 }).notNull().unique(),
  city: varchar("city", { length: 50 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  zip: varchar("zip", { length: 50 }).notNull(),
  address: varchar("address", { length: 50 }).notNull(),
  taxIndex: varchar("tax_index", { length: 50 }).notNull().unique(),
});


export const exchange_rate = createTable("exchange_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  currencyName: varchar("currency_name", { length: 256 }).notNull(),
  value: doublePrecision("value").default(0.01),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});


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

export type ClientModel = InferSelectModel<typeof clients>



export const invoice = createTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  client: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  // exchangeRate: uuid("exchange_rate_id").references(() => exchange_rate.id),
  title: varchar("title", { length: 50 }).notNull().unique(),
  description: varchar("description", { length: 256 }).notNull(),
  // unit: unitEnum("unit").notNull(),
  // unitPrice: doublePrecision("unit_price").notNull(),
  // quantity: doublePrecision("quantity").notNull(),
  vatInvoice: boolean("vat_invoice").notNull(),
  dueDate: date("due_date"),
  realizationDate: date("realization_date"),
  dateOfIssue: date("date_of_issue"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});


export const invoiceDetails = createTable("invoice_details", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoice: uuid("invoice_id")
    .references(() => invoice.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("description", { length: 256 }).notNull(),
  unit: unitEnum("unit").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  quantity: doublePrecision("quantity").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});
