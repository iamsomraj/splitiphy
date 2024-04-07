import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num: number | string): number => {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  return Math.round(num * 100) / 100;
};
