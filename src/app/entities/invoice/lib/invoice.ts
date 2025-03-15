export class InvoiceUtils {
  // TODO: Fix calculation
  static getTotalGrossPrice(quantity: number, unitNetPrice: number) {
    return quantity * unitNetPrice;
  }

  static getVatAmount(totalPrice: number, vatRate: number) {
    return totalPrice * vatRate;
  }

  static getTotalNetPrice(totalGrossPrice: number, vatAmount: number) {
    return totalGrossPrice + vatAmount;
  }
}
