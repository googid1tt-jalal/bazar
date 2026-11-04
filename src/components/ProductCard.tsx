import React, { useState } from 'react';
import { ProductItem, CATEGORIES, Language } from '../types/market';
import { shareProductListing, getProductTitle, getProductDescription, getProductCity } from '../utils/helpers';
import { t } from '../locales/translations';
import { MapPin, Trash2, Share2, Truck, Check, Gavel, QrCode } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  currentLanguage?: Language;
  onOrder?: (product: ProductItem) => void;
  onBid?: (product: ProductItem) => void;
  onOpenQR?: (product: ProductItem) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentLanguage = 'ur',
  onOrder,
  onBid,
  onOpenQR,
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

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.source !== 'own' && product.productUrl) {
      window.open(product.productUrl, '_blank', 'noopener,noreferrer,sponsored');
    } else if (onOrder) {
      onOrder(product);
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'daraz': return 'دراز پر خریدیں';
      case 'amazon': return 'ایمیزون پر خریدیں';
      case 'markaz': return 'مرکز پر خریدیں';
      case 'alibaba': return 'علی بابا پر خریدیں';
      default: return t('orderBtn', currentLanguage);
    }
  };

  return (
    <article className="flex flex-col bg-white dark:bg-[#1c2621] rounded-2xl border border-slate-200/90 dark:border-emerald-950/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden relative">
      <div className="relative aspect-4/3 w-full bg-[#f6f4ee] dark:bg-[#121915] overflow-hidden flex items-center justify-center">
        {product.photoUrl ? (
          <img src={product.photoUrl} alt={productTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="text-4xl">🧶</div>
        )}
        {product.source !== 'own' && (
          <div className="absolute top-2.5 right-2.5 bg-amber-400 text-[#0f5132] text-[10px] font-black px-2 py-0.5 rounded-lg capitalize">
            {product.source}
          </div>
        )}
      </div>
      <div className="p-3.5 space-y-2">
        <h3 className="font-bold text-sm line-clamp-2">{productTitle}</h3>
        <div className="text-lg font-extrabold text-[#0f5132]">₨ {product.price.toLocaleString()}</div>
        <button
          onClick={handleBuy}
          className="w-full py-2 rounded-xl bg-[#f4c542] hover:bg-[#e5b634] text-[#0f5132] font-black text-xs cursor-pointer"
        >
          {getSourceLabel(product.source)}
        </button>
      </div>
    </article>
  );
};
