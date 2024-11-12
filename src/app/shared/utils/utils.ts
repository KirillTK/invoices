import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isFalsyValueButNotZero(value: unknown): boolean {
  return value !== null || value !== undefined || value !== "";
}
