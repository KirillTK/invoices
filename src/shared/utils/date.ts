import { format } from "date-fns";

export class DateUtils {
  static formatDate(date: string | Date, formatPattern = 'dd MMMM yyyy'): string {
    return format(date, formatPattern);
  }
}
