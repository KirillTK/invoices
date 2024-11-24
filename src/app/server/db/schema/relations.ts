import { relations } from "drizzle-orm";
import { invoiceDetails } from "./schemas/invoiceDetails";
import { invoice } from "./schemas/invoices";

export const invoiceDetailsRelations = relations(invoiceDetails, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceDetails.invoiceId],
    references: [invoice.id],
    relationName: 'invoiceDetails',
  }),
}));

export const invoiceRelations = relations(invoice, ({ many }) => ({
  details: many(invoiceDetails, {
    relationName: 'invoiceDetails',
  }),
})); 