import React, { useState } from 'react';
import { ProductItem, CATEGORIES, Language } from '../types/market';
import { shareProductListing, getProductTitle, getProductDescription, getProductCity } from '../utils/helpers';
import { t } from '../locales/translations';
import { MapPin, Trash2, Share2, Truck, Check, Gavel } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  currentLanguage?: Language;
  onOrder?: (product: ProductItem) => void;
  onBid?: (product: ProductItem) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentLanguage = 'ur',
  onOrder,
  onBid,
  onDelete,
  showDelete = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const categoryObj = CATEGORIES.find((c) => c.id === product.category) || {
    id: product.category,
    name: product.category,
    nameUrdu: product.category,
    namePashto: product.category,
    nameEnglish: product.category,
    emoji: '✨'
  };

  const categoryName =
    currentLanguage === 'ps'
      ? categoryObj.namePashto
      : currentLanguage === 'en'
      ? categoryObj.nameEnglish
      : categoryObj.nameUrdu;

  const productTitle = getProductTitle(product, currentLanguage);
  const productDescription = getProductDescription(product, currentLanguage);
  const productCity = getProductCity(product, currentLanguage);

  const hasPhoto = Boolean(product.photoUrl && !imageError);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await shareProductListing(product);
    if (result === 'copied') {
      setShareFeedback(currentLanguage === 'en' ? 'Link copied!' : 'لنک کاپی ہو گیا!');
    } else if (result === 'opened_wa') {
      setShareFeedback(currentLanguage === 'en' ? 'Shared to WhatsApp!' : 'واٹس ایپ پر شیئر!');
    } else {
      setShareFeedback(currentLanguage === 'en' ? 'Shared!' : 'شیئر ہو گیا!');
    }
    setTimeout(() => setShareFeedback(null), 2500);
  };

  const shippingFee = product.shippingFee ?? 200;

  return (
    <article className="flex flex-col bg-white dark:bg-[#1c2621] rounded-2xl border border-slate-200/90 dark:border-emerald-950/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden relative">
      {/* Photo Canvas (4:3 ratio) or 🧶 Yarn Placeholder */}
      <div className="relative aspect-4/3 w-full bg-[#f6f4ee] dark:bg-[#121915] overflow-hidden flex items-center justify-center">
        {hasPhoto ? (
          <img
            src={product.photoUrl}
            alt={productTitle}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-4">
            <span className="text-4xl sm:text-5xl select-none" role="img" aria-label="placeholder">
              🧶
            </span>
            <span className="text-[11px] font-medium text-slate-400 mt-1 font-nastaliq">
              {currentLanguage === 'ps' ? 'د توکي تصویر' : currentLanguage === 'en' ? 'Craft Photo' : 'دستکاری تصویر'}
            </span>
          </div>
        )}

        {/* Category Badge on Top-Right Corner */}
        <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
          <span>{categoryObj.emoji}</span>
          <span>{categoryName}</span>
        </div>

        {/* Share Button (Web Share API) on Top-Left Corner */}
        <button
          onClick={handleShare}
          className="absolute top-2.5 left-2.5 p-2 rounded-xl bg-white/90 hover:bg-white dark:bg-black/75 dark:hover:bg-black text-slate-800 dark:text-[#f4c542] shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1"
          title={t('shareListing', currentLanguage)}
          aria-label="Share product"
        >
          {shareFeedback ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Feedback pill if shared */}
        {shareFeedback && (
          <div className="absolute top-11 left-2.5 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md animate-fade-in z-10">
            {shareFeedback}
          </div>
        )}

        {/* City Tag on Bottom-Right */}
        <div className="absolute bottom-2.5 right-2.5 bg-[#0f5132]/90 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
          <MapPin className="w-3 h-3 text-[#f4c542]" />
          <span>📍 {productCity}</span>
        </div>

        {/* Shipping badge on Bottom-Left */}
        <div className="absolute bottom-2.5 left-2.5 bg-emerald-950/85 backdrop-blur-xs text-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Truck className="w-3 h-3 text-[#f4c542]" />
          <span>
            {shippingFee === 0
              ? t('freeDelivery', currentLanguage)
              : `${currentLanguage === 'en' ? 'Delivery:' : 'ترسیل:'} ₨ ${shippingFee}`}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Active Bid / Offer Indicator */}
          {product.currentBid ? (
            <div className="flex items-center justify-between text-[11px] bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-900/60 text-amber-900 dark:text-[#f4c542]">
              <span className="flex items-center gap-1 font-bold">
                <Gavel className="w-3 h-3 text-amber-700 dark:text-[#f4c542]" />
                <span>{t('highestBid', currentLanguage)}</span>
              </span>
              <span className="font-mono font-black tabular-nums">
                ₨ {product.currentBid.toLocaleString()} {product.bidsCount ? `(${product.bidsCount})` : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-400 font-bold">
              <Gavel className="w-3 h-3" />
              <span>{t('biddingFacility', currentLanguage)}</span>
            </div>
          )}

          {/* Title in current language */}
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2">
            {productTitle}
          </h3>

          {/* Price & Delivery Notice */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">
                {t('askingPrice', currentLanguage)}
              </span>
              <div className="text-base sm:text-lg font-extrabold text-[#0f5132] dark:text-[#f4c542] tabular-nums">
                ₨ {product.price.toLocaleString()} {currentLanguage === 'ps' ? 'روپۍ' : currentLanguage === 'en' ? 'PKR' : 'روپے'}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 text-end font-medium">
              {t('codNotice', currentLanguage)}
            </div>
          </div>

          {/* Short description in current language */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {productDescription}
          </p>
        </div>

        {/* Bottom Actions with Bidder Button & Order Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-emerald-950/60 flex items-center gap-2">
          {showDelete ? (
            <button
              onClick={() => onDelete && onDelete(product.id)}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer font-nastaliq"
            >
              <Trash2 className="w-4 h-4" />
              <span>{currentLanguage === 'en' ? 'Delete' : 'حذف کریں (Delete)'}</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 w-full">
              {/* Bidder Button */}
              <button
                onClick={() => onBid && onBid(product)}
                className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 text-[#0f5132] dark:text-[#f4c542] border border-emerald-300 dark:border-emerald-800 font-extrabold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer font-nastaliq shadow-2xs hover:shadow-xs active:scale-95"
                title="دستکار کو اپنی من پسند قیمت کی پیشکش بھیجیں"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>{t('bidBtn', currentLanguage)}</span>
              </button>

              {/* Instant Buy / Order Button */}
              <button
                onClick={() => onOrder && onOrder(product)}
                className="py-2.5 px-2 rounded-xl bg-[#f4c542] hover:bg-[#e5b634] active:scale-95 text-[#0f5132] font-black text-xs transition flex items-center justify-center gap-1 cursor-pointer shadow-xs font-nastaliq"
              >
                <span>{t('orderBtn', currentLanguage)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
