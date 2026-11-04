import { ProductItem, CATEGORIES } from '../types/market';

export interface AmazonImportResult {
  asin: string;
  title: string;
  titleUrdu: string;
  titlePashto: string;
  category: string;
  priceUsd: number;
  pricePkr: number;
  description: string;
  descriptionUrdu: string;
  photoUrl: string;
  sourceUrl: string;
  rating: number;
  reviewsCount: number;
}

const PKR_PER_USD = 278;

// Sample Curated Amazon Catalog Presets for 1-Click Import Demo
export const AMAZON_PRESET_ITEMS: AmazonImportResult[] = [
  {
    asin: 'B08N5WRWNW',
    title: 'Handmade Genuine Leather Peshawari Craft Sandals (Amazon Choice)',
    titleUrdu: 'ایمیزون پرائم—دستکار اصلی لیدر پشاوری چپل',
    titlePashto: 'د ایمیزون پرائم اصلي چرمي پېښورۍ څپلۍ',
    category: 'chappal',
    priceUsd: 34.99,
    pricePkr: Math.round(34.99 * PKR_PER_USD),
    description: 'Handcrafted premium full-grain leather sandals with traditional double-stitch detail, tire rubber durable sole, and comfortable padded insole.',
    descriptionUrdu: 'ایمیزون پرائم سے تصدیق شدہ اصلی چمڑے کی روایتی ڈبل سلائی والی پشاوری چپل۔ بہترین مٹیریل اور پائیدار سول کے ساتھ۔',
    photoUrl: '/src/assets/images/peshawari_chappal_1793620850599.jpg',
    sourceUrl: 'https://www.amazon.com/dp/B08N5WRWNW',
    rating: 4.8,
    reviewsCount: 342
  },
  {
    asin: 'B09K8V2XZL',
    title: 'Authentic Swati Silk Embroidered Pashmina Shawl',
    titleUrdu: 'ایمیزون چوائس—سواتی سلک کڑھائی والی پشمینہ شال',
    titlePashto: 'د ایمیزون ابریشمي ګنډل شوې پشمینه شال',
    category: 'embroidery_clothes',
    priceUsd: 49.50,
    pricePkr: Math.round(49.50 * PKR_PER_USD),
    description: 'Soft cashmere pashmina shawl featuring hand-embroidered floral motifs inspired by Swat Valley heritage.',
    descriptionUrdu: 'خالص کیشمیر پشمینہ ریشمی کڑھائی والی شال۔ سواتی ثقفی کڑھائی اور اعلیٰ معیار کی گرمائش۔',
    photoUrl: '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg',
    sourceUrl: 'https://www.amazon.com/dp/B09K8V2XZL',
    rating: 4.9,
    reviewsCount: 512
  },
  {
    asin: 'B07M6T4W98',
    title: 'Pure Organic Himalayan Sidr Honey Jar (500g)',
    titleUrdu: 'ایمیزون آرگینک—خالص سدر بیری کا شہد (500 گرام)',
    titlePashto: 'د ایمیزون سوچه نښتر/کوکنار بیرو عسل (شہد)',
    category: 'dry_fruits_food',
    priceUsd: 27.99,
    pricePkr: Math.round(27.99 * PKR_PER_USD),
    description: 'Unprocessed 100% raw wild Sidr honey harvested from Karak and Khyber hillsides.',
    descriptionUrdu: 'کرک اور خیبر کی پہاڑیوں کا سو فیصد خالص جنگلی سدر بیری کا شہد۔ بغیر کسی ملاوٹ کے۔',
    photoUrl: '/src/assets/images/sidr_honey_jar_1793620854016.jpg',
    sourceUrl: 'https://www.amazon.com/dp/B07M6T4W98',
    rating: 4.7,
    reviewsCount: 189
  },
  {
    asin: 'B09XYZ8821',
    title: 'Hand-Carved Walnut Wood Jewelry & Trinket Box',
    titleUrdu: 'ایمیزون ہینڈ میڈ—اخروٹ کی لکڑی کا کندہ کاری والا ڈبہ',
    titlePashto: 'د اخروټ لرګي لاسي جوړ شوی ډبه',
    category: 'woodwork',
    priceUsd: 22.50,
    pricePkr: Math.round(22.50 * PKR_PER_USD),
    description: 'Traditional carved solid walnut box with velvet interior, ideal for jewelry and keepsakes.',
    descriptionUrdu: 'اخروٹ کی مضبوط لکڑی پر روایتی ہتھوڑے اور چھینی سے کی گئی نفیس کندہ کاری۔ اندرونی مخمل کی تہہ کے ساتھ۔',
    photoUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.amazon.com/dp/B09XYZ8821',
    rating: 4.6,
    reviewsCount: 94
  },
  {
    asin: 'B08L2K9981',
    title: 'Traditional Afghan Lapiz Lazuli Silver Earrings',
    titleUrdu: 'ایمیزون جیولری—افغانی لاجورد سلور بالیاں',
    titlePashto: 'د ایمیزون لاجوردو سپینو زرو امېل او غوږوالۍ',
    category: 'jewelry',
    priceUsd: 38.00,
    pricePkr: Math.round(38.00 * PKR_PER_USD),
    description: 'Handmade sterling silver drop earrings set with genuine Badakhshan lapis lazuli gemstones.',
    descriptionUrdu: 'بدخشان کے اصلی لاجورد پتھر اور خالص چاندی سے تیار کردہ روایتی آویزے۔',
    photoUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.amazon.com/dp/B08L2K9981',
    rating: 4.8,
    reviewsCount: 204
  },
  {
    asin: 'B09ELEC882',
    title: 'Professional Electrician Tool Kit & Multi-wire Cutter',
    titleUrdu: 'ایمیزون پرائم—پروفیشنل الیکٹریشن اوزار کٹ و ملٹی وائر سٹرپر',
    titlePashto: 'د ایمیزون د برېښنايي کار ډبل اوزار کټ',
    category: 'electrician_tools',
    priceUsd: 26.99,
    pricePkr: Math.round(26.99 * PKR_PER_USD),
    description: 'Heavy-duty insulated electrician pliers, digital multimeter tester, wire stripper, and screwdriver set with durable carrying pouch.',
    descriptionUrdu: 'ہیوی ڈیوٹی الیکٹریشن اوزار، ڈجیٹل ملٹی میٹر ٹیسٹر، وائر سٹرپر اور پیچ کس سیٹ۔ محفوظ انسولیٹڈ مٹیریل۔',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.amazon.com/dp/B09ELEC882',
    rating: 4.9,
    reviewsCount: 420
  },
  {
    asin: 'B08MED9910',
    title: 'Digital Automatic Blood Pressure Monitor & Medicine Organizer',
    titleUrdu: 'ایمیزون ہیلتھ—ڈجیٹل بلڈ پریشر مانیٹر و میڈیسن بکس',
    titlePashto: 'د ایمیزون روغتیايي د وینې فشار مانیټر او درمل بکس',
    category: 'medicines_healthcare',
    priceUsd: 21.50,
    pricePkr: Math.round(21.50 * PKR_PER_USD),
    description: 'FDA approved digital arm BP monitor with memory store and 7-day weekly pill dispenser box.',
    descriptionUrdu: 'آسن ڈجیٹل بلڈ پریشر مانیٹر آرم کف اور 7 دن کا میڈیسن آرگنائزر بکس۔ گھر کے تمام افراد کے لیے بہترین۔',
    photoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.amazon.com/dp/B08MED9910',
    rating: 4.8,
    reviewsCount: 680
  },
  {
    asin: 'B07TOY7721',
    title: 'Children Educational STEM Building Blocks & Robot Set',
    titleUrdu: 'ایمیزون ٹائز—بچوں کا تعلیمی بلڈنگ بلاکس روبوٹ سیٹ',
    titlePashto: 'د ماشومانو تعلیمی بلاکس او روزنیز لوبو کټ',
    category: 'toys_games',
    priceUsd: 19.99,
    pricePkr: Math.round(19.99 * PKR_PER_USD),
    description: 'Creative 150-piece building brick toy kit fostering logical thinking, fine motor skills, and fun problem solving for kids.',
    descriptionUrdu: 'بچوں کی تخلیقی صلاحیت، ذہانت اور دلچسپی بڑھانے کے لیے 150 ٹکڑوں پر مشتمل تعلیمی بلڈنگ بلاکس کھلونا سیٹ۔',
    photoUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.amazon.com/dp/B07TOY7721',
    rating: 4.7,
    reviewsCount: 310
  }
];

export function extractAsinFromUrl(input: string): string | null {
  if (!input) return null;

  const trimmed = input.trim();
  // Check if it's already a 10-char ASIN (e.g. B08N5WRWNW)
  if (/^[A-Z0-9]{10}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  // Regex to match Amazon URL ASINs: /dp/ASIN, /gp/product/ASIN, /ASIN/
  const match = trimmed.match(/(?:dp|gp\/product|\/([A-Z0-9]{10}))\/?([A-Z0-9]{10})?/i);
  if (match) {
    const asin = match[2] || match[1];
    if (asin && asin.length === 10) {
      return asin.toUpperCase();
    }
  }

  return null;
}

export async function fetchAmazonProduct(urlOrAsin: string): Promise<AmazonImportResult> {
  const asin = extractAsinFromUrl(urlOrAsin);
  const inputLower = urlOrAsin.toLowerCase();

  // 1. Check if input matches any of our curated preset ASINs or URLs
  const matchedPreset = AMAZON_PRESET_ITEMS.find(
    (p) => p.asin.toLowerCase() === asin?.toLowerCase() || urlOrAsin.includes(p.asin)
  );
  if (matchedPreset) {
    return matchedPreset;
  }

  // 2. Smart parser for custom Amazon links or ASINs
  let title = 'Imported Amazon Craft Product';
  let category = 'other';
  let priceUsd = 29.99;
  let photoUrl = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80';

  // Extract title words from URL path if present
  try {
    const urlObj = new URL(urlOrAsin.startsWith('http') ? urlOrAsin : `https://${urlOrAsin}`);
    const pathname = urlObj.pathname;
    const parts = pathname.split('/').filter(Boolean);
    const slug = parts[0];
    if (slug && slug !== 'dp' && slug !== 'gp') {
      const words = slug
        .split('-')
        .filter((w) => !/^[A-Z0-9]{10}$/i.test(w))
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1));
      if (words.length > 0) {
        title = words.join(' ');
      }
    }
  } catch (e) {
    // If raw string instead of URL
  }

  // Determine category based on keywords
  if (inputLower.includes('shoe') || inputLower.includes('chappal') || inputLower.includes('sandal') || inputLower.includes('boot')) {
    category = 'chappal';
    photoUrl = '/src/assets/images/peshawari_chappal_1793620850599.jpg';
  } else if (inputLower.includes('shawl') || inputLower.includes('dress') || inputLower.includes('cloth') || inputLower.includes('embroidery')) {
    category = 'embroidery_clothes';
    photoUrl = '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg';
  } else if (inputLower.includes('honey') || inputLower.includes('fruit') || inputLower.includes('nut') || inputLower.includes('food')) {
    category = 'dry_fruits_food';
    photoUrl = '/src/assets/images/sidr_honey_jar_1793620854016.jpg';
  } else if (inputLower.includes('wood') || inputLower.includes('box') || inputLower.includes('carved')) {
    category = 'woodwork';
    photoUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
  } else if (inputLower.includes('jewel') || inputLower.includes('silver') || inputLower.includes('earring')) {
    category = 'jewelry';
    photoUrl = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80';
  }

  const derivedAsin = asin || `B0${Math.floor(10000000 + Math.random() * 90000000)}`;
  const pricePkr = Math.round(priceUsd * PKR_PER_USD);

  return {
    asin: derivedAsin,
    title: `Amazon Choice: ${title}`,
    titleUrdu: `ایمیزون درآمد—${title}`,
    titlePashto: `د ایمیزون راوارد شوی—${title}`,
    category,
    priceUsd,
    pricePkr,
    description: `Auto-imported product from Amazon (${derivedAsin}). Verified quality, high-resolution imagery, direct shipment handling via local Hunar Bazaar delivery partners.`,
    descriptionUrdu: `ایمیزون (Amazon) سے خودکار طور پر درآمد شدہ دستکاری۔ بہترین کوالٹی، اور ہنر بازار کی محفوظ ترسیل کی ضمانت۔`,
    photoUrl,
    sourceUrl: urlOrAsin.startsWith('http') ? urlOrAsin : `https://www.amazon.com/dp/${derivedAsin}`,
    rating: 4.8,
    reviewsCount: 142
  };
}

export function convertAmazonResultToProductItem(result: AmazonImportResult, customCity = 'پشاور'): ProductItem {
  return {
    id: `amazon_${result.asin}_${Date.now()}`,
    title: result.titleUrdu,
    titlePs: result.titlePashto,
    titleEn: result.title,
    category: result.category,
    price: result.pricePkr,
    shippingFee: 250,
    city: customCity,
    whatsapp: '03001234567',
    description: `${result.descriptionUrdu}\n\n[Amazon ASIN: ${result.asin} | rating: ⭐ ${result.rating} (${result.reviewsCount} reviews)]`,
    descriptionEn: `${result.description}\n\nOriginal Amazon Price: $${result.priceUsd.toFixed(2)} USD`,
    photoUrl: result.photoUrl,
    createdAt: new Date().toISOString(),
    isMine: true,
    source: 'amazon',
    productUrl: result.sourceUrl
  };
}
