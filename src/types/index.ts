export type Language = 'ur' | 'ps' | 'en';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  city: string;
  bio: string;
  avatar: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  completedOrders: number;
  createdAt: string;
  isVerified?: boolean;
  jazzcashAccount?: string;
  easypaisaAccount?: string;
}

export type ListingType = 'gig' | 'product';

export type ListingCategory =
  | 'video_editing'
  | 'design'
  | 'writing_translation'
  | 'tutoring'
  | 'repairs'
  | 'handmade'
  | 'used_items'
  | 'local_services';

export interface Review {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerCity: string;
  type: ListingType;
  category: ListingCategory;
  title: string;
  description: string;
  price: number; // PKR
  images: string[];
  videoUrl?: string;
  deliveryTime: string; // e.g. "2 Days", "Same Day", "48 Hours"
  city: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  featured?: boolean;
  reviews: Review[];
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_submitted'
  | 'payment_verified'
  | 'accepted'
  | 'in_progress'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type PayoutStatus = 'unpaid' | 'ready_for_release' | 'released';

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  sellerId: string;
  sellerName: string;
  sellerPhone?: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  amount: number; // PKR
  platformFee: number; // 10%
  sellerPayout: number; // 90%
  status: OrderStatus;
  payoutStatus: PayoutStatus;
  paymentMethod: 'jazzcash' | 'easypaisa' | 'bank_transfer';
  paymentProofUrl?: string;
  transactionId?: string;
  deliveryNotes?: string;
  buyerNotes?: string;
  createdAt: string;
  deliveredAt?: string;
  completedAt?: string;
  reviewSubmitted?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  listingId?: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  attachment?: string;
  timestamp: string;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'listing' | 'user';
  targetId: string;
  targetName: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'message' | 'system';
  linkTarget?: string;
  read: boolean;
  createdAt: string;
}
