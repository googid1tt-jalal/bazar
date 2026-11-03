import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing } from '../types';
import { X, ShieldCheck, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface OrderCheckoutModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: (orderId: string) => void;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  listing,
  isOpen,
  onClose,
  onConfirmed
}) => {
  const { createOrder, t, language } = useApp();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !listing) return null;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const order = createOrder(listing, notes);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmed(order.id);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">
              {language === 'ur' ? 'آرڈر کی تصدیق (محفوظ ایسکرو)' : language === 'ps' ? 'د آرډر تصدیق (خوندي پیسې)' : 'Confirm Order & Escrow'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleConfirmOrder} className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Item summary */}
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="font-bold text-slate-900 line-clamp-2 text-xs">
                {listing.title}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>{listing.sellerName}</span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-emerald-800 font-bold">
                  <Clock className="w-3 h-3" />
                  {listing.deliveryTime}
                </span>
              </div>
              <div className="text-sm font-extrabold text-emerald-950 tabular-nums">
                ₨ {listing.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Escrow note */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <span className="font-bold block">100% ایسکرو تحفظ:</span>
            <p className="text-[11px] leading-relaxed">
              اگلے مرحلے پر آپ جازکیش یا ایزی پیسہ سے رقم بھیج کر رسید جمع کروائیں گے۔ رقم پلیٹ فارم کے پاس محفوظ رہے گی اور سیلر کو صرف کام ملنے کے بعد دی جائے گی۔
            </p>
          </div>

          {/* Notes for Seller */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1 text-xs">
              سیلر کے لیے ہدایات یا تفصیل (اختیاری):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثلاً: سائز، پسندیدہ رنگ، یا کام کی ضروری شرائط..."
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              منسوخ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'جاری ہے...' : 'آرڈر جاری رکھیں'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
