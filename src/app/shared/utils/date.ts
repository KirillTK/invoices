import { format } from "date-fns";

export class DateUtils {
  static formatDate(date: string | Date, formatPattern = 'dd MMMM yyyy'): string {
    return format(date, formatPattern);
  }

  /**
   * Compares two dates using date-fns
   * @param date1 First date to compare
   * @param date2 Second date to compare
   * @returns -1 if date1 is before date2, 0 if dates are equal, 1 if date1 is after date2
   */
  static compareDates(date1: string | Date, date2: string | Date): number {
    const parsedDate1 = date1 instanceof Date ? date1 : new Date(date1);
    const parsedDate2 = date2 instanceof Date ? date2 : new Date(date2);
    
    if (parsedDate1 < parsedDate2) return -1;
    if (parsedDate1 > parsedDate2) return 1;
    return 0;
  }
}
