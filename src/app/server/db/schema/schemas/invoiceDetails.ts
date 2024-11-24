import { createTable } from "../utils/createTable";
import { uuid, varchar, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { unitEnum } from "../enums";
import { invoice } from "./invoices";
import { type InferSelectModel, sql } from 'drizzle-orm';

export const invoiceDetails = createTable("invoice_details", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
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
