import constants from '@/lib/constants';
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

/** Symbol for a currency code (e.g. INR → ₹), falling back to the code itself. */
export const currencySymbolFor = (code?: string | null): string => {
  if (!code) {
    return '';
  }
  return (
    (constants.currenciesCodeSymbolMap as Record<string, string>)[code] ?? code
  );
};
