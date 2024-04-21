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
  { name: 'Water', key: 'utilities-water', icon: 'WaterIcon' },
  { name: 'General', key: 'unorganized-general', icon: 'BoxIcon' },
  { name: 'Games', key: 'entertainment-games', icon: 'PlayIcon' },
  { name: 'Movies', key: 'entertainment-movies', icon: 'VideoIcon' },
  { name: 'Music', key: 'entertainment-music', icon: 'SpeakerLoudIcon' },
  { name: 'Sports', key: 'entertainment-sports', icon: 'CubeIcon' },
  { name: 'Dining Out', key: 'food-drinks-dining-out', icon: 'CookieIcon' },
  { name: 'Groceries', key: 'food-drinks-groceries', icon: 'BackpackIcon' },
  { name: 'Liquor', key: 'food-drinks-liquor', icon: 'WineGlassIcon' },
  { name: 'Electronics', key: 'home-electronics', icon: 'DesktopIcon' },
  { name: 'Furniture', key: 'home-furniture', icon: 'SofaIcon' },
  {
    name: 'Household Supplies',
    key: 'home-household-supplies',
    icon: 'BoxIcon',
  },
  { name: 'Maintainence', key: 'home-maintainence', icon: 'ToolsIcon' },
  { name: 'Mortgage / Rent', key: 'home-mortgage-rent', icon: 'HomeIcon' },
  { name: 'Pets', key: 'home-pets', icon: 'PawIcon' },
  { name: 'Services', key: 'home-services', icon: 'HandshakeIcon' },
  { name: 'Bicycle', key: 'transportation-bicycle', icon: 'BicycleIcon' },
  { name: 'Bus / Train', key: 'transportation-bus-train', icon: 'BusIcon' },
  { name: 'Car', key: 'transportation-car', icon: 'CarIcon' },
  { name: 'Gas / Fuel', key: 'transportation-gas-fuel', icon: 'GasPumpIcon' },
  { name: 'Hotel', key: 'transportation-hotel', icon: 'HotelIcon' },
  { name: 'Parking', key: 'transportation-parking', icon: 'ParkingIcon' },
  { name: 'Plane', key: 'transportation-plane', icon: 'AirplaneIcon' },
  { name: 'Taxi', key: 'transportation-taxi', icon: 'TaxiIcon' },
  { name: 'Childcare', key: 'life-childcare', icon: 'ChildIcon' },
  { name: 'Clothing', key: 'life-clothing', icon: 'TShirtIcon' },
  { name: 'Education', key: 'life-education', icon: 'GraduationCapIcon' },
  { name: 'Gifts', key: 'life-gifts', icon: 'GiftIcon' },
  { name: 'Insurance', key: 'life-insurance', icon: 'ShieldIcon' },
  {
    name: 'Medical Expenses',
    key: 'life-medical-expenses',
    icon: 'HospitalIcon',
  },
  { name: 'Taxes', key: 'life-taxes', icon: 'FileTextIcon' },
  { name: 'Other', key: 'other', icon: 'QuestionMarkIcon' },
] as const;

const constants = {
  currencies,
  expensesCategories,
};

export default constants;
