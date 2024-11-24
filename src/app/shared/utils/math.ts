export class MathUtils {
  static toPercentageWithTwoDecimals(val: number): number {
    return Math.round(val * 100 * 100) / 100;
  }

  static divide(numerator: number, denominator: number): number {
    if (denominator === 0) {
      console.warn('Attempted to divide by zero. Returning 0 as a fallback.');
      return 0;
    }
    return numerator / denominator;
  }

  static add(a: number, b: number): number {
    return a + b;
  }

  static subtract(a: number, b: number): number {
    return a - b;
  }

  static multiply(a: number, b: number): number {
    return a * b;
  }
}
