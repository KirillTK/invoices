export interface ValidationHttpError {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
}
