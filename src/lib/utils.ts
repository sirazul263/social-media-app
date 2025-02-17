import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRelativeDate = (from: Date) => {
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - from.getTime();
  if (timeDiff < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() == from.getFullYear()) {
      return formatDate(from, "MMM d");
    } else {
      return formatDate(from, "MMM d, yyyy");
    }
  }
};

export const formatNumber = (n: number): string => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
};

export const slugify = (s: string): string => {
  return s
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-zA-Z0-9]/g, "");
};
