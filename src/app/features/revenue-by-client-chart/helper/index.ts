import { type InvoiceModelWithClientAndDetails } from '~/entities/invoice/model/invoice.model';

export const groupRevenueByClient = (invoices: InvoiceModelWithClientAndDetails[]): Record<string, number> => {
  return invoices.reduce((acc, invoice) => {
    const clientName = invoice.client?.name || 'Unknown Client';
    const invoiceRevenue = invoice.details?.reduce((sum, detail) => 
      sum + (detail.totalGrossPrice ?? 0), 0) ?? 0;
    
    if (!acc[clientName]) {
      acc[clientName] = 0;
    }
    acc[clientName] += invoiceRevenue;
    return acc;
  }, {} as Record<string, number>);
};
