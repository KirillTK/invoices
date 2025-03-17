import { relations } from "drizzle-orm";
import { invoiceDetails } from "./schemas/invoiceDetails";
import { unitTypes, unitTypeCategories } from "./schemas/unitType";
import { invoice } from "./schemas/invoices";
import { users } from "./schemas/users";

export const invoiceDetailsRelations = relations(invoiceDetails, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceDetails.invoiceId],
    references: [invoice.id],
    relationName: 'invoiceDetails',
  }),
  unit: one(unitTypes, {
    fields: [invoiceDetails.unitId],
    references: [unitTypes.id],
    relationName: 'unitType',
  }),
}));

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
  details: many(invoiceDetails, {
    relationName: 'invoiceDetails',
  }),
  user: one(users, {
    fields: [invoice.userId],
    references: [users.id],
    relationName: 'userInvoices',
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

export const userRelations = relations(users, ({ many }) => ({
  invoices: many(invoice, {
    relationName: 'userInvoices',
  }),
}));
