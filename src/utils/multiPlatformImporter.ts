import { ProductItem, CATEGORIES } from '../types/market';

export type PlatformType = 'Amazon' | 'Alibaba' | 'Daraz' | 'Markaz';

export interface MultiPlatformImportResult {
  id: string;
  platform: PlatformType;
  title: string;
  titleUrdu: string;
  titlePashto: string;
  category: string;
  retailPricePkr: number;
  wholesalePricePkr?: number;
  moq?: number;
  priceUsd?: number;
  description: string;
  descriptionUrdu: string;
  photoUrl: string;
  sourceUrl: string;
  rating: number;
  reviewsCount: number;
  sellerBadge?: string;
}

const PKR_PER_USD = 278;

export const MULTI_PLATFORM_PRESET_ITEMS: MultiPlatformImportResult[] = [
  // 1. Amazon Presets
  {
    id: 'B08N5WRWNW',
    platform: 'Amazon',
    title: 'Amazon Choice: Genuine Leather Handcrafted Peshawari Sandals',
    titleUrdu: 'ایمیزون پرائم—دستکار اصلی لیدر پشاوری چپل',
    titlePashto: 'د ایمیزون پرائم اصلي چرمي پېښورۍ څپلۍ',
    category: 'chappal',
    priceUsd: 34.99,
    retailPricePkr: Math.round(34.99 * PKR_PER_USD),
    description: 'Handcrafted premium full-grain leather sandals with traditional double-stitch detail and tire rubber sole.',
    descriptionUrdu: 'ایمیزون پرائم سے تصدیق شدہ اصلی چمڑے کی روایتی ڈبل سلائی والی پشاوری چپل۔ پائیدار سول کے ساتھ۔',
    photoUrl: '/src/assets/images/peshawari_chappal_1793620850599.jpg',
    sourceUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
    rating: 4.8,
    reviewsCount: 342,
    sellerBadge: 'Amazon Choice 📦'
  },
  {
    id: 'B09ELEC882',
    platform: 'Amazon',
    title: 'Amazon Choice: Professional Electrician Tool Kit & Digital Multimeter',
    titleUrdu: 'ایمیزون پرائم—پروفیشنل الیکٹریشن اوزار کٹ و ملٹی میٹر',
    titlePashto: 'د ایمیزون د برېښنايي کار ډبل اوزار کټ',
    category: 'electrician_tools',
    priceUsd: 26.99,
    retailPricePkr: Math.round(26.99 * PKR_PER_USD),
    description: 'Heavy-duty insulated electrician pliers, digital multimeter tester, wire stripper, and screwdriver set.',
    descriptionUrdu: 'ہیوی ڈیوٹی الیکٹریشن اوزار، ڈجیٹل ملٹی میٹر ٹیسٹر، وائر سٹرپر اور پیچ کس سیٹ۔',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.amazon.com/dp/B09ELEC882',
    rating: 4.9,
    reviewsCount: 420,
    sellerBadge: 'Amazon Prime ⚡'
  },

  // 2. Alibaba Wholesale Presets
  {
    id: 'ali_9012384',
    platform: 'Alibaba',
    title: 'Alibaba Verified Factory: Wholesale Electrician Tools & Wire Stripper Box',
    titleUrdu: 'علی بابا ہول سیل—فیکٹری ڈائریکٹ الیکٹریشن اوزار و سٹرپر بکس',
    titlePashto: 'د علی بابا فابریکې برېښنايي وسیلې هولسیل',
    category: 'electrician_tools',
    retailPricePkr: 3800,
    wholesalePricePkr: 2400,
    moq: 5,
    description: 'Direct manufacturer wholesale export price for 12-in-1 electrician insulated pliers and tester tool box.',
    descriptionUrdu: 'علی بابا تصدیق شدہ فیکٹری سے براہ راست الیکٹریشن اوزار کٹ۔ کم سے کم آرڈر 5 دانہ ہول سیل نرخ ₨ 2,400۔',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.alibaba.com/product-detail/Wholesale-Electrician-Tool-Kit_160012345.html',
    rating: 4.9,
    reviewsCount: 1280,
    sellerBadge: 'Alibaba Wholesale 🏭 (MOQ 5)'
  },
  {
    id: 'ali_8829103',
    platform: 'Alibaba',
    title: 'Alibaba Verified: Smart Household LED Lamp & Wireless Charger',
    titleUrdu: 'علی بابا ہول سیل—اسمارٹ ایل ای ڈی ہوم لیمپ و وائرلیس چارجر',
    titlePashto: 'د علی بابا د کور لپاره ځیرک ډبل لیمپ',
    category: 'home_essentials',
    retailPricePkr: 2900,
    wholesalePricePkr: 1800,
    moq: 10,
    description: 'Modern touch-control LED table lamp with integrated smartphone fast wireless charging pad.',
    descriptionUrdu: 'جدید ٹچ کنٹرول ایل ای ڈی لیمپ بمعہ وائرلیس موبائل چارجر۔ ہول سیل فیکٹری ریٹ ₨ 1,800۔',
    photoUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.alibaba.com/product-detail/Smart-LED-Table-Lamp_160098765.html',
    rating: 4.7,
    reviewsCount: 840,
    sellerBadge: 'Alibaba Verified Supplier 🏭'
  },

  // 3. Daraz Pakistan Presets
  {
    id: 'daraz_pk_10293',
    platform: 'Daraz',
    title: 'Daraz Express: Digital Blood Pressure Monitor Machine & Cuff',
    titleUrdu: 'دراز ایکسپریس—ڈجیٹل بلڈ پریشر مانیٹر مشین',
    titlePashto: 'د دراز پاکستان د وینې فشار مانیټر',
    category: 'medicines_healthcare',
    retailPricePkr: 3450,
    description: 'Daraz Mall 100% genuine automatic arm blood pressure meter with digital LCD screen and memory function.',
    descriptionUrdu: 'دراز مال سے تصدیق شدہ 100 فیصد اصلی ڈجیٹل بلڈ پریشر مشین۔ تیز رفتاری سے پاکستان بھر میں ڈلیوری۔',
    photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.daraz.pk/products/digital-bp-monitor-i10293.html',
    rating: 4.8,
    reviewsCount: 950,
    sellerBadge: 'Daraz Mall 🟠'
  },
  {
    id: 'daraz_pk_88321',
    platform: 'Daraz',
    title: 'Daraz Verified: Unstitched Embroidered Chiffon 3-Piece Lawn Suit',
    titleUrdu: 'دراز ایکسپریس—تھری پیس ان اسٹچڈ کڑھائی والا سوٹ',
    titlePashto: 'د دراز درې ټوټې زنانه ښکلی درز سوټ',
    category: 'embroidery_clothes',
    retailPricePkr: 2890,
    description: 'Premium quality designer embroidered lawn chiffon suit with embroidered neckline and chiffon dupatta.',
    descriptionUrdu: 'اعلیٰ معیار کا کڑھائی والا لون چفون تھری پیس سوٹ۔ نفاست اور خوبصورت ڈیزائننگ۔',
    photoUrl: '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg',
    sourceUrl: 'https://www.daraz.pk/products/embroidered-lawn-suit-i88321.html',
    rating: 4.7,
    reviewsCount: 620,
    sellerBadge: 'Daraz Express 🟠'
  },

  // 4. Markaz App Reseller Presets
  {
    id: 'markaz_app_5541',
    platform: 'Markaz',
    title: 'Markaz Reseller: Children Educational Building Blocks & Robot Set',
    titleUrdu: 'مرکز ریسیلر—بچوں کا تعلیمی بلڈنگ بلاکس روبوٹ کھلونا',
    titlePashto: 'د مرکز اپلیکیشن د ماشومانو لاسي تعلیمی لوبیز کټ',
    category: 'toys_games',
    retailPricePkr: 1850,
    wholesalePricePkr: 1150,
    description: 'Markaz App top-selling reseller catalog product. 150-piece building block robot set for children. Flat Rs 90 delivery across Pakistan.',
    descriptionUrdu: 'مرکز ایپ کا ٹاپ سیلنگ ریسیلر آئٹم۔ ہول سیل ریٹ ₨ 1,150، ریسیلر منافع ₨ 700، پورے پاکستان میں ₨ 90 ڈلیوری فیس۔',
    photoUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://markaz.app/catalog/toys-building-blocks-5541',
    rating: 4.9,
    reviewsCount: 1450,
    sellerBadge: 'Markaz App Reseller 🟢'
  },
  {
    id: 'markaz_app_9921',
    platform: 'Markaz',
    title: 'Markaz Reseller: Portable Electric Kitchen Juicer & Blender',
    titleUrdu: 'مرکز ریسیلر—پورٹیبل الیکٹرک کچن گرائنڈر و جوسر',
    titlePashto: 'د مرکز کورنی برېښنايي جوسر او بلینډر',
    category: 'home_essentials',
    retailPricePkr: 2800,
    wholesalePricePkr: 1950,
    description: 'Rechargeable USB electric juicer and blender for kitchen and travel. Markaz verified supplier.',
    descriptionUrdu: 'مرکز ایپ ریچارج ایبل USB الیکٹرک جوسر و گرائنڈر۔ ہول سیل نرخ ₨ 1,950۔',
    photoUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://markaz.app/catalog/kitchen-electric-juicer-9921',
    rating: 4.8,
    reviewsCount: 1120,
    sellerBadge: 'Markaz Verified Reseller 🟢'
  }
];

export function detectPlatformFromUrl(input: string): PlatformType {
  const lower = input.toLowerCase().trim();

  if (lower.includes('alibaba') || lower.includes('aliexpress')) {
    return 'Alibaba';
  }
  if (lower.includes('daraz')) {
    return 'Daraz';
  }
  if (lower.includes('markaz')) {
    return 'Markaz';
  }
  return 'Amazon';
}

export async function fetchMultiPlatformProduct(
  urlOrId: string,
  platformHint?: PlatformType
): Promise<MultiPlatformImportResult> {
  const detectedPlatform = platformHint || detectPlatformFromUrl(urlOrId);
  const inputLower = urlOrId.toLowerCase().trim();

  // 1. Check if input matches any preset item directly
  const matchedPreset = MULTI_PLATFORM_PRESET_ITEMS.find(
    (p: MultiPlatformImportResult) =>
      p.id.toLowerCase() === inputLower ||
      p.sourceUrl.toLowerCase().includes(inputLower) ||
      inputLower.includes(p.id.toLowerCase())
  );

  if (matchedPreset) {
    return matchedPreset;
  }

  // 2. Dynamic parser based on platform
  let title = 'Imported Multi-Platform Listing';
  let category = 'home_essentials';
  let retailPricePkr = 3500;
  let wholesalePricePkr: number | undefined;
  let moq: number | undefined;
  let photoUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
  let sellerBadge = `${detectedPlatform} Import`;

  // Parse keywords from input string if provided
  if (inputLower.includes('tool') || inputLower.includes('wire') || inputLower.includes('electrician') || inputLower.includes('meter')) {
    category = 'electrician_tools';
    title = `${detectedPlatform}: Electrician Multi-Tool Kit & Tester`;
    retailPricePkr = 3800;
    photoUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';
  } else if (inputLower.includes('medicine') || inputLower.includes('bp') || inputLower.includes('health') || inputLower.includes('pill')) {
    category = 'medicines_healthcare';
    title = `${detectedPlatform}: Digital BP Monitor & Health Organizer`;
    retailPricePkr = 4200;
    photoUrl = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';
  } else if (inputLower.includes('toy') || inputLower.includes('game') || inputLower.includes('robot') || inputLower.includes('block')) {
    category = 'toys_games';
    title = `${detectedPlatform}: Children Educational STEM Building Toy Set`;
    retailPricePkr = 2500;
    photoUrl = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80';
  } else if (inputLower.includes('cloth') || inputLower.includes('suit') || inputLower.includes('shawl') || inputLower.includes('chiffon')) {
    category = 'embroidery_clothes';
    title = `${detectedPlatform}: Unstitched Embroidered Designer Suit`;
    retailPricePkr = 3200;
    photoUrl = '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg';
  }

  if (detectedPlatform === 'Alibaba') {
    wholesalePricePkr = Math.round(retailPricePkr * 0.65);
    moq = 5;
    sellerBadge = 'Alibaba Wholesale 🏭 (MOQ 5)';
  } else if (detectedPlatform === 'Markaz') {
    wholesalePricePkr = Math.round(retailPricePkr * 0.7);
    sellerBadge = 'Markaz App Reseller 🟢';
  } else if (detectedPlatform === 'Daraz') {
    sellerBadge = 'Daraz Mall 🟠';
  } else {
    sellerBadge = 'Amazon Choice 📦';
  }

  const generatedId = `${detectedPlatform.toLowerCase()}_${Date.now()}`;

  return {
    id: generatedId,
    platform: detectedPlatform,
    title: `${detectedPlatform} Choice: ${title}`,
    titleUrdu: `${detectedPlatform === 'Amazon' ? 'ایمیزون' : detectedPlatform === 'Alibaba' ? 'علی بابا' : detectedPlatform === 'Daraz' ? 'دراز' : 'مرکز ایپ'}—${title}`,
    titlePashto: `د ${detectedPlatform} امپورټ شوی—${title}`,
    category,
    retailPricePkr,
    wholesalePricePkr,
    moq,
    description: `Auto-synced item from ${detectedPlatform}. Verified quality, fast dispatch, and direct Cash on Delivery escrow protection via Hunar Bazaar.`,
    descriptionUrdu: `${detectedPlatform} سے خودکار طور پر لنک شدہ سامان۔ ہنر بازار کی محفوظ کیش آن ڈیلیوری اور 100% تسلی بخش کوالٹی۔`,
    photoUrl,
    sourceUrl: urlOrId.startsWith('http') ? urlOrId : `https://${detectedPlatform.toLowerCase()}.com/item/${generatedId}`,
    rating: 4.8,
    reviewsCount: 380,
    sellerBadge
  };
}

export function convertMultiPlatformResultToProductItem(
  result: MultiPlatformImportResult,
  customCity = 'پشاور'
): ProductItem {
  const isAmazon = result.platform === 'Amazon';

  return {
    id: `import_${result.platform.toLowerCase()}_${result.id}_${Date.now()}`,
    title: result.titleUrdu,
    titlePs: result.titlePashto,
    titleEn: result.title,
    category: result.category,
    price: result.retailPricePkr,
    shippingFee: result.platform === 'Markaz' ? 90 : 200,
    city: customCity,
    whatsapp: '03001234567',
    description: `${result.descriptionUrdu}\n\n[Platform: ${result.platform} | Rating: ⭐ ${result.rating} (${result.reviewsCount} reviews)${result.wholesalePricePkr ? ` | Wholesale Rate: ₨ ${result.wholesalePricePkr.toLocaleString()}` : ''}]`,
    descriptionEn: `${result.description}\n\nSynced from ${result.platform} Catalog (${result.sourceUrl})`,
    photoUrl: result.photoUrl,
    createdAt: new Date().toISOString(),
    isMine: true,
    source: result.platform.toLowerCase() as any,
    productUrl: result.sourceUrl
  };
}
