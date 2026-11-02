import React from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Clock, Tag } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const { t, language } = useApp();

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'video_editing': return t('categoryVideo');
      case 'design': return t('categoryDesign');
      case 'writing_translation': return t('categoryWriting');
      case 'tutoring': return t('categoryTutoring');
      case 'repairs': return t('categoryRepairs');
      case 'handmade': return t('categoryHandmade');
      case 'used_items': return t('categoryUsed');
      case 'local_services': return t('categoryServices');
      default: return cat;
    }
  };

  const imageSrc = listing.images && listing.images.length > 0
    ? listing.images[0]
    : '/src/assets/images/peshawari_chappal_1793620850599.jpg';

  const isGig = listing.type === 'gig';

  return (
    <article
      onClick={onClick}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-emerald-500/60 hover:shadow-md transition-all cursor-pointer"
    >
      {/* Visual Canvas (4:3 aspect ratio) */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={imageSrc}
          alt={listing.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            // Styled graceful fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Quiet Type Tag on top corner */}
        <div className="absolute top-2.5 start-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md">
          {isGig ? (language === 'ur' ? 'آن لائن ہنر' : language === 'ps' ? 'آنلاین ګیګ' : 'Gig Service') : (language === 'ur' ? 'سامان / پراڈکٹ' : language === 'ps' ? 'توکی / سامان' : 'Product')}
        </div>

        {/* City tag on bottom corner */}
        <div className="absolute bottom-2.5 start-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md">
          <MapPin className="w-3 h-3 text-emerald-300" />
          <span>{listing.city}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator (Zero-Pill Rule) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span className="text-emerald-700 font-medium">
              {getCategoryLabel(listing.category)}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{listing.deliveryTime}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 mb-2 group-hover:text-emerald-800 transition-colors">
            {listing.title}
          </h3>
        </div>

        {/* Footer: Seller, Rating & Tabular Price */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
          {/* Seller mini bio */}
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={listing.sellerAvatar}
              alt={listing.sellerName}
              className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <span className="text-xs text-slate-700 font-medium truncate max-w-[100px] sm:max-w-[120px]">
              {listing.sellerName}
            </span>
          </div>

          {/* Rating & Price */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="tabular-nums">{listing.sellerRating.toFixed(1)}</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-800 tabular-nums">
              ₨ {listing.price.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
