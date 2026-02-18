import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safelyGet<T>(callback: () => T): T | undefined {
  try {
    return callback();
  } catch {
    return undefined;
  }
}

export async function safelyGetAsync<T>(
  callback: () => Promise<T>,
): Promise<T | undefined> {
  try {
    return await callback();
  } catch {
    return undefined;
  }
}
