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
  {
    name: 'Cleaning',
    key: 'utilities-cleaning',
    icon: 'MagicWandIcon',
  },
  {
    name: 'Electricity',
    key: 'utilities-electricity',
    icon: 'LightningBoltIcon',
  },
  { name: 'Heat / Gas', key: 'utilities-heat-gas', icon: 'SunIcon' },
  { name: 'Trash', key: 'utilities-trash', icon: 'TrashIcon' },
  {
    name: 'TV / Phone / Internet',
    key: 'utilities-tv-phone-internet',
    icon: 'GlobeIcon',
  },
  { name: 'Water', key: 'utilities-water', icon: 'OpacityIcon' },
  { name: 'General', key: 'unorganized-general', icon: 'MixIcon' },
  { name: 'Games', key: 'entertainment-games', icon: 'PlayIcon' },
  { name: 'Movies', key: 'entertainment-movies', icon: 'VideoIcon' },
  { name: 'Music', key: 'entertainment-music', icon: 'SpeakerLoudIcon' },
  { name: 'Sports', key: 'entertainment-sports', icon: 'CubeIcon' },
  { name: 'Dining Out', key: 'food-drinks-dining-out', icon: 'CookieIcon' },
  { name: 'Groceries', key: 'food-drinks-groceries', icon: 'BackpackIcon' },
  { name: 'Liquor', key: 'food-drinks-liquor', icon: 'OpacityIcon' },
  { name: 'Electronics', key: 'home-electronics', icon: 'LightningBoltIcon' },
  { name: 'Furniture', key: 'home-furniture', icon: 'StackIcon' },
  {
    name: 'Household Supplies',
    key: 'home-household-supplies',
    icon: 'CrumpledPaperIcon',
  },
  { name: 'Maintainence', key: 'home-maintainence', icon: 'GearIcon' },
  { name: 'Mortgage / Rent', key: 'home-mortgage-rent', icon: 'HomeIcon' },
  { name: 'Pets', key: 'home-pets', icon: 'PawIcon' },
  { name: 'Services', key: 'home-services', icon: 'UpdateIcon' },
  { name: 'Bicycle', key: 'transportation-bicycle', icon: 'ColorWheelIcon' },
  { name: 'Bus / Train', key: 'transportation-bus-train', icon: 'PlayIcon' },
  { name: 'Car', key: 'transportation-car', icon: 'PaperPlaneIcon' },
  { name: 'Gas / Fuel', key: 'transportation-gas-fuel', icon: 'MagicWandIcon' },
  { name: 'Hotel', key: 'transportation-hotel', icon: 'HomeIcon' },
  { name: 'Parking', key: 'transportation-parking', icon: 'HandIcon' },
  { name: 'Plane', key: 'transportation-plane', icon: 'RocketIcon' },
  { name: 'Taxi', key: 'transportation-taxi', icon: 'PaperPlaneIcon' },
  { name: 'Childcare', key: 'life-childcare', icon: 'PersonIcon' },
  { name: 'Clothing', key: 'life-clothing', icon: 'PersonIcon' },
  { name: 'Education', key: 'life-education', icon: 'FileTextIcon' },
  { name: 'Gifts', key: 'life-gifts', icon: 'EnvelopeClosedIcon' },
  { name: 'Insurance', key: 'life-insurance', icon: 'FileIcon' },
  {
    name: 'Medical Expenses',
    key: 'life-medical-expenses',
    icon: 'HomeIcon',
  },
  { name: 'Taxes', key: 'life-taxes', icon: 'IdCardIcon' },
  { name: 'Other', key: 'other', icon: 'StarIcon' },
] as const;

const constants = {
  currencies,
  expensesCategories,
};

export default constants;
