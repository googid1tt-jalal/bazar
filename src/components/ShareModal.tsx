import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { X, Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';

interface ShareModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ listing, isOpen, onClose }) => {
  const { t, language, marketplaceName } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !listing) return null;

  const currentUrl = window.location.href;
  const shareText = language === 'ur'
    ? `ہنر بازار پر یہ اشتہار دیکھیں: "${listing.title}" - قیمت صرف ₨ ${listing.price.toLocaleString()} روپے! محفوظ ایسکرو ادائیگی کے ساتھ۔`
    : language === 'ps'
    ? `په هنر بازار کې دا وګورئ: "${listing.title}" - بیه: ₨ ${listing.price.toLocaleString()} روپۍ. د خوندي پیرودلو لپاره.`
    : `Check out "${listing.title}" on ${marketplaceName} for PKR ${listing.price.toLocaleString()}!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(`${shareText}\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleFacebook = () => {
    const encoded = encodeURIComponent(currentUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-sm sm:text-base">
              {t('shareListing')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-slate-900 text-xs truncate">
                {listing.title}
              </h4>
              <p className="text-[11px] font-bold text-emerald-800 mt-0.5 tabular-nums">
                ₨ {listing.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t('shareWhatsApp')}</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300/80 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{t('copiedLink')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>
                    {language === 'ur' ? 'لنک کاپی کریں' : language === 'ps' ? 'لینک کاپي کړئ' : 'Copy Share Link'}
                  </span>
                </>
              )}
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebook}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-blue-700 text-white font-semibold text-xs transition"
            >
              <Send className="w-4 h-4" />
              <span>Facebook Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
