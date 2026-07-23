export const FIRST_NAMES = [
  "Ava", "Liam", "Sophia", "Noah", "Isabella", "Mason", "Mia", "Ethan", "Amelia", "Lucas",
  "Harper", "Elijah", "Evelyn", "James", "Camila", "Benjamin", "Luna", "Henry", "Gianna", "Alexander",
  "Aria", "Michael", "Ella", "Daniel", "Nora", "Jacob", "Hazel", "Logan", "Zoe", "Jackson",
  "Riley", "Sebastian", "Layla", "Owen", "Nova", "Wyatt", "Chloe", "Leo", "Penelope", "Nathan",
];

export const LAST_NAMES = [
  "Whitfield", "Nakamura", "Oyelaran", "Petrova", "García", "Bennett", "Kovač", "Al-Sayed", "Lindqvist", "Moreau",
  "Okafor", "Bianchi", "Sørensen", "Choudhury", "Reyes", "Fischer", "Kowalski", "Tanaka", "Silva", "Novak",
  "Hendricks", "Delacroix", "Ibragimov", "Sato", "Marchetti", "Osei", "Larkin", "Vasquez", "Berglund", "Adeyemi",
];

export const COMPANIES = [
  "Northwind Traders", "Cedar & Stone Co.", "Lumen Supply", "Fjordline Goods", "Marrow Studio",
  "Basalt & Bloom", "Havenmark", "Quarry Collective", "Solstice Provisions", "Amber Route",
];

export const PRODUCT_NOUNS = [
  "Trail Backpack", "Ceramic Pour-Over Kettle", "Merino Wool Crewneck", "Aluminum Water Bottle",
  "Linen Weekender Bag", "Cast Iron Skillet", "Wireless Charging Dock", "Suede Chelsea Boot",
  "Canvas Utility Apron", "Noise-Isolating Earbuds", "Handthrown Ceramic Mug", "Recycled Wool Blanket",
  "Titanium Multi-Tool", "Leather Card Wallet", "Standing Desk Converter", "Insulated Lunch Box",
  "Bamboo Cutting Board", "Sport Performance Tee", "Minimalist Analog Watch", "Cork Yoga Mat",
  "Brass Desk Lamp", "Organic Cotton Tote", "Stainless French Press", "Packable Rain Shell",
  "Walnut Phone Stand", "Alpaca Wool Scarf", "Portable Bluetooth Speaker", "Slim Leather Belt",
  "Enamel Camp Mug", "Modular Bookshelf Unit",
];

export const PRODUCT_ADJECTIVES = ["Classic", "Essential", "Pro", "Heritage", "Urban", "Signature", "All-Weather", "Everyday", "Premium", "Field"];

export const VENDORS = ["Atlas Supply Co.", "Northfield Goods", "Meridian Workshop", "Coastal Trade", "Aldergrove", "Birchmark", "Union Standard", "Foundry & Co."];

export const CATEGORY_NAMES = [
  "Apparel", "Footwear", "Home & Living", "Accessories", "Electronics", "Outdoor & Travel",
  "Kitchen & Dining", "Office", "Wellness", "Furniture",
];

export const CITIES = [
  { city: "Austin", state: "TX", country: "United States" },
  { city: "Portland", state: "OR", country: "United States" },
  { city: "Brooklyn", state: "NY", country: "United States" },
  { city: "Toronto", state: "ON", country: "Canada" },
  { city: "Berlin", state: "BE", country: "Germany" },
  { city: "Manchester", state: "ENG", country: "United Kingdom" },
  { city: "Lisbon", state: "LIS", country: "Portugal" },
  { city: "Melbourne", state: "VIC", country: "Australia" },
  { city: "Copenhagen", state: "CPH", country: "Denmark" },
  { city: "Austin", state: "TX", country: "United States" },
  { city: "Chicago", state: "IL", country: "United States" },
  { city: "Vancouver", state: "BC", country: "Canada" },
];

export const TAGS = ["bestseller", "new", "limited", "sustainable", "restock", "seasonal", "sale", "staff-pick", "premium", "gift-ready"];

export const DEPARTMENTS = ["Merchandising", "Fulfillment", "Customer Success", "Marketing", "Engineering", "Finance", "Operations"];

export const JOB_TITLES = [
  "Merchandising Manager", "Fulfillment Associate", "Support Specialist", "Growth Marketer",
  "Frontend Engineer", "Financial Analyst", "Operations Lead", "Category Manager", "Data Analyst", "CX Lead",
];

export const IMG = {
  product: (seed: number) => `https://images.unsplash.com/photo-${PRODUCT_PHOTO_IDS[seed % PRODUCT_PHOTO_IDS.length]}?w=800&q=80&auto=format&fit=crop`,
  avatar: (seed: number) => `https://i.pravatar.cc/150?img=${(seed % 70) + 1}`,
};

const PRODUCT_PHOTO_IDS = [
  "1523275335684-37898b6baf30", "1542291026-7eec264c27ff", "1560343090-f0409e92791a",
  "1526170375885-4d8ecf77b99f", "1491553895911-0055eca6402d", "1441986300917-64674bd600d8",
  "1523381210434-271e8be1f52b", "1512436991641-6745cdb1723f", "1595950653106-6c9ebd614d3a",
  "1465101046530-73398c7f28ca", "1519744792095-2f2205e87b6f", "1556228453-efd6c1ff04f6",
];
