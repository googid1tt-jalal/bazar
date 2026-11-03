export type Language = 'ur' | 'ps' | 'en';

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
  { id: 'all', name: 'سب اقسام', nameUrdu: 'سب اقسام', namePashto: 'ټولې کټګورۍ', nameEnglish: 'All Categories', icon: '🛍️', emoji: '🛍️' },
  { id: 'embroidery_clothes', name: 'کڑھائی اور کپڑے', nameUrdu: 'کڑھائی اور کپڑے', namePashto: 'ګنډل او کالي', nameEnglish: 'Embroidery & Clothes', icon: '🪡', emoji: '🪡' },
  { id: 'chappal', name: 'پشاوری چپل', nameUrdu: 'پشاوری چپل', namePashto: 'پېښورۍ څپلۍ', nameEnglish: 'Peshawari Chappal', icon: '👡', emoji: '👡' },
  { id: 'woodwork', name: 'لکڑی کا کام', nameUrdu: 'لکڑی کا کام', namePashto: 'د لرګیو کار', nameEnglish: 'Woodwork', icon: '🪵', emoji: '🪵' },
  { id: 'jewelry', name: 'زیورات', nameUrdu: 'زیورات', namePashto: 'ګاڼې او زیورات', nameEnglish: 'Traditional Jewelry', icon: '💍', emoji: '💍' },
  { id: 'carpets_blankets', name: 'قالین و کمبل', nameUrdu: 'قالین و کمبل', namePashto: 'غالۍ او شړۍ', nameEnglish: 'Carpets & Blankets', icon: '🧶', emoji: '🧶' },
  { id: 'dry_fruits_food', name: 'خشک میوہ و خوراک', nameUrdu: 'خشک میوہ و خوراک', namePashto: 'وچه میوه او خوراک', nameEnglish: 'Dry Fruits & Food', icon: '🥜', emoji: '🥜' },
  { id: 'other', name: 'دیگر', nameUrdu: 'دیگر روایتی سامان', namePashto: 'نور کلتوري توکي', nameEnglish: 'Other Crafts', icon: '✨', emoji: '✨' },
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
  photoUrl: string; // Base64 or asset path
  createdAt: string;
  isMine?: boolean;
  shippingFee?: number; // Delivery charges in PKR (0 for free)
  allowBidding?: boolean; // Whether users can place bids/offers
  currentBid?: number; // Highest active bid amount
  bidsCount?: number;
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
