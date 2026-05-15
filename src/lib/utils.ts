import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatShortDuration(duration: string): string {
  const match = duration.match(/\((.*?)\)/);
  return match ? match[1] : duration;
}

export function formatShortLocation(location: string): string {
  const parts = location.split(",");
  return parts.length > 1 ? parts[parts.length - 1].trim() : location;
}
