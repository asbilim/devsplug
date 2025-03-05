import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string using date-fns
 * @param dateString - The date string to format
 * @param formatStr - The format string (optional)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, formatStr: string = "PPP") {
  const date = new Date(dateString);
  return format(date, formatStr);
}

/**
 * Format a date as a relative time (e.g., "2 days ago")
 * @param dateString - The date string
 * @returns Relative time as string
 */
export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}
