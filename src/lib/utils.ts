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

/** Money with grouping and two decimals, e.g. ₹1,240.00 */
export const formatMoney = (symbol: string, value: number | string): string =>
  `${symbol}${formatNumber(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

type NamedUser = { id: string; firstName: string; lastName: string };

/** "Aisha K.", or "You" for the signed-in user. */
export const shortName = (person: NamedUser, viewerId?: string): string => {
  if (viewerId && person.id === viewerId) {
    return 'You';
  }
  const initial = person.lastName.charAt(0).toUpperCase();
  return initial ? `${person.firstName} ${initial}.` : person.firstName;
};

export const initials = (person: NamedUser): string =>
  `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
