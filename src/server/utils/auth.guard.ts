/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@clerk/nextjs/server";

type AuthenticatedCallback<T> = (userId: string, ...args: unknown[]) => Promise<T>;

export function withAuth<T>(cb: AuthenticatedCallback<T>) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  return (...rest: Parameters<AuthenticatedCallback<T>>) => cb(user.userId, ...rest);
}
