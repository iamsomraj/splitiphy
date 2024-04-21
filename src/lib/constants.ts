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

const expensesCategories = [
  { name: 'Cleaning', key: 'utilities-cleaning' },
  { name: 'Electricity', key: 'utilities-electricity' },
  { name: 'Heat / Gas', key: 'utilities-heat-gas' },
  { name: 'Trash', key: 'utilities-trash' },
  { name: 'TV / Phone / Internet', key: 'utilities-tv-phone-internet' },
  { name: 'Water', key: 'utilities-water' },
  { name: 'General', key: 'unorganized-general' },
  { name: 'Games', key: 'entertainment-games' },
  { name: 'Movies', key: 'entertainment-movies' },
  { name: 'Music', key: 'entertainment-music' },
  { name: 'Sports', key: 'entertainment-sports' },
  { name: 'Dining Out', key: 'food-drinks-dining-out' },
  { name: 'Groceries', key: 'food-drinks-groceries' },
  { name: 'Liquor', key: 'food-drinks-liquor' },
  { name: 'Electronics', key: 'home-electronics' },
  { name: 'Furniture', key: 'home-furniture' },
  { name: 'Household Supplies', key: 'home-household-supplies' },
  { name: 'Maintainence', key: 'home-maintainence' },
  { name: 'Mortgage / Rent', key: 'home-mortgage-rent' },
  { name: 'Pets', key: 'home-pets' },
  { name: 'Services', key: 'home-services' },
  { name: 'Bicycle', key: 'transportation-bicycle' },
  { name: 'Bus / Train', key: 'transportation-bus-train' },
  { name: 'Car', key: 'transportation-car' },
  { name: 'Gas / Fuel', key: 'transportation-gas-fuel' },
  { name: 'Hotel', key: 'transportation-hotel' },
  { name: 'Parking', key: 'transportation-parking' },
  { name: 'Plane', key: 'transportation-plane' },
  { name: 'Taxi', key: 'transportation-taxi' },
  { name: 'Childcare', key: 'life-childcare' },
  { name: 'Clothing', key: 'life-clothing' },
  { name: 'Education', key: 'life-education' },
  { name: 'Gifts', key: 'life-gifts' },
  { name: 'Insurance', key: 'life-insurance' },
  { name: 'Medical Expenses', key: 'life-medical-expenses' },
  { name: 'Taxes', key: 'life-taxes' },
  { name: 'Other', key: 'other' },
] as const;

const constants = {
  currencies,
  expensesCategories,
};

export default constants;
