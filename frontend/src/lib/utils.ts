import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600); // 1 hour = 3600 seconds
  const minutes = Math.floor((seconds % 3600) / 60); // Remaining seconds converted to minutes
  const remainingSeconds = seconds % 60; // Remaining seconds

  if (hours > 0 && minutes > 0) {
    return `${hours} hora${hours !== 1 ? 's' : ''} e ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} horas${hours !== 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${remainingSeconds} segundo${remainingSeconds !== 1 ? 's' : ''}`;
  }
}