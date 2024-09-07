import type { InvoiceDetailsModel as Details, InvoiceModel as Invoice } from '~/server/db/schema';

export type InvoiceModel = {
  invoice: Invoice;
  details: Details[];
};
