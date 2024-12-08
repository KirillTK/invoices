import { db } from '~/server/db';

export class UnitsService {
  static async getUnits() {
    return db.query.unitTypes.findMany({
      with: {
        category: true,
      },
    });
  }
}
