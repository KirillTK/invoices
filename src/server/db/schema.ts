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

export const unitEnum = pgEnum("invoice_unit", ["PER_HOURS"]);

export const user = createTable("users", {
  id: uuid("id"),
  name: varchar("name", { length: 50 }).notNull().unique(),
  city: varchar("city", { length: 50 }).notNull(),
  country: varchar("country", { length: 50 }).notNull(),
  zip: varchar("zip", { length: 50 }).notNull(),
  address: varchar("address", { length: 50 }).notNull(),
  taxIndex: varchar("tax_index", { length: 50 }).notNull().unique(),
});

export const currency = createTable("currencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  symbol: varchar("symbol", { length: 50 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
});

export type CurrencyModel = InferSelectModel<typeof currency>;

export const exchange_rate = createTable("exchange_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  currencyId: uuid("currency_id").references(() => currency.id, { onDelete: "cascade" }).notNull(),
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

export type ClientModel = InferSelectModel<typeof clients>;

export const invoice = createTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNo: varchar("invoice_no", { length: 50 }).notNull().unique(),
  dueDate: date("due_date"),
  invoiceDate: date("invoice_date"),
  vatInvoice: boolean("vat_invoice").default(false),
  // user data
  userId: varchar("user_id", { length: 256 }).notNull(),
  userName: varchar('user_name', { length: 50 }).notNull(),
  userAddress: varchar("user_address", { length: 250 }),
  userNip: varchar("userNip", { length: 50 }),
  // client data
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  clientAddress: varchar("client_address", { length: 250 }),
  clientNip: varchar("client_nip", { length: 50 }),
  exchangeRate: doublePrecision("exchange_rate").default(1),
  currencyId: uuid("currency_id")
    .references(() => currency.id)
    .notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export type InvoiceModel = InferSelectModel<typeof invoice>;

export const invoiceDetails = createTable("invoice_details", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoice: uuid("invoice_id")
    .references(() => invoice.id, { onDelete: "cascade" })
    .notNull(),
  description: varchar("description", { length: 256 }).notNull(),
  unit: unitEnum("unit").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
  quantity: doublePrecision("quantity").notNull(),
  totalNetPrice: doublePrecision('total_net_price').default(0),
  vat: doublePrecision('vat').default(0),
  vatAmount: doublePrecision('vat_amount').default(0),
  totalGrossPrice: doublePrecision('total_gross_price').default(0),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});

export type InvoiceDetailsModel = InferSelectModel<typeof invoiceDetails>;
