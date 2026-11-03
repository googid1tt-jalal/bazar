import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from '../components/ListingCard';
import {
  Search,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  Video,
  Palette,
  FileText,
  GraduationCap,
  Wrench,
  Sparkles,
  ShoppingBag,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { ListingCategory } from '../types';

interface HomeViewProps {
  onSelectListing: (id: string) => void;
  onOpenBrowse: (category?: ListingCategory) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectListing, onOpenBrowse }) => {
  const { t, language, isRTL, listings, allUsers, setActiveTab, setSelectedChatUserId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredListings = listings.filter(l => l.status === 'approved').slice(0, 4);
  const topSellers = allUsers.filter(u => u.role !== 'admin').slice(0, 4);

  const categories = [
    { id: 'video_editing' as ListingCategory, name: t('categoryVideo'), icon: Video, color: 'bg-emerald-50 text-emerald-800' },
    { id: 'handmade' as ListingCategory, name: t('categoryHandmade'), icon: Sparkles, color: 'bg-amber-50 text-amber-800' },
    { id: 'design' as ListingCategory, name: t('categoryDesign'), icon: Palette, color: 'bg-blue-50 text-blue-800' },
    { id: 'writing_translation' as ListingCategory, name: t('categoryWriting'), icon: FileText, color: 'bg-teal-50 text-teal-800' },
    { id: 'tutoring' as ListingCategory, name: t('categoryTutoring'), icon: GraduationCap, color: 'bg-purple-50 text-purple-800' },
    { id: 'used_items' as ListingCategory, name: t('categoryUsed'), icon: ShoppingBag, color: 'bg-rose-50 text-rose-800' },
    { id: 'repairs' as ListingCategory, name: t('categoryRepairs'), icon: Wrench, color: 'bg-orange-50 text-orange-800' },
    { id: 'local_services' as ListingCategory, name: t('categoryServices'), icon: Briefcase, color: 'bg-indigo-50 text-indigo-800' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('browse');
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* 1. Hero Section - Pakistani Deep Emerald Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-emerald-950 text-white shadow-xl">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 px-5 py-8 sm:px-10 sm:py-14 max-w-4xl mx-auto text-center space-y-5">
          {/* Natural Editorial Heading */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'ur'
                ? 'جاز کیش و ایزی پیسہ ایسکرو پروٹیکشن'
                : language === 'ps'
                ? 'د جازکیش او ایزی پیسې ایسکرو ضمانت'
                : '100% Escrow Protection via JazzCash & Easypaisa'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white nastaliq-heading">
            {t('heroTitle')}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center max-w-xl mx-auto bg-white rounded-2xl p-1.5 shadow-lg border border-emerald-800"
          >
            <div className="flex items-center gap-2 flex-1 px-3 text-slate-400">
              <Search className="w-5 h-5 text-emerald-800 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full text-xs sm:text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-4 sm:px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
            >
              {language === 'ur' ? 'تلاش کریں' : language === 'ps' ? 'لټول' : 'Search'}
            </button>
          </form>

          {/* Quick Category Suggestions */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] text-emerald-200/90 pt-1">
            <span className="text-emerald-400 font-medium">
              {language === 'ur' ? 'مشہور تلاش:' : language === 'ps' ? 'مشهور لټون:' : 'Popular:'}
            </span>
            <button
              onClick={() => onOpenBrowse('video_editing')}
              className="hover:underline hover:text-white transition"
            >
              {t('categoryVideo')}
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenBrowse('handmade')}
              className="hover:underline hover:text-white transition"
            >
              {language === 'ur' ? 'پشاوری چپل' : language === 'ps' ? 'پېښورۍ څپلۍ' : 'Peshawari Chappal'}
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenBrowse('handmade')}
              className="hover:underline hover:text-white transition"
            >
              {language === 'ur' ? 'سواتی شال' : language === 'ps' ? 'سواتي شال' : 'Swati Shawl'}
            </button>
            <span>·</span>
            <button
              onClick={() => onOpenBrowse('writing_translation')}
              className="hover:underline hover:text-white transition"
            >
              {t('categoryWriting')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Category Carousel / Grid */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 nastaliq-heading">
            {t('allCategories')}
          </h2>
          <button
            onClick={() => onOpenBrowse()}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
          >
            <span>{t('viewAll')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onOpenBrowse(cat.id)}
                className="group p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-xs transition flex items-center gap-3 text-start cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-800 truncate">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'ur' ? 'اشتہارات دیکھیں' : language === 'ps' ? 'اعلانونه کتل' : 'Explore'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Listings (Both Services & Goods) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-xl font-bold text-slate-900 nastaliq-heading">
              {t('featuredListings')}
            </h2>
            <span className="hidden sm:inline-block text-xs text-slate-500">
              · {language === 'ur' ? 'ہنر اور سامان ایک جگہ' : language === 'ps' ? 'هنر او سامان یو ځای' : 'Services & Goods'}
            </span>
          </div>
          <button
            onClick={() => onOpenBrowse()}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
          >
            <span>{t('viewAll')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featuredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onClick={() => onSelectListing(listing.id)}
            />
          ))}
        </div>
      </section>

      {/* 4. Pakistani Community Trust & Escrow Strip */}
      <section className="bg-emerald-900 rounded-3xl p-6 sm:p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center shrink-0 text-amber-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base">
                {language === 'ur' ? '100% محفوظ مینوئل ایسکرو' : language === 'ps' ? 'سل په سلو کې خوندي پیسې' : '100% Secure Manual Escrow'}
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {language === 'ur'
                  ? 'خریدار جازکیش یا ایزی پیسہ کے ذریعے پلیٹ فارم کو رقم بھیجتا ہے۔ جب تک کام نہ ملے، رقم سیلر کو نہیں جاتی۔'
                  : language === 'ps'
                  ? 'پیرودونکی پیسې ادارې ته استوي، تر څو چې توکي ترلاسه نه شي، پلورونکي ته پیسې نه ورکول کیږي.'
                  : 'Buyers pay through JazzCash/Easypaisa. Funds are held safely until delivery is approved.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center shrink-0 text-emerald-300">
              <Zap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base">
                {language === 'ur' ? 'پشتون اور اردو بولنے والوں کا مرکز' : language === 'ps' ? 'د پښتنو او اردو ژبو ګډ مرکز' : 'Native Pashto & Urdu Marketplace'}
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {language === 'ur'
                  ? 'پشاور، کوئٹہ، سوات اور ملک بھر کے ہنر مندوں کے ساتھ اپنی زبان میں بات چیت اور ڈیلنگ۔'
                  : language === 'ps'
                  ? 'په پېښور، کوټه او سوات کې له باوري خلکو سره په خپله خوږه پښتو ژبه سوداګري.'
                  : 'Chat and transact directly with verified artisans and freelance talent across KP and Balochistan.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center shrink-0 text-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base">
                {language === 'ur' ? 'صرف 10 فیصد کمیشن' : language === 'ps' ? 'یوازې ۱۰٪ کمیشن' : 'Fair 10% Platform Commission'}
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                {language === 'ur'
                  ? 'فائیور کے 20 فیصد کے برعکس، ہنر بازار صرف 10 فیصد لیتا ہے تاکہ سیلر کو 90 فیصد پورا منافع ملے۔'
                  : language === 'ps'
                  ? 'پلورونکي ته ۹۰ سلنه پوره ګټه ورکول کیږي او یوازې ۱۰ سلنه د مارکیټ فیس دی.'
                  : 'Sellers keep 90% of order earnings with low 10% platform facilitation fee.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Top Rated Craftsmen & Sellers */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 nastaliq-heading">
            {t('topSellers')}
          </h2>
          <span className="text-xs text-slate-500">
            {language === 'ur' ? 'تصدیق شدہ ہنر مند' : language === 'ps' ? 'باوري هنرمندان' : 'Verified Artisans'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {topSellers.map((seller) => (
            <div
              key={seller.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xs transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {seller.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{seller.city}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      {seller.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2 mt-3 leading-relaxed">
                {seller.bio}
              </p>

              {/* Skills unboxed (Zero-pill) */}
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-2 truncate">
                {seller.skills.slice(0, 3).map((s, i) => (
                  <span key={i}>
                    {s}{i < Math.min(seller.skills.length - 1, 2) ? ' ·' : ''}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-800 font-semibold">
                  {seller.completedOrders} {t('ordersCompleted')}
                </span>
                <button
                  onClick={() => {
                    setSelectedChatUserId(seller.id);
                    setActiveTab('inbox');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition"
                >
                  {t('contactSeller')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
