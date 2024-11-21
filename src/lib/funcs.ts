import type { getAdvisorById } from '@/lib/queries';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAdvisorName = (advisor: Awaited<ReturnType<typeof getAdvisorById>>) =>
  advisor.profiles ? `${advisor.profiles.first_name} ${advisor.profiles.last_name}` : 'Advisor';
