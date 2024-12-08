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

export function isCommonHttpError(error: unknown): error is Error {
  return error instanceof Object && 'message' in error;
}

export function getFormErrorArray<T>(errors: ValidationHttpError[]) {
  return errors.map((error) => ({
    type: "manual",
    name: error.path.join('.') as keyof T,
    message: error.message,
  }));
}


export const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))