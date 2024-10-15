import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function onSameDay(a: Date, b: Date) {
  const msInDay = 86400000;
  return Math.floor(a.getTime() / msInDay) === Math.floor(b.getTime() / msInDay);
}
