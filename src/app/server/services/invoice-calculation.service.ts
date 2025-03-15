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
}
