export class InvoiceUtils {
  // TODO: Fix calculation
  static getTotalNetPrice(quantity: number, unitNetPrice: number) {
    return quantity * unitNetPrice;
  }

  static getVatAmount(totalPrice: number, vatRate: number) {
    return totalPrice * vatRate;
  }

  static getGrossPrice(totalNetPrice: number, vatAmount: number) {
    return totalNetPrice + vatAmount;
  }
}
