import { CURRENCY } from "../constants/currency.const";
import { LONG_DASH } from "../constants/symbols.const";

export class MoneyUtils {
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
}
