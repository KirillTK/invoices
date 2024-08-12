import type { ValidationHttpError } from "../types/http";

export function isHttpValidationError(
  error: unknown,
): error is { errors: ValidationHttpError[] } {

  if(error instanceof Object && 'errors' in error) {
    return true;
  }

  if (error instanceof Array && error.length > 0 && "path" in error[0]) {
    return true;
  }

  return false;
}

export function getFormErrorArray<T>(errors: ValidationHttpError[]) {
  return errors.map((error) => ({
    type: "manual",
    name: error.path[0] as keyof T,
    message: error.message,
  }));
}
