import { User, Listing, Order, ChatMessage, Report, AppNotification } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin',
    name: 'Zia Khan (Platform Admin)',
    email: 'admin@hunarbazaar.pk',
    phone: '0300-1234567',
    role: 'admin',
    city: 'Peshawar',
    bio: 'Platform Administrator & Escrow Officer at Hunar Bazaar Pakistan.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['Platform Management', 'Escrow Verification', 'Community Dispute Resolution'],
    rating: 5.0,
    reviewCount: 120,
    completedOrders: 150,
    createdAt: '2025-01-10',
    isVerified: true,
    jazzcashAccount: '0300-1234567 (Zia Khan)',
    easypaisaAccount: '0300-1234567 (Zia Khan)'
  },
  {
    id: 'user_kamran',
    name: 'Kamran Bangash',
    email: 'kamran.video@gmail.com',
    phone: '0313-9876543',
    role: 'user',
    city: 'Peshawar',
    bio: 'پروفیشنل ویڈیو ایڈیٹر اور کلر گریڈسٹ۔ پشتو، اردو اور انگریزی یوٹیوب پوڈکاسٹس اور وی لاگز کی ایڈیٹنگ۔',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['Premiere Pro', 'DaVinci Resolve', 'Pashto Subtitles', 'Urdu Typography', 'Color Grading'],
    rating: 4.9,
    reviewCount: 48,
    completedOrders: 62,
    createdAt: '2025-03-12',
    isVerified: true,
    jazzcashAccount: '0313-9876543 (Kamran)',
    easypaisaAccount: '0313-9876543 (Kamran)'
  },
  {
    id: 'user_arsalan',
    name: 'Ustad Arsalan Khan',
    email: 'arsalan.leather@gmail.com',
    phone: '0321-5551234',
    role: 'user',
    city: 'Peshawar',
    bio: 'اصلی چمڑے کی روایتی پشاور کی مشہور چپل، کپتان چپل اور زلمی چپل کا دستکار۔ 35 سالہ خاندانی تجربہ۔',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['Handmade Leather', 'Peshawari Chappal', 'Custom Sizing', 'Tyre Sole Crafting'],
    rating: 4.9,
    reviewCount: 92,
    completedOrders: 135,
    createdAt: '2025-02-01',
    isVerified: true,
    jazzcashAccount: '0321-5551234 (Arsalan Khan)'
  },
  {
    id: 'user_gul_mina',
    name: 'Gul Mina Swati',
    email: 'gulmina.crafts@gmail.com',
    phone: '0345-7778899',
    role: 'user',
    city: 'Swat',
    bio: 'سواتی خواتین کی دستکاری، خالص بھیڑ کی اون سے بنی کڑھائی والی شالیں، واسکٹ اور روایتی کشیدہ کاری۔',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    skills: ['Hand Embroidery', 'Swati Shawls', 'Wool Weaving', 'Traditional Motifs'],
    rating: 5.0,
    reviewCount: 38,
    completedOrders: 44,
    createdAt: '2025-04-15',
    isVerified: true,
    easypaisaAccount: '0345-7778899 (Gul Mina)'
  },
  {
    id: 'user_wali',
    name: 'Wali Muhammad Khattak',
    email: 'wali.honey@gmail.com',
    phone: '0333-4442211',
    role: 'user',
    city: 'Karak',
    bio: 'خیبر پختونخوا کے پہاڑوں سے اتارا گیا 100% خالص بیری (سدر) کا شہد۔ قدرتی، غیر پروسیس شدہ اور خالص۔',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    skills: ['Organic Honey', 'Sidr Berry', 'Laboratory Tested', 'Pure Wild Harvest'],
    rating: 4.9,
    reviewCount: 71,
    completedOrders: 89,
    createdAt: '2025-01-20',
    isVerified: true,
    jazzcashAccount: '0333-4442211 (Wali Muhammad)'
  },
  {
    id: 'user_faiza',
    name: 'Faiza Kakar',
    email: 'faiza.tutoring@gmail.com',
    phone: '0312-3339900',
    role: 'user',
    city: 'Quetta',
    bio: 'آن لائن اردو و پشتو زبان کی تدریس، تجوید کے ساتھ قرآن فہمی، اور تعلیمی مضامین کی پرائیویٹ ٹیوشن۔',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    skills: ['Pashto Teaching', 'Urdu Grammar', 'Online Quran Tajweed', 'Academic Tutoring'],
    rating: 5.0,
    reviewCount: 29,
    completedOrders: 42,
    createdAt: '2025-03-01',
    isVerified: true
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'list_video_edit',
    sellerId: 'user_kamran',
    sellerName: 'Kamran Bangash',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerCity: 'Peshawar',
    type: 'gig',
    category: 'video_editing',
    title: 'پشتو اور اردو یوٹیوب ویڈیوز و پوڈکاسٹ کی سنیماٹک ایڈیٹنگ',
    description: 'میں آپ کی یوٹیوب ویڈیوز، ٹک ٹاک، ریلز اور انٹرویوز کی پروفیشنل ایڈیٹنگ کروں گا۔ اس میں ساؤنڈ ڈیزائن، رنگوں کی ترتیب (Color Grading)، خوبصورت نستعلیق اردو اور پشتو سب ٹائٹلز، اور دلچسپ اینیمیشنز شامل ہیں۔ 4K اور Full HD کوالٹی کی بروقت ترسیل۔',
    price: 3500,
    images: [
      '/src/assets/images/video_editor_gig_1793620851205.jpg'
    ],
    videoUrl: 'https://www.youtube.com',
    deliveryTime: '24 گھنٹے',
    city: 'Peshawar',
    status: 'approved',
    createdAt: '2026-10-20',
    featured: true,
    reviews: [
      {
        id: 'rev_1',
        buyerId: 'user_faiza',
        buyerName: 'Faiza Kakar',
        buyerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'ڈیرہ مننہ کامران صیب! بہترین ایڈیٹنگ او پر وخت سپارل. بہت باکمال کام۔',
        createdAt: '2026-10-24'
      },
      {
        id: 'rev_2',
        buyerId: 'user_wali',
        buyerName: 'Wali Muhammad',
        buyerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'بہت شاندار کام، ساؤنڈ اور نستعلیق فونٹس کا انتخاب زبردست تھا۔',
        createdAt: '2026-10-28'
      }
    ]
  },
  {
    id: 'list_chappal',
    sellerId: 'user_arsalan',
    sellerName: 'Ustad Arsalan Khan',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerCity: 'Peshawar',
    type: 'product',
    category: 'handmade',
    title: 'اصلی نمک منڈی پشاوری چپل (خالص لیدر اور مضبوط ٹائر سول)',
    description: 'پشاور کی تاریخی نمک منڈی کی تیار کردہ خالص گائے کے چمڑے کی روایتی چپل۔ آرام دہ کشن، ڈبل سلائی اور پائیدار ہوائی ٹائر کا سول۔ تمام سائز دستیاب ہیں (6 سے 11 تک)۔ پاکستان بھر میں محفوظ ڈیلیوری۔',
    price: 4800,
    images: [
      '/src/assets/images/peshawari_chappal_1793620850599.jpg'
    ],
    deliveryTime: '2 تا 3 دن',
    city: 'Peshawar',
    status: 'approved',
    createdAt: '2026-10-18',
    featured: true,
    reviews: [
      {
        id: 'rev_3',
        buyerId: 'user_kamran',
        buyerName: 'Kamran Bangash',
        buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'چمڑے کا معیار لاجواب ہے۔ سائز بالکل پرفیکٹ آیا۔ شکریہ استاد جی!',
        createdAt: '2026-10-22'
      }
    ]
  },
  {
    id: 'list_swat_shawl',
    sellerId: 'user_gul_mina',
    sellerName: 'Gul Mina Swati',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    sellerRating: 5.0,
    sellerCity: 'Swat',
    type: 'product',
    category: 'handmade',
    title: 'خالص اون سے بنی روایتی سواتی کڑھائی والی شال (ہاتھ کی بنی)',
    description: 'سوات کی باصلاحیت خواتین کی ہاتھ کی کشیدہ کاری سے سجی اون کی پرتعیش شال۔ سردیوں کے لیے انتہائی گرم، خوبصورت جیومیٹرک رنگین نقش و نگار اور پائیدار جھالر۔ تحفے کے لیے شاندار انتخاب۔',
    price: 7500,
    images: [
      '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg'
    ],
    deliveryTime: '3 تا 4 دن',
    city: 'Swat',
    status: 'approved',
    createdAt: '2026-10-22',
    featured: true,
    reviews: [
      {
        id: 'rev_4',
        buyerId: 'user_faiza',
        buyerName: 'Faiza Kakar',
        buyerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'ډیره ښکلې او ګرمه شال ده، رنګونه او ګلونه یې ډیر صفا دي.',
        createdAt: '2026-10-25'
      }
    ]
  },
  {
    id: 'list_sidr_honey',
    sellerId: 'user_wali',
    sellerName: 'Wali Muhammad Khattak',
    sellerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerCity: 'Karak',
    type: 'product',
    category: 'handmade',
    title: 'کرک کے پہاڑوں کا 100% خالص قدرتی بیری (سدر) کا شہد - 1 کلو',
    description: 'کرک اور کوہاٹ کے پہاڑی جنگلات سے حاصل کردہ خالص بیری کا شہد۔ بغیر کسی مصنوعی چینی یا ملاوٹ کے۔ لیبارٹری ٹیسٹ شدہ۔ قوتِ مدافعت اور صحت کے لیے بے مثل تحفہ۔',
    price: 3200,
    images: [
      '/src/assets/images/sidr_honey_jar_1793620854016.jpg'
    ],
    deliveryTime: '2 تا 3 دن',
    city: 'Karak',
    status: 'approved',
    createdAt: '2026-10-24',
    featured: true,
    reviews: [
      {
        id: 'rev_5',
        buyerId: 'user_arsalan',
        buyerName: 'Ustad Arsalan Khan',
        buyerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'خالص شہد کی خوشبو اور ذائقہ الگ ہی ہے۔ بہت مطمئن ہوں۔',
        createdAt: '2026-10-27'
      }
    ]
  },
  {
    id: 'list_tutoring',
    sellerId: 'user_faiza',
    sellerName: 'Faiza Kakar',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    sellerRating: 5.0,
    sellerCity: 'Quetta',
    type: 'gig',
    category: 'tutoring',
    title: 'آن لائن پشتو اور اردو زبان سکھانے کی کلاسز مع تجوید قرآن',
    description: 'بیرون ملک یا پاکستان میں مقیم بچوں اور بڑوں کے لیے پشتو بول چال، نستعلیق اردو لکھنا پڑھنا، اور تجوید کے ساتھ قرآنی احکام سیکھنے کی خصوصی آن لائن ون آن ون کلاسز۔ لچکدار اوقات۔',
    price: 5000,
    images: [
      '/src/assets/images/tutor_learning_session_1793620852755.jpg'
    ],
    deliveryTime: 'ہفتہ وار شیڈول',
    city: 'Quetta',
    status: 'approved',
    createdAt: '2026-10-26',
    featured: true,
    reviews: [
      {
        id: 'rev_6',
        buyerId: 'user_kamran',
        buyerName: 'Kamran Bangash',
        buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'استادہ بہت صبر اور مہارت سے پڑھاتی ہیں۔ بچے بہت خوش ہیں۔',
        createdAt: '2026-10-30'
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    listingId: 'list_video_edit',
    listingTitle: 'پشتو اور اردو یوٹیوب ویڈیوز و پوڈکاسٹ کی سنیماٹک ایڈیٹنگ',
    listingImage: '/src/assets/images/video_editor_gig_1793620851205.jpg',
    sellerId: 'user_kamran',
    sellerName: 'Kamran Bangash',
    sellerPhone: '0313-9876543',
    buyerId: 'user_faiza',
    buyerName: 'Faiza Kakar',
    buyerPhone: '0312-3339900',
    amount: 3500,
    platformFee: 350,
    sellerPayout: 3150,
    status: 'payment_submitted',
    payoutStatus: 'unpaid',
    paymentMethod: 'jazzcash',
    transactionId: 'JC-8839210492',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    buyerNotes: 'براہ کرم پوڈکاسٹ کے شروع میں پشتو میں ویلکم اینیمیشن شامل کریں۔',
    createdAt: '2026-11-01T10:30:00Z'
  },
  {
    id: 'ord_102',
    listingId: 'list_chappal',
    listingTitle: 'اصلی نمک منڈی پشاوری چپل (خالص لیدر اور مضبوط ٹائر سول)',
    listingImage: '/src/assets/images/peshawari_chappal_1793620850599.jpg',
    sellerId: 'user_arsalan',
    sellerName: 'Ustad Arsalan Khan',
    sellerPhone: '0321-5551234',
    buyerId: 'user_kamran',
    buyerName: 'Kamran Bangash',
    buyerPhone: '0313-9876543',
    amount: 4800,
    platformFee: 480,
    sellerPayout: 4320,
    status: 'completed',
    payoutStatus: 'ready_for_release',
    paymentMethod: 'easypaisa',
    transactionId: 'EP-4491028471',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    buyerNotes: 'سائز 9 برائے کرم بھیجئے گا۔',
    createdAt: '2026-10-28T14:15:00Z',
    deliveredAt: '2026-10-30T16:00:00Z',
    completedAt: '2026-10-31T09:00:00Z',
    reviewSubmitted: true
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    conversationId: 'conv_kamran_faiza',
    listingId: 'list_video_edit',
    senderId: 'user_faiza',
    senderName: 'Faiza Kakar',
    recipientId: 'user_kamran',
    text: 'السلام علیکم بھائی! کیا آپ 15 منٹ کے پوڈکاسٹ کے ساتھ پشتو کیپشنز شامل کر سکتے ہیں؟',
    timestamp: '2026-11-01T09:12:00Z',
    read: true
  },
  {
    id: 'msg_2',
    conversationId: 'conv_kamran_faiza',
    listingId: 'list_video_edit',
    senderId: 'user_kamran',
    senderName: 'Kamran Bangash',
    recipientId: 'user_faiza',
    text: 'وعلیکم السلام بہن! جی بالکل، میں واضح اور خوبصورت پشتو رسم الخط میں کیپشنز بناتا ہوں۔ آپ آرڈر کر دیں۔',
    timestamp: '2026-11-01T09:16:00Z',
    read: true
  },
  {
    id: 'msg_3',
    conversationId: 'conv_kamran_faiza',
    listingId: 'list_video_edit',
    senderId: 'user_faiza',
    senderName: 'Faiza Kakar',
    recipientId: 'user_kamran',
    text: 'ډیره مننه وروره، ما په جازکیش پيسې واستولې او رسید مې اپلوډ کړ.',
    timestamp: '2026-11-01T10:32:00Z',
    read: false
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep_1',
    reporterId: 'user_faiza',
    reporterName: 'Faiza Kakar',
    targetType: 'listing',
    targetId: 'list_sample_fake',
    targetName: 'مشکوک موبائل فون اشتہار',
    reason: 'غیر حقیقی قیمت اور مشتبہ رابطہ',
    details: 'سیلر نے مارکیٹ ریٹ سے 70 فیصد کم قیمت لکھی ہے اور ایڈوانس رقم ذاتی اکاؤنٹ میں مانگ رہا ہے۔',
    status: 'pending',
    createdAt: '2026-11-01T12:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_kamran',
    title: 'نیا آرڈر موصول ہوا!',
    message: 'فائزہ کاکڑ نے آپ کے گگ "ویڈیو ایڈیٹنگ" کا آرڈر دیا ہے۔ تصدیق کا انتظار ہے۔',
    type: 'order',
    linkTarget: 'orders',
    read: false,
    createdAt: '2026-11-01T10:31:00Z'
  },
  {
    id: 'notif_2',
    userId: 'user_admin',
    title: 'نئی ایسکرو ادائیگی تصدیق طلب',
    message: 'آرڈر #ord_101 کے لیے جازکیش کی رسید جمع کرائی گئی ہے۔ تصدیق کریں۔',
    type: 'payment',
    linkTarget: 'admin',
    read: false,
    createdAt: '2026-11-01T10:32:00Z'
  }
];
