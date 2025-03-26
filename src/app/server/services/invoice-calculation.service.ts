import { type InvoiceDetailsModel } from '../db/schema';

export class InvoiceCalculationService {
  static getTotalNetPrice(details: InvoiceDetailsModel[]) {
    return details.reduce((sum, detail) => sum + (detail.totalNetPrice ?? 0), 0);
  }

  static getTotalVatAmount(details: InvoiceDetailsModel[]) {
    return details.reduce((sum, detail) => sum + (detail.vatAmount ?? 0), 0);
  }

  static getTotalGrossPrice(details: InvoiceDetailsModel[]) {
    return details.reduce((sum, detail) => sum + (detail.totalGrossPrice ?? 0), 0);
  }

  static calculateInvoiceTotal(details: InvoiceDetailsModel[]) {
    return details.reduce((sum, detail) => 
      sum + (detail.totalGrossPrice ?? 0), 0);
  }

  static calculateTotalsByInvoices(invoices: { details: InvoiceDetailsModel[] }[]) {
    return invoices.reduce((sum, invoice) => 
      sum + this.calculateInvoiceTotal(invoice.details), 0);
  }

  static calculateAverageInvoiceValue(invoices: { details: InvoiceDetailsModel[] }[]) {
    if (invoices.length === 0) return 0;
    
    const totalValue = this.calculateTotalsByInvoices(invoices);
    return totalValue / invoices.length;
  }

  static calculateOutstandingAmount(invoices: { details: InvoiceDetailsModel[], paymentDate: string | null }[]) {
    return invoices
      .filter(invoice => !invoice.paymentDate)
      .reduce((sum, invoice) => 
        sum + this.calculateInvoiceTotal(invoice.details), 0);
  }
}
