import { ProductItem, SavedAddress, OrderItem, ShippingNotification, BidItem } from '../types/market';

/**
 * Resizes an image file to max width 500px and compresses to JPEG 0.7
 * as required by the specification before saving.
 */
export function resizeAndCompressImage(file: File, maxWidth = 500, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Fill background white for transparent PNGs converted to JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Normalizes a Pakistani phone number (e.g. 03001234567 or +923001234567 or 0300-1234567)
 * to WhatsApp international format: 923001234567
 */
export function formatToPakistaniWhatsapp(number: string): string {
  const clean = number.replace(/\D/g, '');

  if (clean.startsWith('92')) {
    return clean;
  }
  if (clean.startsWith('0')) {
    return '92' + clean.slice(1);
  }
  if (clean.length === 10) {
    return '92' + clean;
  }
  return clean || '923001234567';
}

/**
 * Constructs the WhatsApp direct order link with formatted Urdu order details including COD & delivery
 */
export function buildWhatsAppOrderUrl(params: {
  sellerWhatsapp: string;
  productTitle: string;
  quantity: number;
  itemsPrice: number;
  shippingFee: number;
  totalPrice: number;
  buyerName: string;
  buyerPhone: string;
  buyerCity: string;
  buyerArea?: string;
  buyerAddress: string;
}): string {
  const phone = formatToPakistaniWhatsapp(params.sellerWhatsapp);

  const shippingText = params.shippingFee > 0
    ? `${params.shippingFee.toLocaleString()} روپے`
    : 'مفت ترسیل (Free Delivery)';

  const fullAddress = `${params.buyerArea ? params.buyerArea + '، ' : ''}${params.buyerAddress}، ${params.buyerCity}`;

  const urduMessage = `السلام علیکم! ہنر بازار سے آپ کا یہ دستکاری آئٹم آرڈر کرنا ہے:
📦 آئٹم: ${params.productTitle}
🔢 تعداد: ${params.quantity} دانہ
🏷️ قیمت: ${params.itemsPrice.toLocaleString()} روپے
🚚 ترسیل فیس (Delivery Charges): ${shippingText}
💰 کل واجب الادا رقم (Total COD): ${params.totalPrice.toLocaleString()} روپے
👤 خریدار: ${params.buyerName}
📞 فون: ${params.buyerPhone}
📍 ترسیل کا پتہ: ${fullAddress}
💵 ادائیگی: کیش آن ڈیلیوری (مال ملنے پر)`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(urduMessage)}`;
}

/**
 * Shares product listing using Web Share API with intelligent fallback to WhatsApp / Clipboard
 */
export async function shareProductListing(product: ProductItem): Promise<'shared' | 'copied' | 'opened_wa'> {
  const shareTitle = `🧶 ${product.title} - ہنر بازار`;
  const shareText = `ہنر بازار پر یہ روایتی دستکاری دیکھیں: "${product.title}" - قیمت صرف ${product.price.toLocaleString()} روپے (${product.city})۔ کیش آن ڈیلیوری ترسیل کے ساتھ!`;
  const shareUrl = window.location.href;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
      return 'shared';
    } catch (err: any) {
      if (err.name === 'AbortError') return 'shared';
    }
  }

  // Fallback 1: Try clipboard copy
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      return 'copied';
    } catch (e) {
      // Fallback 2: Open WhatsApp share
      const waShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
      window.open(waShare, '_blank');
      return 'opened_wa';
    }
  }

  const waShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  window.open(waShare, '_blank');
  return 'opened_wa';
}

export function getProductTitle(product: ProductItem, lang: string = 'ur'): string {
  if (lang === 'ps' && product.titlePs) return product.titlePs;
  if (lang === 'en' && product.titleEn) return product.titleEn;
  return product.title;
}

export function getProductDescription(product: ProductItem, lang: string = 'ur'): string {
  if (lang === 'ps' && product.descriptionPs) return product.descriptionPs;
  if (lang === 'en' && product.descriptionEn) return product.descriptionEn;
  return product.description;
}

export function getProductCity(product: ProductItem, lang: string = 'ur'): string {
  if (lang === 'ps' && product.cityPs) return product.cityPs;
  if (lang === 'en' && product.cityEn) return product.cityEn;
  return product.city;
}

export const INITIAL_PRODUCTS: ProductItem[] = [
  { id: 'item_1', title: 'پشاوری چپل (اصلی چمڑا و ٹائر سول)', category: 'chappal', price: 3000, shippingFee: 200, city: 'پشاور', whatsapp: '03139876543', description: 'نمک منڈی پشاور کی خالص چمڑے کی روایتی چپل', photoUrl: '', createdAt: '2026-11-01', isMine: false, source: 'own', productUrl: '' },
  { id: 'item_2', title: 'پشتون کڑھائی والی روایتی ٹوپی', category: 'embroidery_clothes', price: 1200, shippingFee: 150, city: 'مردان', whatsapp: '03215551234', description: 'مردان کی مشہور ہاتھ سے کڑھی ہوئی پختون ثقافتی ٹوپی', photoUrl: '', createdAt: '2026-11-01', isMine: false, source: 'own', productUrl: '' },
  { id: 'item_3', title: 'سواتی کڑھائی والی گرم اون کی شال', category: 'embroidery_clothes', price: 4500, shippingFee: 0, city: 'سوات', whatsapp: '03457778899', description: 'سوات کی خالص بھیڑ کی اون سے تیار کردہ ہاتھ کی کڑھائی والی پرتعیش شال', photoUrl: '', createdAt: '2026-10-30', isMine: false, source: 'own', productUrl: '' },
  { id: 'item_4', title: 'کرک کے پہاڑوں کا خالص بیری (سدر) کا شہد', category: 'dry_fruits_food', price: 2800, shippingFee: 250, city: 'کرک', whatsapp: '03334442211', description: 'خیبر پختونخوا کے پہاڑوں سے حاصل کردہ 100 فیصد خالص شہد', photoUrl: '', createdAt: '2026-10-29', isMine: false, source: 'own', productUrl: '' },
  { id: 'item_5', title: 'پروفیشنل الیکٹریشن اوزار کٹ', category: 'electrician_tools', price: 3500, shippingFee: 200, city: 'پشاور', whatsapp: '03001234567', description: 'ہیوی ڈیوٹی الیکٹریشن ٹول سیٹ', photoUrl: '', createdAt: '2026-10-28', isMine: false, source: 'own', productUrl: '' },
  { id: 'item_6', title: 'ڈجیٹل بلڈ پریشر مانیٹر مشین', category: 'medicines_healthcare', price: 4200, shippingFee: 0, city: 'اسلام آباد', whatsapp: '03001234567', description: 'گھر کے لیے آسان اور بالکل درست ڈجیٹل بلڈ پریشر مانیٹر', photoUrl: '', createdAt: '2026-10-27', isMine: false, source: 'own', productUrl: '' },
  { id: 'item_7', title: 'بچوں کا تعلیمی بلڈنگ بلاکس روبوٹ کھلونا سیٹ', category: 'toys_games', price: 2400, shippingFee: 180, city: 'لاہور', whatsapp: '03001234567', description: 'بچوں کی ذہنی نشوونما کے لیے تعلیمی بلاکس', photoUrl: '', createdAt: '2026-10-26', isMine: false, source: 'own', productUrl: '' },
  { id: 'item_8', title: 'Amazon Essentials Men’s Polo Shirt', category: 'other', price: 5000, shippingFee: 300, city: 'Amazon', whatsapp: '', description: 'Authentic Amazon polo shirt.', photoUrl: '', createdAt: '2026-11-02', isMine: false, source: 'amazon', productUrl: 'https://amazon.com/product/1' },
];

export const INITIAL_BIDS: BidItem[] = [
  {
    id: 'bid_101',
    productId: 'item_1',
    productTitle: 'پشاوری چپل (اصلی چمڑا و ٹائر سول)',
    productPhoto: '/src/assets/images/peshawari_chappal_1793620850599.jpg',
    askingPrice: 3000,
    bidAmount: 2850,
    bidderName: 'ظفر اقبال',
    bidderPhone: '03028887766',
    bidderCity: 'اسلام آباد (Islamabad)',
    message: 'اگر سائز 43 براؤن کلر میں دستیاب ہو تو 2,850 روپے کیش آن ڈیلیوری فائنل کریں۔',
    status: 'pending',
    createdAt: '2 نومبر 2026 · 11:45 AM',
    sellerWhatsapp: '03139876543'
  },
  {
    id: 'bid_102',
    productId: 'item_3',
    productTitle: 'سواتی کڑھائی والی گرم اون کی شال',
    productPhoto: '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg',
    askingPrice: 4500,
    bidAmount: 4200,
    bidderName: 'فرحان علی',
    bidderPhone: '03461112233',
    bidderCity: 'لاہور (Lahore)',
    message: '2 شالیں لینی ہیں، فی شال 4,200 روپے قبول فرمائیں۔',
    status: 'accepted',
    createdAt: '1 نومبر 2026 · 04:30 PM',
    sellerWhatsapp: '03457778899'
  }
];

export const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_1',
    fullName: 'خان زمان',
    phone: '03001234567',
    city: 'پشاور (Peshawar)',
    area: 'حیات آباد، فیز 2',
    fullAddress: 'مکان نمبر 42، اسٹریٹ 7، سیکٹر ایف، حیات آباد',
    isDefault: true
  },
  {
    id: 'addr_2',
    fullName: 'خان زمان (دکان / آفس)',
    phone: '03139876543',
    city: 'راولپنڈی (Rawalpindi)',
    area: 'صدر بازار',
    fullAddress: 'شاپ نمبر 14، رحمان پلازہ، بینک روڈ، صدر',
    isDefault: false
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'HB-9081',
    productId: 'item_1',
    productTitle: 'پشاوری چپل (اصلی چمڑا و ٹائر سول)',
    productPhoto: '/src/assets/images/peshawari_chappal_1793620850599.jpg',
    category: 'chappal',
    price: 3000,
    quantity: 1,
    itemsPrice: 3000,
    shippingFee: 200,
    totalPrice: 3200,
    buyerName: 'سردار احمد خان',
    buyerPhone: '03001234567',
    buyerCity: 'پشاور (Peshawar)',
    buyerArea: 'حیات آباد فیز 2',
    buyerAddress: 'مکان نمبر 42، اسٹریٹ 7، سیکٹر ایف',
    sellerWhatsapp: '03139876543',
    city: 'پشاور',
    date: '2 نومبر 2026',
    shippingStatus: 'packed',
    courierId: 'tcs',
    courierName: 'TCS Express',
    trackingNumber: 'TCS78294101',
    shippingNotes: 'نازک سامان، احتیاط سے ڈیلیور کریں۔ گاہک کو پارسل چیک کرنے کی اجازت ہے۔',
    codStatus: 'pending',
    timeline: [
      {
        status: 'placed',
        titleUrdu: 'آرڈر موصول ہو گیا (Order Placed)',
        timestamp: '10:30 AM · 2 نومبر 2026',
        note: 'خریدار نے واٹس ایپ اور پورٹل پر آرڈر دیا ہے۔'
      },
      {
        status: 'confirmed',
        titleUrdu: 'سیلر نے آرڈر کی تصدیق کر دی',
        timestamp: '11:15 AM · 2 نومبر 2026',
        note: 'سائز 42 چیک کر لیا گیا ہے۔'
      },
      {
        status: 'packed',
        titleUrdu: 'آرڈر پیک کر دیا گیا ہے (Packed)',
        timestamp: '01:45 PM · 2 نومبر 2026',
        note: 'پیکنگ مکمل، ٹی سی ایس کورئیر ہینڈ اوور کے لیے تیار۔'
      }
    ]
  },
  {
    id: 'HB-8842',
    productId: 'item_3',
    productTitle: 'سواتی کڑھائی والی گرم اون کی شال',
    productPhoto: '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg',
    category: 'embroidery_clothes',
    price: 4500,
    quantity: 1,
    itemsPrice: 4500,
    shippingFee: 0,
    totalPrice: 4500,
    buyerName: 'بلال ملک',
    buyerPhone: '03339998877',
    buyerCity: 'اسلام آباد (Islamabad)',
    buyerArea: 'سیکٹر F-10/3',
    buyerAddress: 'گھر 18-B، اسٹریٹ 45، نزد ایف ٹین مرکز',
    sellerWhatsapp: '03457778899',
    city: 'سوات',
    date: '1 نومبر 2026',
    shippingStatus: 'shipped',
    courierId: 'leopards',
    courierName: 'Leopards Courier',
    trackingNumber: 'LEO55419082',
    shippingNotes: 'مفت ترسیل پروموشنل آرڈر',
    shippedAt: '2026-11-01T15:00:00Z',
    codStatus: 'pending',
    timeline: [
      {
        status: 'placed',
        titleUrdu: 'آرڈر موصول (Placed)',
        timestamp: '09:00 AM · 1 نومبر 2026'
      },
      {
        status: 'confirmed',
        titleUrdu: 'تصدیق شدہ (Confirmed)',
        timestamp: '10:20 AM · 1 نومبر 2026'
      },
      {
        status: 'packed',
        titleUrdu: 'پیک کر دیا گیا (Packed)',
        timestamp: '12:00 PM · 1 نومبر 2026'
      },
      {
        status: 'shipped',
        titleUrdu: 'لیپرڈز کورئیر کے سپرد روانہ (Shipped)',
        timestamp: '03:00 PM · 1 نومبر 2026',
        note: 'منزل: اسلام آباد برانچ حب'
      }
    ]
  },
  {
    id: 'HB-7619',
    productId: 'item_4',
    productTitle: 'کرک کے پہاڑوں کا خالص بیری (سدر) کا شہد',
    productPhoto: '/src/assets/images/sidr_honey_jar_1793620854016.jpg',
    category: 'dry_fruits_food',
    price: 2800,
    quantity: 1,
    itemsPrice: 2800,
    shippingFee: 250,
    totalPrice: 3050,
    buyerName: 'عمران درانی',
    buyerPhone: '03123456789',
    buyerCity: 'لاہور (Lahore)',
    buyerArea: 'گلبرگ 3',
    buyerAddress: 'فلیٹ 4A، ایم ایم عالم روڈ',
    sellerWhatsapp: '03334442211',
    city: 'کرک',
    date: '28 اکتوبر 2026',
    shippingStatus: 'delivered',
    status: 'مال مل گیا ✅',
    courierId: 'trax',
    courierName: 'Trax Logistics',
    trackingNumber: 'TRX99238120',
    deliveredAt: '2026-10-30T17:00:00Z',
    codStatus: 'collected',
    timeline: [
      {
        status: 'placed',
        titleUrdu: 'آرڈر موصول (Placed)',
        timestamp: '28 اکتوبر 2026'
      },
      {
        status: 'shipped',
        titleUrdu: 'ٹریکس کوریئر روانہ (Shipped)',
        timestamp: '29 اکتوبر 2026'
      },
      {
        status: 'delivered',
        titleUrdu: 'ترسیل مکمل اور رقم موصول (Delivered)',
        timestamp: '30 اکتوبر 2026',
        note: 'کیش آن ڈیلیوری رقم ₨ 3,050 وصول کر لی گئی۔'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: ShippingNotification[] = [
  {
    id: 'notif_1',
    orderId: 'HB-9081',
    title: 'نیا آرڈر موصول ہوا (Ready to Ship)',
    message: 'سردار احمد خان نے "پشاوری چپل" کا آرڈر دیا ہے (₨ 3,200)۔ پارسل پیک کریں اور کورئیر منتخب کریں۔',
    timestamp: '11:15 AM',
    read: false
  },
  {
    id: 'notif_2',
    orderId: 'HB-8842',
    title: 'پارسل روانہ ہو گیا (In Transit)',
    message: 'آرڈر #HB-8842 لیپرڈز کورئیر (CN: LEO55419082) کے ذریعے خریدار کو روانہ کر دیا گیا ہے۔',
    timestamp: 'کل 03:00 PM',
    read: true
  }
];
