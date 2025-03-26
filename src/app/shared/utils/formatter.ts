import { CURRENCY } from "../constants/currency.const";
import { LONG_DASH } from "../constants/symbols.const";

export class FormatterUtils {
  static fromNumberToMoney(val: number, currency = CURRENCY.USD): string {
    if (!val) {
      return LONG_DASH;
    }

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    });

    return formatter.format(val);
  }

  static formatNumber(val: number) {
    if (!val) {
      return 0;
    }

    return Number(val.toFixed(2));
  }

  static formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
}
