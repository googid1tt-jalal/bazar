export type Language =
  | 'ur' | 'ps' | 'en' | 'ar' | 'zh' | 'es' | 'fr' | 'ru' | 'pt' | 'de'
  | 'ja' | 'tr' | 'hi' | 'bn' | 'id' | 'fa' | 'sd' | 'bal' | 'pa' | 'skr'
  | 'ks' | 'it' | 'ko' | 'vi' | 'th' | 'sw' | 'fil' | 'ms' | 'ta' | 'te';

export interface LanguageInfo {
  code: Language;
  nativeName: string;
  englishName: string;
  flag: string;
  dir: 'rtl' | 'ltr';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', flag: '🇵🇰', dir: 'rtl' },
  { code: 'ps', nativeName: 'پښتو', englishName: 'Pashto', flag: '🇦🇫', dir: 'rtl' },
  { code: 'en', nativeName: 'English', englishName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese (Mandarin)', flag: '🇨🇳', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', flag: '🇫🇷', dir: 'ltr' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian', flag: '🇷🇺', dir: 'ltr' },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese', flag: '🇧🇷', dir: 'ltr' },
  { code: 'de', nativeName: 'Deutsch', englishName: 'German', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese', flag: '🇯🇵', dir: 'ltr' },
  { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish', flag: '🇹🇷', dir: 'ltr' },
  { code: 'hi', nativeName: 'हिंदी', englishName: 'Hindi', flag: '🇮🇳', dir: 'ltr' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', flag: '🇧🇩', dir: 'ltr' },
  { code: 'id', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian', flag: '🇮🇩', dir: 'ltr' },
  { code: 'fa', nativeName: 'فارسی', englishName: 'Persian', flag: '🇮🇷', dir: 'rtl' },
  { code: 'sd', nativeName: 'سنڌی', englishName: 'Sindhi', flag: '🇵🇰', dir: 'rtl' },
  { code: 'bal', nativeName: 'بلوچی', englishName: 'Balochi', flag: '🇵🇰', dir: 'rtl' },
  { code: 'pa', nativeName: 'پੰਜਾਬੀ', englishName: 'Punjabi', flag: '🇵🇰', dir: 'rtl' },
  { code: 'skr', nativeName: 'سرائیکی', englishName: 'Saraiki', flag: '🇵🇰', dir: 'rtl' },
  { code: 'ks', nativeName: 'کاشور', englishName: 'Kashmiri', flag: '🇮🇳', dir: 'rtl' },
  { code: 'it', nativeName: 'Italiano', englishName: 'Italian', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ko', nativeName: '한국어', englishName: 'Korean', flag: '🇰🇷', dir: 'ltr' },
  { code: 'vi', nativeName: 'Tiếng Việt', englishName: 'Vietnamese', flag: '🇻🇳', dir: 'ltr' },
  { code: 'th', nativeName: 'ไทย', englishName: 'Thai', flag: '🇹🇭', dir: 'ltr' },
  { code: 'sw', nativeName: 'Kiswahili', englishName: 'Swahili', flag: '🇹🇿', dir: 'ltr' },
  { code: 'fil', nativeName: 'Tagalog', englishName: 'Filipino', flag: '🇵🇭', dir: 'ltr' },
  { code: 'ms', nativeName: 'Bahasa Melayu', englishName: 'Malay', flag: '🇲🇾', dir: 'ltr' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', flag: '🇮🇳', dir: 'ltr' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', flag: '🇮🇳', dir: 'ltr' },
];



export interface AppUser {
  id: string;
  firstName: string;
  secondName: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  city?: string;
  role: 'user' | 'admin';
  avatar?: string;
  provider: 'phone' | 'email' | 'facebook';
}

export const ADMIN_USER: AppUser = {
  id: 'admin_jalal',
  firstName: 'جلال',
  secondName: 'حبیب',
  name: 'جلال حبیب (Jalal Habib)',
  gender: 'male',
  role: 'admin',
  phone: '0300-1234567',
  email: 'jalal.habib@hunarbazaar.pk',
  city: 'پشاور (Peshawar)',
  provider: 'email',
  avatar: 'JH'
};

export interface CategoryOption {
  id: string;
  name: string;
  nameUrdu: string;
  namePashto: string;
  nameEnglish: string;
  icon: string;
  emoji: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'all', name: 'تمام کیٹیگریز', nameUrdu: 'تمام کیٹیگریز', namePashto: 'ټولې کټګورۍ', nameEnglish: 'All Categories', icon: '🛍️', emoji: '🛍️' },
  { id: 'electrician_tools', name: 'الیکٹریشن سامان و اوزار', nameUrdu: 'الیکٹریشن سامان و اوزار', namePashto: 'د برېښنايي کار اوزار', nameEnglish: 'Electrician Tools & Accessories', icon: '⚡', emoji: '⚡' },
  { id: 'medicines_healthcare', name: 'دوائیاں و صحت کا سامان', nameUrdu: 'دوائیاں و صحت کا سامان', namePashto: 'درمل او روغتیايي توکي', nameEnglish: 'Medicines & Healthcare', icon: '💊', emoji: '💊' },
  { id: 'toys_games', name: 'بچوں کے کھلونے', nameUrdu: 'بچوں کے کھلونے و گیمز', namePashto: 'د ماشومانو لوبې او اسباب', nameEnglish: "Children's Toys & Games", icon: '🧸', emoji: '🧸' },
  { id: 'embroidery_clothes', name: 'کپڑے اور کڑھائی', nameUrdu: 'کپڑے اور کڑھائی', namePashto: 'کالي او د جامو ګنډل', nameEnglish: 'Fashion & Clothes', icon: '🪡', emoji: '🪡' },
  { id: 'chappal', name: 'پشاوری چپل و دستکاری', nameUrdu: 'پشاوری چپل و دستکاری', namePashto: 'پېښورۍ څپلۍ او لاسي صنایع', nameEnglish: 'Footwear & Handicrafts', icon: '👡', emoji: '👡' },
  { id: 'home_essentials', name: 'گھریلو سامان', nameUrdu: 'گھریلو سامان و روزمرہ', namePashto: 'د کور اړین توکي', nameEnglish: 'Home Essentials & General', icon: '🏠', emoji: '🏠' },
  { id: 'woodwork', name: 'لکڑی کا کام', nameUrdu: 'لکڑی کا کام و فرنیچر', namePashto: 'د لرګیو کار او فرنیچر', nameEnglish: 'Woodwork & Furniture', icon: '🪵', emoji: '🪵' },
  { id: 'jewelry', name: 'زیورات و زمرد', nameUrdu: 'زیورات و نایاب پتھر', namePashto: 'ګاڼې او یاقوت', nameEnglish: 'Traditional Jewelry & Gems', icon: '💍', emoji: '💍' },
  { id: 'dry_fruits_food', name: 'خشک میوہ و شہد', nameUrdu: 'خشک میوہ و خالص شہد', namePashto: 'وچه میوه او سوچه عسل', nameEnglish: 'Dry Fruits & Honey', icon: '🥜', emoji: '🥜' },
  { id: 'other', name: 'دیگر سامان', nameUrdu: 'دیگر سامان و متفرق', namePashto: 'نور عمومی توکي', nameEnglish: 'Other General Items', icon: '✨', emoji: '✨' },
];

export const PAKISTANI_CITIES = [
  'پشاور (Peshawar)',
  'مردان (Mardan)',
  'سوات (Swat)',
  'کوئٹہ (Quetta)',
  'بنوں (Bannu)',
  'کرک (Karak)',
  'ڈیرہ اسماعیل خان (D.I. Khan)',
  'ایبٹ آباد (Abbottabad)',
  'اسلام آباد (Islamabad)',
  'راولپنڈی (Rawalpindi)',
  'لاہور (Lahore)',
  'کراچی (Karachi)',
  'ملتان (Multan)',
  'فیصل آباد (Faisalabad)',
  'حیدرآباد (Hyderabad)',
  'سکھر (Sukkur)',
  'سیالکوٹ (Sialkot)',
  'گوجرانوالہ (Gujranwala)',
  'گلگت (Gilgit)'
];

export interface CourierService {
  id: string;
  name: string;
  nameUrdu: string;
  trackingUrlTemplate: string;
  phone: string;
  isActive: boolean;
}

export const DEFAULT_COURIERS: CourierService[] = [
  {
    id: 'tcs',
    name: 'TCS Express',
    nameUrdu: 'ٹی سی ایس (TCS)',
    trackingUrlTemplate: 'https://www.tcsexpress.com/tracking?consignmentNo=',
    phone: '021-111-123-456',
    isActive: true
  },
  {
    id: 'leopards',
    name: 'Leopards Courier',
    nameUrdu: 'لیپرڈز کورئیر (Leopards)',
    trackingUrlTemplate: 'https://www.leopardscourier.com/leopard-tracking/?track_numbers=',
    phone: '021-111-300-786',
    isActive: true
  },
  {
    id: 'trax',
    name: 'Trax Logistics',
    nameUrdu: 'ٹریکس (Trax)',
    trackingUrlTemplate: 'https://sonic.pk/tracking?tracking_number=',
    phone: '021-111-118-729',
    isActive: true
  },
  {
    id: 'postex',
    name: 'PostEx',
    nameUrdu: 'پوسٹ ایکس (PostEx)',
    trackingUrlTemplate: 'https://postex.pk/tracking?cn=',
    phone: '042-325-009-99',
    isActive: true
  },
  {
    id: 'mnp',
    name: 'M&P Express',
    nameUrdu: 'ایم اینڈ پی (M&P)',
    trackingUrlTemplate: 'https://mulphilog.com/tracking?consignment=',
    phone: '021-111-202-020',
    isActive: true
  },
  {
    id: 'blueex',
    name: 'BlueEx',
    nameUrdu: 'بلیو ایکس (BlueEx)',
    trackingUrlTemplate: 'https://www.blue-ex.com/tracking?cn=',
    phone: '021-111-258-339',
    isActive: true
  },
  {
    id: 'pakistan_post',
    name: 'Pakistan Post',
    nameUrdu: 'پاکستان پوسٹ (Pak Post)',
    trackingUrlTemplate: 'https://ep.gov.pk/tracking.asp?article_id=',
    phone: '111-111-117',
    isActive: true
  },
  {
    id: 'self_delivery',
    name: 'Self Delivery / Local Rider',
    nameUrdu: 'ذاتی ترسیل / مقامی رائیڈر (Local Rider)',
    trackingUrlTemplate: '',
    phone: 'رابطہ برائے رائیڈر',
    isActive: true
  }
];

export interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  area: string;
  fullAddress: string;
  isDefault?: boolean;
}

export interface ProductItem {
  id: string;
  title: string;
  titlePs?: string;
  titleEn?: string;
  category: string;
  price: number;
  city: string;
  cityPs?: string;
  cityEn?: string;
  whatsapp: string;
  description: string;
  descriptionPs?: string;
  descriptionEn?: string;
  photoUrl: string;
  createdAt: string;
  isMine?: boolean;
  shippingFee?: number;
  allowBidding?: boolean;
  currentBid?: number;
  bidsCount?: number;
  source: 'daraz' | 'amazon' | 'markaz' | 'alibaba' | 'own';
  productUrl?: string;
}

export interface BidItem {
  id: string;
  productId: string;
  productTitle: string;
  productPhoto?: string;
  askingPrice: number;
  bidAmount: number; // Offered bid price in PKR
  bidderName: string;
  bidderPhone: string;
  bidderCity: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  sellerWhatsapp: string;
}

export type OrderShippingStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'delivery_failed';

export interface TimelineEvent {
  status: OrderShippingStatus | string;
  titleUrdu: string;
  timestamp: string;
  note?: string;
}

export interface ReturnRequest {
  reason: string;
  photoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  resolution?: 'refund' | 'replacement';
  requestedAt: string;
  sellerNotes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productPhoto: string;
  category: string;
  price: number;
  quantity: number;
  itemsPrice: number;
  shippingFee: number;
  totalPrice: number; // Cash on Delivery total = itemsPrice + shippingFee
  buyerName: string;
  buyerPhone: string;
  buyerCity: string;
  buyerArea?: string;
  buyerAddress: string;
  sellerWhatsapp: string;
  city: string;
  date: string;

  // Shipping & Courier fields
  shippingStatus: OrderShippingStatus;
  courierId?: string;
  courierName?: string;
  trackingNumber?: string; // Consignment Note (CN)
  shippingNotes?: string;
  shippedAt?: string;
  deliveredAt?: string;
  deliveryAttemptCount?: number;
  failureReason?: string;

  // COD tracking
  codStatus: 'pending' | 'collected' | 'settled';

  // Order Timeline
  timeline: TimelineEvent[];

  // Return & Replacement
  returnRequest?: ReturnRequest;

  // Backward compatibility with legacy string status
  status?: string;
}

export interface ShippingNotification {
  id: string;
  orderId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
