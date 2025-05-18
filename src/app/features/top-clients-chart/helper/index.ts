import { type InvoiceModelWithClientAndDetails } from '~/entities/invoice/model/invoice.model';

export const getCountInvoicesByClient = (invoices: InvoiceModelWithClientAndDetails[]): Record<string, number> => {
  return invoices.reduce((acc, invoice) => {
    const clientName = invoice.client?.name || 'Unknown Client';
    
    if (!acc[clientName]) {
      acc[clientName] = 0;
    }
    acc[clientName] += 1;
    return acc;
  }, {} as Record<string, number>);
};