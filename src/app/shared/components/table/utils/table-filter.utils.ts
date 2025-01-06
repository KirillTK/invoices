import { rankItem } from '@tanstack/match-sorter-utils';
import { type FilterMeta, type Row } from '@tanstack/react-table';

export class TableFilterUtils {
  static globalSearch<TData>(row: Row<TData>, columnId: string, value: unknown, addMeta: (meta: FilterMeta) => void): boolean {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value as string);
  
    // Store the itemRank info
    addMeta({
      itemRank,
    })
  
    // Return if the item should be filtered in/out
    return itemRank.passed;
  }
}
