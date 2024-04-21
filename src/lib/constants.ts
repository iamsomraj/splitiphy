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

const expenseCategoryIcons = {
  DEFAULT_ICON: 'MagicWandIcon',
  MAGIC_WAND_ICON: 'MagicWandIcon',
  LIGHTNING_BOLT_ICON: 'LightningBoltIcon',
  SUN_ICON: 'SunIcon',
  TRASH_ICON: 'TrashIcon',
  GLOBE_ICON: 'GlobeIcon',
  OPACITY_ICON: 'OpacityIcon',
  MIX_ICON: 'MixIcon',
  PLAY_ICON: 'PlayIcon',
  VIDEO_ICON: 'VideoIcon',
  SPEAKER_LOUD_ICON: 'SpeakerLoudIcon',
  CUBE_ICON: 'CubeIcon',
  COOKIE_ICON: 'CookieIcon',
  BACKPACK_ICON: 'BackpackIcon',
  STACK_ICON: 'StackIcon',
  CRUMPLED_PAPER_ICON: 'CrumpledPaperIcon',
  GEAR_ICON: 'GearIcon',
  HOME_ICON: 'HomeIcon',
  PAW_ICON: 'PawIcon',
  UPDATE_ICON: 'UpdateIcon',
  COLOR_WHEEL_ICON: 'ColorWheelIcon',
  PAPER_PLANE_ICON: 'PaperPlaneIcon',
  HAND_ICON: 'HandIcon',
  ROCKET_ICON: 'RocketIcon',
  PERSON_ICON: 'PersonIcon',
  FILE_TEXT_ICON: 'FileTextIcon',
  ENVELOPE_CLOSED_ICON: 'EnvelopeClosedIcon',
  FILE_ICON: 'FileIcon',
  ID_CARD_ICON: 'IdCardIcon',
  STAR_ICON: 'StarIcon',
  LINK_BREAK2_ICON: 'LinkBreak2Icon',
} as const;

const expensesCategories = [
  {
    name: 'Cleaning',
    key: 'utilities-cleaning',
    icon: expenseCategoryIcons.MAGIC_WAND_ICON,
  },
  {
    name: 'Electricity',
    key: 'utilities-electricity',
    icon: expenseCategoryIcons.LIGHTNING_BOLT_ICON,
  },
  {
    name: 'Heat / Gas',
    key: 'utilities-heat-gas',
    icon: expenseCategoryIcons.SUN_ICON,
  },
  {
    name: 'Trash',
    key: 'utilities-trash',
    icon: expenseCategoryIcons.TRASH_ICON,
  },
  {
    name: 'TV / Phone / Internet',
    key: 'utilities-tv-phone-internet',
    icon: expenseCategoryIcons.GLOBE_ICON,
  },
  {
    name: 'Water',
    key: 'utilities-water',
    icon: expenseCategoryIcons.OPACITY_ICON,
  },
  {
    name: 'General',
    key: 'unorganized-general',
    icon: expenseCategoryIcons.MIX_ICON,
  },
  {
    name: 'Games',
    key: 'entertainment-games',
    icon: expenseCategoryIcons.PLAY_ICON,
  },
  {
    name: 'Movies',
    key: 'entertainment-movies',
    icon: expenseCategoryIcons.VIDEO_ICON,
  },
  {
    name: 'Music',
    key: 'entertainment-music',
    icon: expenseCategoryIcons.SPEAKER_LOUD_ICON,
  },
  {
    name: 'Sports',
    key: 'entertainment-sports',
    icon: expenseCategoryIcons.CUBE_ICON,
  },
  {
    name: 'Dining Out',
    key: 'food-drinks-dining-out',
    icon: expenseCategoryIcons.COOKIE_ICON,
  },
  {
    name: 'Groceries',
    key: 'food-drinks-groceries',
    icon: expenseCategoryIcons.BACKPACK_ICON,
  },
  {
    name: 'Liquor',
    key: 'food-drinks-liquor',
    icon: expenseCategoryIcons.OPACITY_ICON,
  },
  {
    name: 'Electronics',
    key: 'home-electronics',
    icon: expenseCategoryIcons.LINK_BREAK2_ICON,
  },
  {
    name: 'Furniture',
    key: 'home-furniture',
    icon: expenseCategoryIcons.STACK_ICON,
  },
  {
    name: 'Household Supplies',
    key: 'home-household-supplies',
    icon: expenseCategoryIcons.CRUMPLED_PAPER_ICON,
  },
  {
    name: 'Maintainence',
    key: 'home-maintainence',
    icon: expenseCategoryIcons.GEAR_ICON,
  },
  {
    name: 'Mortgage / Rent',
    key: 'home-mortgage-rent',
    icon: expenseCategoryIcons.HOME_ICON,
  },
  { name: 'Pets', key: 'home-pets', icon: expenseCategoryIcons.PAW_ICON },
  {
    name: 'Services',
    key: 'home-services',
    icon: expenseCategoryIcons.UPDATE_ICON,
  },
  {
    name: 'Bicycle',
    key: 'transportation-bicycle',
    icon: expenseCategoryIcons.COLOR_WHEEL_ICON,
  },
  {
    name: 'Bus / Train / Subway',
    key: 'transportation-bus-train',
    icon: expenseCategoryIcons.PLAY_ICON,
  },
  {
    name: 'Car',
    key: 'transportation-car',
    icon: expenseCategoryIcons.PAPER_PLANE_ICON,
  },
  {
    name: 'Gas / Fuel',
    key: 'transportation-gas-fuel',
    icon: expenseCategoryIcons.MAGIC_WAND_ICON,
  },
  {
    name: 'Hotel',
    key: 'transportation-hotel',
    icon: expenseCategoryIcons.HOME_ICON,
  },
  {
    name: 'Parking',
    key: 'transportation-parking',
    icon: expenseCategoryIcons.HAND_ICON,
  },
  {
    name: 'Plane',
    key: 'transportation-plane',
    icon: expenseCategoryIcons.ROCKET_ICON,
  },
  {
    name: 'Taxi',
    key: 'transportation-taxi',
    icon: expenseCategoryIcons.PAPER_PLANE_ICON,
  },
  {
    name: 'Childcare',
    key: 'life-childcare',
    icon: expenseCategoryIcons.PERSON_ICON,
  },

  {
    name: 'Education',
    key: 'life-education',
    icon: expenseCategoryIcons.FILE_TEXT_ICON,
  },
  {
    name: 'Gifts',
    key: 'life-gifts',
    icon: expenseCategoryIcons.ENVELOPE_CLOSED_ICON,
  },
  {
    name: 'Insurance',
    key: 'life-insurance',
    icon: expenseCategoryIcons.FILE_ICON,
  },
  {
    name: 'Medical Expenses',
    key: 'life-medical-expenses',
    icon: expenseCategoryIcons.HOME_ICON,
  },
  {
    name: 'Clothing',
    key: 'life-clothing',
    icon: expenseCategoryIcons.PERSON_ICON,
  },
  { name: 'Taxes', key: 'life-taxes', icon: expenseCategoryIcons.ID_CARD_ICON },
  { name: 'Other', key: 'other', icon: expenseCategoryIcons.STAR_ICON },
] as const;

const constants = {
  currencies,
  expensesCategories,
  expenseCategoryIcons,
};

export default constants;
