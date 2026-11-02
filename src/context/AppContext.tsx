import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  User,
  Listing,
  Order,
  ChatMessage,
  Report,
  AppNotification,
  Review
} from '../types';
import { translations, TranslationKey } from '../locales/translations';
import {
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_ORDERS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;

  // Custom Marketplace Branding
  marketplaceName: string;
  setMarketplaceName: (name: string) => void;

  // Auth & Current User
  currentUser: User | null;
  allUsers: User[];
  login: (identifier: string) => boolean;
  signup: (userData: Partial<User>) => User;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;

  // Navigation state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedListingId: string | null;
  setSelectedListingId: (id: string | null) => void;
  selectedSellerId: string | null;
  setSelectedSellerId: (id: string | null) => void;
  selectedChatUserId: string | null;
  setSelectedChatUserId: (id: string | null) => void;

  // Listings
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerRating' | 'sellerCity' | 'reviews'>) => Listing;
  updateListingStatus: (id: string, status: 'approved' | 'rejected') => void;
  deleteListing: (id: string) => void;

  // Orders & Escrow
  orders: Order[];
  createOrder: (listing: Listing, notes?: string) => Order;
  submitPaymentProof: (orderId: string, paymentMethod: 'jazzcash' | 'easypaisa' | 'bank_transfer', tid: string, proofUrl?: string) => void;
  adminVerifyPayment: (orderId: string) => void;
  sellerAcceptOrder: (orderId: string) => void;
  sellerDeliverOrder: (orderId: string, deliveryNotes?: string) => void;
  buyerConfirmDelivery: (orderId: string) => void;
  submitReview: (orderId: string, rating: number, comment: string) => void;
  adminReleasePayout: (orderId: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (recipientId: string, text: string, listingId?: string) => void;

  // Reports
  reports: Report[];
  submitReport: (targetType: 'listing' | 'user', targetId: string, targetName: string, reason: string, details: string) => void;
  resolveReport: (reportId: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'hunar_language',
  CURRENT_USER_ID: 'hunar_current_user_id',
  MARKETPLACE_NAME: 'hunar_marketplace_name',
  LISTINGS: 'hunar_listings',
  ORDERS: 'hunar_orders',
  CHATS: 'hunar_chats',
  REPORTS: 'hunar_reports',
  USERS: 'hunar_users',
  NOTIFICATIONS: 'hunar_notifications'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language: Default Urdu (RTL)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as Language) || 'ur';
  });

  const isRTL = language === 'ur' || language === 'ps';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.ur;
    return dict[key] || translations.en[key] || (key as string);
  };

  // 2. Custom Marketplace Name (User requested "[Your Name]" app, default "Hunar Bazaar")
  const [marketplaceName, setMarketplaceNameState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.MARKETPLACE_NAME) || 'Hunar Bazaar | ہنر بازار';
  });

  const setMarketplaceName = (name: string) => {
    setMarketplaceNameState(name);
    localStorage.setItem(STORAGE_KEYS.MARKETPLACE_NAME, name);
  };

  // 3. Users & Auth
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_kamran';
  });

  const currentUser = allUsers.find(u => u.id === currentUserId) || allUsers[0] || null;

  // Persist Users
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  };

  const login = (identifier: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const found = allUsers.find(
      u => (u.email && u.email.toLowerCase() === cleanId) || (u.phone && u.phone.includes(cleanId))
    );
    if (found) {
      switchUser(found.id);
      return true;
    }
    // Auto-create or login with identifier
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: identifier.includes('@') ? identifier.split('@')[0] : `User ${identifier.slice(-4)}`,
      email: identifier.includes('@') ? identifier : undefined,
      phone: !identifier.includes('@') ? identifier : undefined,
      role: identifier.toLowerCase().includes('admin') ? 'admin' : 'user',
      city: 'Peshawar',
      bio: 'New member at Hunar Bazaar.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      skills: ['Services', 'Trade'],
      rating: 5.0,
      reviewCount: 0,
      completedOrders: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isVerified: true
    };
    setAllUsers(prev => [newUser, ...prev]);
    switchUser(newUser.id);
    return true;
  };

  const signup = (userData: Partial<User>): User => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email,
      phone: userData.phone,
      role: 'user',
      city: userData.city || 'Peshawar',
      bio: userData.bio || 'Marketplace seller and buyer.',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      skills: userData.skills || ['General'],
      rating: 5.0,
      reviewCount: 0,
      completedOrders: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isVerified: true,
      jazzcashAccount: userData.jazzcashAccount,
      easypaisaAccount: userData.easypaisaAccount
    };
    setAllUsers(prev => [newUser, ...prev]);
    switchUser(newUser.id);
    return newUser;
  };

  const logout = () => {
    // switch to a fresh guest or admin
    switchUser('user_admin');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setAllUsers(prev =>
      prev.map(u => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
  };

  // 4. Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);

  // 5. Listings
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }, [listings]);

  const addListing = (
    item: Omit<Listing, 'id' | 'createdAt' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerRating' | 'sellerCity' | 'reviews'>
  ): Listing => {
    const newListing: Listing = {
      ...item,
      id: `list_${Date.now()}`,
      sellerId: currentUser?.id || 'user_kamran',
      sellerName: currentUser?.name || 'Seller',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      sellerRating: currentUser?.rating || 5.0,
      sellerCity: currentUser?.city || item.city || 'Peshawar',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'approved', // auto-approve for responsive feel
      reviews: []
    };
    setListings(prev => [newListing, ...prev]);

    // Admin notification
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: 'user_admin',
      title: 'نیا اشتہار شائع ہوا',
      message: `${currentUser?.name} نے نیا اشتہار "${newListing.title}" شامل کیا ہے۔`,
      type: 'system',
      linkTarget: 'admin',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    return newListing;
  };

  const updateListingStatus = (id: string, status: 'approved' | 'rejected') => {
    setListings(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  // 6. Orders & Escrow
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  const createOrder = (listing: Listing, notes?: string): Order => {
    const amount = listing.price;
    const platformFee = Math.round(amount * 0.1); // 10%
    const sellerPayout = amount - platformFee; // 90%

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0] || '',
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      buyerId: currentUser?.id || 'guest',
      buyerName: currentUser?.name || 'Buyer',
      buyerPhone: currentUser?.phone || '0300-0000000',
      amount,
      platformFee,
      sellerPayout,
      status: 'pending_payment',
      payoutStatus: 'unpaid',
      paymentMethod: 'jazzcash',
      buyerNotes: notes,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Notifications
    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: listing.sellerId,
      title: 'نیا آرڈر!',
      message: `${currentUser?.name} نے آپ کے آئٹم "${listing.title}" کا آرڈر دیا ہے۔`,
      type: 'order',
      linkTarget: 'orders',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    return newOrder;
  };

  const submitPaymentProof = (
    orderId: string,
    paymentMethod: 'jazzcash' | 'easypaisa' | 'bank_transfer',
    tid: string,
    proofUrl?: string
  ) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          paymentMethod,
          transactionId: tid,
          paymentProofUrl:
            proofUrl ||
            'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
          status: 'payment_submitted'
        };
      })
    );

    // Notify Admin to verify
    const adminNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: 'user_admin',
      title: 'ایسکرو ادائیگی تصدیق طلب',
      message: `آرڈر #${orderId} کی رسید برائے TID ${tid} موصول ہوئی۔`,
      type: 'payment',
      linkTarget: 'admin',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const adminVerifyPayment = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'payment_verified' } : o))
    );

    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Notify seller that payment is in platform escrow
      const sellerNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: order.sellerId,
        title: 'ادائیگی موصول و محفوظ!',
        message: `آرڈر #${order.id} کی رقم ہنر بازار ایسکرو میں آ چکی ہے۔ آپ کام شروع کر سکتے ہیں۔`,
        type: 'order',
        linkTarget: 'orders',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [sellerNotif, ...prev]);
    }
  };

  const sellerAcceptOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'in_progress' } : o))
    );
  };

  const sellerDeliverOrder = (orderId: string, deliveryNotes?: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'delivered',
              deliveryNotes,
              deliveredAt: new Date().toISOString()
            }
          : o
      )
    );

    const order = orders.find(o => o.id === orderId);
    if (order) {
      const buyerNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: order.buyerId,
        title: 'کام کی ترسیل مکمل ہو گئی',
        message: `سیلر ${order.sellerName} نے آپ کا کام مکمل کر کے ترسیل کر دیا ہے۔ براہ کرم تصدیق فرمائیں۔`,
        type: 'order',
        linkTarget: 'orders',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [buyerNotif, ...prev]);
    }
  };

  const buyerConfirmDelivery = (orderId: string) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed',
              payoutStatus: 'ready_for_release',
              completedAt: new Date().toISOString()
            }
          : o
      )
    );

    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Increment completed orders for seller
      setAllUsers(prev =>
        prev.map(u =>
          u.id === order.sellerId
            ? { ...u, completedOrders: u.completedOrders + 1 }
            : u
        )
      );

      // Notify admin to release payout
      const adminNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: 'user_admin',
        title: 'پیمنٹ ریلیز کے لیے تیار',
        message: `خریدار نے آرڈر #${orderId} کی ترسیل کی تصدیق کر دی ہے۔ سیلر کو ₨ ${order.sellerPayout} ادا کریں۔`,
        type: 'payment',
        linkTarget: 'admin',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [adminNotif, ...prev]);
    }
  };

  const submitReview = (orderId: string, rating: number, comment: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      buyerId: currentUser?.id || 'buyer',
      buyerName: currentUser?.name || 'Customer',
      buyerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating,
      comment,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Update listing reviews
    setListings(prev =>
      prev.map(l => {
        if (l.id === order.listingId) {
          const updated = [...l.reviews, newReview];
          const newAvg = Number(
            (updated.reduce((acc, r) => acc + r.rating, 0) / updated.length).toFixed(1)
          );
          return {
            ...l,
            reviews: updated,
            sellerRating: newAvg
          };
        }
        return l;
      })
    );

    // Update seller user rating
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === order.sellerId) {
          const newCount = u.reviewCount + 1;
          const newAvg = Number(
            (((u.rating * u.reviewCount) + rating) / newCount).toFixed(1)
          );
          return { ...u, rating: newAvg, reviewCount: newCount };
        }
        return u;
      })
    );

    // Mark order reviewed
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, reviewSubmitted: true } : o))
    );
  };

  const adminReleasePayout = (orderId: string) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, payoutStatus: 'released' } : o))
    );

    const order = orders.find(o => o.id === orderId);
    if (order) {
      const sellerNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        userId: order.sellerId,
        title: 'رقم آپ کے اکاؤنٹ میں منتقل ہو گئی!',
        message: `آرڈر #${order.id} کی خالص رقم ₨ ${order.sellerPayout} آپ کے جازکیش / ایزی پیسہ اکاؤنٹ پر ریلیز کر دی گئی ہے۔`,
        type: 'payment',
        linkTarget: 'orders',
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [sellerNotif, ...prev]);
    }
  };

  // 7. Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const sendChatMessage = (recipientId: string, text: string, listingId?: string) => {
    if (!currentUser) return;
    const conversationId = [currentUser.id, recipientId].sort().join('_');
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      listingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Send recipient notification
    const msgNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: recipientId,
      title: `نیا پیغام: ${currentUser.name}`,
      message: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
      type: 'message',
      linkTarget: 'inbox',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [msgNotif, ...prev]);
  };

  // 8. Reports
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  const submitReport = (
    targetType: 'listing' | 'user',
    targetId: string,
    targetName: string,
    reason: string,
    details: string
  ) => {
    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser?.id || 'guest',
      reporterName: currentUser?.name || 'Anonymous',
      targetType,
      targetId,
      targetName,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);

    // Alert admin
    const adminNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: 'user_admin',
      title: 'نئی رپورٹ درج کی گئی',
      message: `${targetName} کے خلاف شکایت موصول ہوئی۔`,
      type: 'system',
      linkTarget: 'admin',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [adminNotif, ...prev]);
  };

  const resolveReport = (reportId: string) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
  };

  // 9. Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.filter(n => n.userId !== currentUser.id));
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRTL,
        marketplaceName,
        setMarketplaceName,
        currentUser,
        allUsers,
        login,
        signup,
        logout,
        switchUser,
        updateProfile,
        activeTab,
        setActiveTab,
        selectedListingId,
        setSelectedListingId,
        selectedSellerId,
        setSelectedSellerId,
        selectedChatUserId,
        setSelectedChatUserId,
        listings,
        addListing,
        updateListingStatus,
        deleteListing,
        orders,
        createOrder,
        submitPaymentProof,
        adminVerifyPayment,
        sellerAcceptOrder,
        sellerDeliverOrder,
        buyerConfirmDelivery,
        submitReview,
        adminReleasePayout,
        chatMessages,
        sendChatMessage,
        reports,
        submitReport,
        resolveReport,
        notifications,
        markNotificationAsRead,
        clearNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
