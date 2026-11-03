import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  Truck,
  Heart,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface ListingDetailViewProps {
  listingId: string;
  onBack: () => void;
  onOrder: (listing: Listing) => void;
  onShare: (listing: Listing) => void;
  onReport: (listing: Listing) => void;
}

export const ListingDetailView: React.FC<ListingDetailViewProps> = ({
  listingId,
  onBack,
  onOrder,
  onShare,
  onReport
}) => {
  const { listings, allUsers, t, language, isRTL, setActiveTab, setSelectedChatUserId } = useApp();

  const listing = listings.find((l) => l.id === listingId);
  const seller = allUsers.find((u) => u.id === listing?.sellerId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!listing) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-slate-500 text-sm">Listing not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold"
        >
          {language === 'ur' ? 'واپس جائیں' : language === 'ps' ? 'شاته تګ' : 'Go Back'}
        </button>
      </div>
    );
  }

  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const isGig = listing.type === 'gig';
  const currentImage = listing.images[selectedImageIndex] || listing.images[0];

  const handleStartChat = () => {
    setSelectedChatUserId(listing.sellerId);
    setActiveTab('inbox');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Back Button & Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800 transition py-1.5"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{language === 'ur' ? 'تمام اشتہارات' : language === 'ps' ? 'ټول اعلانونه' : 'Back to Listings'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShare(listing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('shareListing')}</span>
          </button>
          <button
            onClick={() => onReport(listing)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 shadow-xs transition"
            title="Report this listing"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column (7 cols): Gallery & Description & Reviews */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Image (4:3 aspect ratio) */}
          <div className="space-y-3">
            <div className="relative aspect-4/3 w-full bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <img
                src={currentImage}
                alt={listing.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 start-3 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-md">
                {isGig ? (language === 'ur' ? 'آن لائن ہنر (Gig)' : language === 'ps' ? 'آنلاین خدمت' : 'Online Gig') : (language === 'ur' ? 'سامان / مصنوعات' : language === 'ps' ? 'توکی / سامان' : 'Physical Product')}
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {listing.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      selectedImageIndex === idx ? 'border-emerald-700 scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* About / Description Box */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 nastaliq-heading">
              {t('aboutGig')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            {listing.videoUrl && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-800">
                <span className="font-medium">
                  {language === 'ur' ? 'ویڈیو پورٹ فولیو منسلک ہے' : language === 'ps' ? 'د ویډیو پورټ فولیو لینک' : 'Video Sample / Portfolio'}
                </span>
                <a
                  href={listing.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline font-semibold"
                >
                  <span>{language === 'ur' ? 'دیکھیں' : language === 'ps' ? 'کتل' : 'View'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Ratings & Reviews Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 nastaliq-heading">
                {t('reviewsCount')} ({listing.reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="tabular-nums">{listing.sellerRating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {listing.reviews.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">{t('noReviews')}</p>
            ) : (
              <div className="space-y-3.5 divide-y divide-slate-100">
                {listing.reviews.map((rev) => (
                  <div key={rev.id} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.buyerAvatar}
                          alt={rev.buyerName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-semibold text-slate-900 text-xs">
                          {rev.buyerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'fill-amber-400 stroke-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 ps-9 leading-relaxed">
                      {rev.comment}
                    </p>
                    <span className="text-[10px] text-slate-400 ps-9 block">
                      {rev.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Price Box, Escrow Assurance, Seller Profile */}
        <div className="lg:col-span-5 space-y-5">
          {/* Action / Pricing Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-emerald-700/60 shadow-md space-y-4 sticky top-20">
            {/* Header: Title & Price */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{listing.city}</span>
                <span>·</span>
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>{listing.deliveryTime}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {listing.title}
              </h1>
            </div>

            {/* Price in Tabular figures */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 font-medium block">
                  {language === 'ur' ? 'کل رقم (پاکستانی روپے)' : language === 'ps' ? 'ټولې پیسې (روپۍ)' : 'Total Price (PKR)'}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tabular-nums">
                  ₨ {listing.price.toLocaleString()}
                </span>
              </div>
              <div className="text-end">
                <span className="text-[11px] text-emerald-700 font-medium block">
                  {t('deliveryIn')}
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  {listing.deliveryTime}
                </span>
              </div>
            </div>

            {/* Escrow Guarantee Pill (Zero-pill text notice) */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {language === 'ur'
                  ? 'رقم ہنر بازار ایسکرو میں محفوظ رہے گی تاوقتیکہ کام مکمل اور تسلی بخش نہ ہو۔'
                  : language === 'ps'
                  ? 'ستاسو پیسې په ایسکرو کې خوندي دي تر څو چې کار بشپړ نه شي.'
                  : '100% Escrow safe: payment is only released to the seller after your confirmation.'}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onOrder(listing)}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-sm transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{t('orderNow')}</span>
              </button>

              <button
                onClick={handleStartChat}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>{t('contactSeller')}</span>
              </button>
            </div>
          </div>

          {/* Seller Profile Card */}
          {seller && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 nastaliq-heading">
                {t('sellerInfo')}
              </h3>

              <div className="flex items-center gap-3">
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {seller.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{seller.city}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      {seller.rating.toFixed(1)} ({seller.reviewCount})
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {seller.bio}
              </p>

              {/* Trust Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">{t('ordersCompleted')}</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {seller.completedOrders}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">{t('memberSince')}</span>
                  <span className="font-bold text-slate-900">{seller.createdAt}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  {t('skills')}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
                  {seller.skills.map((skill, i) => (
                    <span key={i}>
                      {skill}{i < seller.skills.length - 1 ? ' ·' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
