import { db } from '~/server/db';
import { currency } from '~/server/db/schema';

export class CurrencyService {
  static async getCurrencies() {
    return db.select().from(currency);
  }
}
