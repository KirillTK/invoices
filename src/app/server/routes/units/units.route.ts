import { db } from '~/server/db';
import { cache } from '~/server/decorators/cache.decorator';
import { CacheTags } from '~/server/enums/cache';

export class UnitsService {
  @cache(CacheTags.UNITS, true)
  static getUnits() {
    return db.query.unitTypes.findMany({
      with: {
        category: true,
      },
    });
  }
}
