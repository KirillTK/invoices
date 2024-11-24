import { relations } from "drizzle-orm";
import { invoiceDetails } from "./schemas/invoiceDetails";
import { unitTypes, unitTypeCategories } from "./schemas/unitType";
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

export const unitTypeRelations = relations(unitTypes, ({ one }) => ({
  category: one(unitTypeCategories, {
    fields: [unitTypes.typeId],
    references: [unitTypeCategories.id],
    relationName: 'unitTypeCategory',
  }),
}));

export const unitTypeCategoryRelations = relations(unitTypeCategories, ({ many }) => ({
  unitTypes: many(unitTypes, {
    relationName: 'unitTypeCategory',
  }),
}));
