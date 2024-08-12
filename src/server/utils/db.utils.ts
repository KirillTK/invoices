import type { PostgresError } from "postgres";

export function isPostgresError(error: unknown): error is PostgresError {
  return typeof error === "object" && error !== null && "detail" in error;
}
