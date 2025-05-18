import { type InvoiceModel } from '~/entities/invoice/model/invoice.model';
import { DateUtils } from '~/shared/utils/date';
import { FormatterUtils } from '~/shared/utils/formatter';

export const groupInvoicesByMonth = (invoices: InvoiceModel[]): Record<string, number> => {
  return invoices
    .sort((a, b) => DateUtils.compareDates(a.dueDate ?? '', b.dueDate ?? ''))
    .reduce((acc, invoice) => {
      if (!invoice.dueDate) return acc;
      
      const monthKey = FormatterUtils.formatDate(invoice.dueDate);
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += 1;
      return acc;
    }, {} as Record<string, number>);
};
