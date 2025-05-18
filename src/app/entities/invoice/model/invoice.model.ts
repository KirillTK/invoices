import type { ClientModel, InvoiceDetailsModel as Details, InvoiceModel as Invoice } from '~/server/db/schema';

export type InvoiceModel = Invoice & {
  details: Details[];
};

export type InvoiceListModel = Pick<Invoice, 'id' | 'invoiceNo' | 'dueDate' | 'createdAt'> & { totalNetPrice: number; clientName: string };

export type InvoiceModelWithClientAndDetails = InvoiceModel & { client: ClientModel };