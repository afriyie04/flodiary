import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}
