import { createTable } from "../utils/createTable";
import { uuid, varchar, date, boolean, timestamp } from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { users } from "./users";
import { type InferSelectModel, sql } from 'drizzle-orm';

export const invoice = createTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNo: varchar("invoice_no", { length: 50 }).notNull().unique(),
  dueDate: date("due_date"),
  invoiceDate: date("invoice_date"),
  vatInvoice: boolean("vat_invoice").default(false),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userName: varchar('user_name', { length: 50 }).notNull(),
  userAddress: varchar("user_address", { length: 250 }),
  userNip: varchar("userNip", { length: 50 }),
  bankAccount: varchar("bank_account", { length: 50 }),
  paymentDate: date("payment_date"),
  clientId: uuid("client_id")
    .references(() => clients.id, { onDelete: "cascade" })
    .notNull(),
  clientAddress: varchar("client_address", { length: 250 }),
  clientNip: varchar("client_nip", { length: 50 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
}); 

export type InvoiceModel = InferSelectModel<typeof invoice>;
