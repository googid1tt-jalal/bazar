/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ProductItem,
  OrderItem,
  CourierService,
  SavedAddress,
  ShippingNotification,
  DEFAULT_COURIERS,
  Language,
  OrderShippingStatus,
  BidItem,
  AppUser
} from './types/market';
import {
  INITIAL_PRODUCTS,
  INITIAL_SAVED_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BIDS
} from './utils/helpers';
import { Header } from './components/Header';
import { SideNavigation } from './components/SideNavigation';
import { AuthModal } from './components/AuthModal';
import { BottomNav, TabKey } from './components/BottomNav';
import { OrderModal } from './components/OrderModal';
import { BidModal } from './components/BidModal';
import { ShippingLabelModal } from './components/ShippingLabelModal';
import { TrackingTimelineModal } from './components/TrackingTimelineModal';
import { SellerShipmentModal } from './components/SellerShipmentModal';
import { AdminShippingModal } from './components/AdminShippingModal';
import { NotificationsModal } from './components/NotificationsModal';
import { OfflineIndicator } from './components/OfflineIndicator';

import { MarketTab } from './views/MarketTab';
import { SellTab } from './views/SellTab';
import { MyShopTab } from './views/MyShopTab';
import { MyOrdersTab } from './views/MyOrdersTab';

const STORAGE_KEYS = {
  ITEMS: 'items',
  ORDERS: 'orders',
  COURIERS: 'couriers',
  ADDRESSES: 'addresses',
  NOTIFICATIONS: 'notifications',
  BIDS: 'bids',
  THEME: 'theme',
  LANG: 'lang',
  USER: 'user'
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) as AppUser : null;
    } catch (e) {
      console.warn('Failed to parse user from storage:', e);
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSideNavigationOpen, setIsSideNavigationOpen] = useState(false);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn('Failed to save user to storage:', e);
    }
  }, [currentUser]);

  // 1. Language State
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'ur';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  // 2. Theme State (Light / Dark mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 3. Navigation State
  const [currentTab, setCurrentTab] = useState<TabKey>('market');

  // 4. Search and Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 5. Products Data
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse items from storage:', e);
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to save items to storage:', e);
    }
  }, [products]);

  // 6. Orders Data
  const [orders, setOrders] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse orders from storage:', e);
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to storage:', e);
    }
  }, [orders]);

  // 7. Couriers Data
  const [couriers, setCouriers] = useState<CourierService[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURIERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse couriers from storage:', e);
    }
    return DEFAULT_COURIERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COURIERS, JSON.stringify(couriers));
    } catch (e) {
      console.warn('Failed to save couriers to storage:', e);
    }
  }, [couriers]);

  // 8. Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse addresses from storage:', e);
    }
    return INITIAL_SAVED_ADDRESSES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(savedAddresses));
    } catch (e) {
      console.warn('Failed to save addresses to storage:', e);
    }
  }, [savedAddresses]);

  // 9. Notifications Data
  const [notifications, setNotifications] = useState<ShippingNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse notifications:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications:', e);
    }
  }, [notifications]);

  const addNotification = (orderId: string, title: string, message: string) => {
    const newN: ShippingNotification = {
      id: `notif_${Date.now()}`,
      orderId,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  // 10. Bids Data
  const [bids, setBids] = useState<BidItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BIDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse bids:', e);
    }
    return INITIAL_BIDS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BIDS, JSON.stringify(bids));
    } catch (e) {
      console.warn('Failed to save bids:', e);
    }
  }, [bids]);

  // 11. Modals State
  const [orderModalProduct, setOrderModalProduct] = useState<ProductItem | null>(null);
  const [bidModalProduct, setBidModalProduct] = useState<ProductItem | null>(null);
  const [shippingLabelOrder, setShippingLabelOrder] = useState<OrderItem | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<OrderItem | null>(null);
  const [sellerShipmentOrder, setSellerShipmentOrder] = useState<OrderItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Handlers
  const handlePlaceBid = (newBid: BidItem) => {
    setBids((prev) => [newBid, ...prev]);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === newBid.productId
          ? {
              ...p,
              currentBid: Math.max(p.currentBid || 0, newBid.bidAmount),
              bidsCount: (p.bidsCount || 0) + 1
            }
          : p
      )
    );
    addNotification(
      newBid.id,
      'نئی بولی موصول ہوئی (New Bid)',
      `${newBid.bidderName} نے "${newBid.productTitle}" پر ₨ ${newBid.bidAmount.toLocaleString()} کی پیشکش دی ہے۔`
    );
  };

  const handleAcceptBid = (bidId: string) => {
    const targetBid = bids.find((b) => b.id === bidId);
    if (!targetBid) return;

    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'accepted' } : b))
    );

    const orderId = `ord_bid_${Date.now()}`;
    const dateFormatted = new Date().toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const acceptedOrder: OrderItem = {
      id: orderId,
      productId: targetBid.productId,
      productTitle: targetBid.productTitle,
      productPhoto: targetBid.productPhoto || '',
      category: 'craft',
      price: targetBid.bidAmount,
      quantity: 1,
      itemsPrice: targetBid.bidAmount,
      shippingFee: 200,
      totalPrice: targetBid.bidAmount + 200,
      buyerName: targetBid.bidderName,
      buyerPhone: targetBid.bidderPhone,
      buyerCity: targetBid.bidderCity,
      buyerArea: 'منظور شدہ بولی',
      buyerAddress: targetBid.message || 'پیشکش منظور ہونے پر خودکار سی او ڈی پارسل',
      sellerWhatsapp: targetBid.sellerWhatsapp,
      city: targetBid.bidderCity,
      date: dateFormatted,
      shippingStatus: 'confirmed',
      codStatus: 'pending',
      timeline: [
        {
          status: 'confirmed',
          titleUrdu: 'بولی منظور اور آرڈر تصدیق شدہ (Bid Accepted)',
          timestamp: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }) + ' · ' + dateFormatted,
          note: `سیلر نے ₨ ${targetBid.bidAmount.toLocaleString()} کی پیشکش قبول کر لی۔`
        }
      ]
    };

    setOrders((prev) => [acceptedOrder, ...prev]);
    addNotification(
      orderId,
      'پیشکش قبول شدہ - نیا آرڈر تیار',
      `آپ نے ${targetBid.bidderName} کی بولی قبول کر لی ہے۔ آرڈر #${orderId} پیک کرنے کے لیے تیار ہے۔`
    );
  };

  const handleDeclineBid = (bidId: string) => {
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: 'declined' } : b))
    );
  };

  // Handlers
  const handlePublishProduct = (newItem: ProductItem) => {
    setProducts((prev) => [newItem, ...prev]);
    setCurrentTab('myshop');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleOrderClick = (product: ProductItem) => {
    setOrderModalProduct(product);
  };

  const handleOrderPlaced = (newOrder: OrderItem) => {
    setOrders((prev) => [newOrder, ...prev]);
    addNotification(
      newOrder.id,
      'نیا آرڈر موصول ہوا (Order Placed)',
      `${newOrder.buyerName} نے "${newOrder.productTitle}" کا آرڈر دیا ہے (₨ ${newOrder.totalPrice.toLocaleString()})۔`
    );
  };

  const handleUpdateOrderShipment = (orderId: string, updates: Partial<OrderItem>) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updated = { ...o, ...updates };

        // Send in-app notification when status changes
        if (updates.shippingStatus && updates.shippingStatus !== o.shippingStatus) {
          const statusText =
            updates.shippingStatus === 'confirmed' ? 'آرڈر کی تصدیق ہو گئی ہے' :
            updates.shippingStatus === 'packed' ? 'پارسل پیک کر دیا گیا ہے' :
            updates.shippingStatus === 'shipped' ? `پارسل کورئیر (${updates.courierName || o.courierName}) کو روانہ کر دیا گیا ہے` :
            updates.shippingStatus === 'out_for_delivery' ? 'کورئیر رائیڈر پارسل لے کر ترسیل کے لیے روانہ ہے' :
            updates.shippingStatus === 'delivered' ? 'پارسل کی ترسیل مکمل اور کیش آن ڈیلیوری وصول ہو گئی ہے' :
            'ترسیل میں رکاوٹ پیش آئی ہے';

          addNotification(orderId, `آرڈر #${orderId} اپ ڈیٹ`, statusText);
        }

        return updated;
      })
    );

    // Update active modal order if open
    if (sellerShipmentOrder && sellerShipmentOrder.id === orderId) {
      setSellerShipmentOrder((prev) => (prev ? { ...prev, ...updates } : null));
    }
    if (trackingModalOrder && trackingModalOrder.id === orderId) {
      setTrackingModalOrder((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleCancelOrder = (orderId: string) => {
    handleUpdateOrderShipment(orderId, {
      shippingStatus: 'cancelled',
      status: 'منسوخ ❌',
      timeline: [
        ...(orders.find((o) => o.id === orderId)?.timeline || []),
        {
          status: 'cancelled',
          titleUrdu: 'خریدار نے آرڈر منسوخ کر دیا (Cancelled)',
          timestamp: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }),
          note: 'روانہ ہونے سے پہلے آرڈر منسوخ کیا گیا۔'
        }
      ]
    });
  };

  const handleRequestReturn = (orderId: string, reason: string, photoUrl?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    handleUpdateOrderShipment(orderId, {
      returnRequest: {
        reason,
        photoUrl,
        status: 'pending',
        requestedAt: new Date().toISOString()
      }
    });

    addNotification(
      orderId,
      'واپسی کی درخواست موصول',
      `خریدار نے آرڈر #${orderId} کی واپسی کی درخواست کی ہے۔`
    );
  };

  const handleAddCourier = (newCourier: CourierService) => {
    setCouriers((prev) => [...prev, newCourier]);
  };

  const handleToggleCourier = (id: string) => {
    setCouriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDeleteCourier = (id: string) => {
    setCouriers((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSaveNewAddress = (newAddr: SavedAddress) => {
    setSavedAddresses((prev) => [newAddr, ...prev]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotificationOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (ord) {
      setTrackingModalOrder(ord);
    }
  };

  const myItemsCount = products.filter((p) => p.isMine).length;
  const activeOrdersCount = orders.filter(
    (o) => o.shippingStatus !== 'delivered' && o.shippingStatus !== 'cancelled'
  ).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f4ee] dark:bg-[#121915] text-[#1c2420] dark:text-[#eef3f0] transition-colors duration-200">
      {/* Sticky Header with Title, Cultural Subtitle, Dark Mode, Notifications, Admin & Live Search */}
      <Header
        currentTab={currentTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        isSideNavigationOpen={isSideNavigationOpen}
        onOpenSideNavigation={() => setIsSideNavigationOpen(true)}
      />

      <SideNavigation
        isOpen={isSideNavigationOpen}
        currentLanguage={language}
        currentUserName={currentUser?.name}
        selectedCategory={selectedCategory}
        onClose={() => setIsSideNavigationOpen(false)}
        onSelectCategory={setSelectedCategory}
        onSelectTab={setCurrentTab}
        onOpenAccount={() => setIsAuthOpen(true)}
        onSignOut={() => setCurrentUser(null)}
        onLanguageChange={handleLanguageChange}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        currentUser={currentUser}
        onLoginSuccess={setCurrentUser}
        onLogout={() => {
          setCurrentUser(null);
          setIsAuthOpen(false);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {currentTab === 'market' && (
          <MarketTab
            products={products}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onOrder={handleOrderClick}
            onBid={(product) => setBidModalProduct(product)}
            onGoToSell={() => setCurrentTab('sell')}
          />
        )}

        {currentTab === 'sell' && (
          <SellTab onPublish={handlePublishProduct} />
        )}

        {currentTab === 'myshop' && (
          <MyShopTab
            products={products}
            orders={orders}
            couriers={couriers}
            bids={bids}
            onDeleteProduct={handleDeleteProduct}
            onGoToSell={() => setCurrentTab('sell')}
            onOpenShipmentModal={(order) => setSellerShipmentOrder(order)}
            onOpenShippingLabel={(order) => setShippingLabelOrder(order)}
            onAcceptBid={handleAcceptBid}
            onDeclineBid={handleDeclineBid}
            onBid={(product) => setBidModalProduct(product)}
          />
        )}

        {currentTab === 'orders' && (
          <MyOrdersTab
            orders={orders}
            couriers={couriers}
            bids={bids}
            onUpdateStatus={(orderId, status) =>
              handleUpdateOrderShipment(orderId, {
                shippingStatus: status,
                status: status === 'delivered' ? 'مال مل گیا ✅' : 'منسوخ ❌'
              })
            }
            onGoToMarket={() => setCurrentTab('market')}
            onOpenTrackingModal={(order) => setTrackingModalOrder(order)}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation (4 Tabs) */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        myItemsCount={myItemsCount}
        ordersCount={activeOrdersCount}
      />

      {/* Bid / Make an Offer Modal */}
      <BidModal
        product={bidModalProduct}
        isOpen={Boolean(bidModalProduct)}
        onClose={() => setBidModalProduct(null)}
        onPlaceBid={handlePlaceBid}
      />

      {/* Order Popup Modal */}
      <OrderModal
        product={orderModalProduct}
        isOpen={Boolean(orderModalProduct)}
        onClose={() => setOrderModalProduct(null)}
        onOrderPlaced={handleOrderPlaced}
        savedAddresses={savedAddresses}
        onSaveNewAddress={handleSaveNewAddress}
      />

      {/* Printable Shipping Label / Packing Slip Modal */}
      <ShippingLabelModal
        order={shippingLabelOrder}
        isOpen={Boolean(shippingLabelOrder)}
        onClose={() => setShippingLabelOrder(null)}
      />

      {/* Buyer Tracking Timeline & Returns Modal */}
      <TrackingTimelineModal
        order={trackingModalOrder}
        isOpen={Boolean(trackingModalOrder)}
        onClose={() => setTrackingModalOrder(null)}
        couriers={couriers}
        onCancelOrder={handleCancelOrder}
        onRequestReturn={handleRequestReturn}
      />

      {/* Seller Shipping Management Modal */}
      <SellerShipmentModal
        order={sellerShipmentOrder}
        isOpen={Boolean(sellerShipmentOrder)}
        onClose={() => setSellerShipmentOrder(null)}
        couriers={couriers}
        onUpdateShipment={handleUpdateOrderShipment}
        onOpenShippingLabel={(ord) => setShippingLabelOrder(ord)}
      />

      {/* Admin Logistics & Courier Management Modal */}
      <AdminShippingModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        couriers={couriers}
        orders={orders}
        products={products}
        bids={bids}
        onAddCourier={handleAddCourier}
        onToggleCourier={handleToggleCourier}
        onDeleteCourier={handleDeleteCourier}
      />

      {/* Real-time Order Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onSelectOrder={handleSelectNotificationOrder}
      />

      {/* Offline Status Alert for PWA */}
      <OfflineIndicator />
    </div>
  );
}
