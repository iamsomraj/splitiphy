const currencies = [
  { code: 'USD', symbol: '$' }, // United States Dollar
  { code: 'EUR', symbol: '€' }, // Euro
  { code: 'GBP', symbol: '£' }, // British Pound Sterling
  { code: 'JPY', symbol: '¥' }, // Japanese Yen
  { code: 'AUD', symbol: 'A$' }, // Australian Dollar
  { code: 'CAD', symbol: 'C$' }, // Canadian Dollar
  { code: 'CHF', symbol: 'CHF' }, // Swiss Franc
  { code: 'CNY', symbol: '¥' }, // Chinese Yuan
  { code: 'INR', symbol: '₹' }, // Indian Rupee
  { code: 'SGD', symbol: 'S$' }, // Singapore Dollar
  { code: 'NZD', symbol: 'NZ$' }, // New Zealand Dollar
  { code: 'HKD', symbol: 'HK$' }, // Hong Kong Dollar
  { code: 'SEK', symbol: 'kr' }, // Swedish Krona
  { code: 'KRW', symbol: '₩' }, // South Korean Won
  { code: 'NOK', symbol: 'kr' }, // Norwegian Krone
  { code: 'MXN', symbol: 'Mex$' }, // Mexican Peso
  { code: 'BRL', symbol: 'R$' }, // Brazilian Real
  { code: 'RUB', symbol: '₽' }, // Russian Ruble
  { code: 'ZAR', symbol: 'R' }, // South African Rand
  { code: 'TRY', symbol: '₺' }, // Turkish Lira
] as const;

const constants = {
  currencies,
};

export default constants;
