import React, { useState } from 'react';
import { ProductItem, BidItem, PAKISTANI_CITIES } from '../types/market';
import { formatToPakistaniWhatsapp } from '../utils/helpers';
import { X, Gavel, DollarSign, Send, Sparkles, MessageCircle, User, Phone, MapPin } from 'lucide-react';

interface BidModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPlaceBid: (bid: BidItem) => void;
}

export const BidModal: React.FC<BidModalProps> = ({
  product,
  isOpen,
  onClose,
  onPlaceBid
}) => {
  if (!isOpen || !product) return null;

  const askingPrice = product.price;
  const currentBid = product.currentBid || Math.round(askingPrice * 0.9);

  const [bidAmount, setBidAmount] = useState<number>(currentBid);
  const [bidderName, setBidderName] = useState('');
  const [bidderPhone, setBidderPhone] = useState('');
  const [bidderCity, setBidderCity] = useState(PAKISTANI_CITIES[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Quick suggestion chips based on asking price
  const quickOffers = [
    { label: '85% آفر', amount: Math.round(askingPrice * 0.85) },
    { label: '90% آفر', amount: Math.round(askingPrice * 0.9) },
    { label: '95% آفر', amount: Math.round(askingPrice * 0.95) },
    { label: 'موجودہ +₨ 100', amount: (product.currentBid || askingPrice) + 100 }
  ];

  const handleSubmit = (sendWhatsApp: boolean) => {
    if (!bidderName.trim() || !bidderPhone.trim() || bidAmount <= 0) return;

    const newBid: BidItem = {
      id: `bid_${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productPhoto: product.photoUrl,
      askingPrice,
      bidAmount,
      bidderName: bidderName.trim(),
      bidderPhone: bidderPhone.trim(),
      bidderCity,
      message: message.trim() || undefined,
      status: 'pending',
      createdAt: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date().toLocaleDateString('ur-PK'),
      sellerWhatsapp: product.whatsapp
    };

    onPlaceBid(newBid);

    if (sendWhatsApp) {
      const phoneClean = formatToPakistaniWhatsapp(product.whatsapp);
      const text = `السلام علیکم! ہنر بازار پر آپ کے آئٹم "${product.title}" پر میں نے پیشکش / بولی لگائی ہے:
🔨 پیشکش رقم: ${bidAmount.toLocaleString()} روپے (مانگی گئی قیمت: ${askingPrice.toLocaleString()} روپے)
👤 نام: ${bidderName.trim()} (${bidderCity})
📞 رابطہ نمبر: ${bidderPhone.trim()}
${message.trim() ? `📝 پیغام: ${message.trim()}\n` : ''}کیا آپ کو یہ قیمت منظور ہے؟ کیش آن ڈیلیوری آرڈر فائنل کریں!`;

      const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950 overflow-hidden max-h-[92vh] flex flex-col animate-scale-up text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-[#0f5132] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#f4c542] text-[#0f5132]">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-nastaliq">
                دستکاری پر بولی / پیشکش لگائیں (Make an Offer)
              </h3>
              <p className="text-[11px] text-emerald-200">
                دستکار کو اپنی من پسند قیمت کی پیشکش بھیجیں
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Product Summary Box */}
          <div className="p-3 bg-[#f6f4ee] dark:bg-[#121915] rounded-2xl border border-slate-200 dark:border-emerald-950 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-[#1a241e] overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-emerald-900">
              {product.photoUrl ? (
                <img
                  src={product.photoUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">🧶</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                {product.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 text-[11px]">مانگی گئی قیمت:</span>
                <span className="font-black text-slate-800 dark:text-slate-200 tabular-nums">
                  ₨ {product.price.toLocaleString()}
                </span>
                {product.currentBid && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-[#f4c542] text-[10px] font-bold">
                    بلند ترین بولی: ₨ {product.currentBid.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bid Amount Input & Quick Offers */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>آپ کی پیشکش رقم (Your Bid in PKR):</span>
              <span className="text-[11px] text-[#0f5132] dark:text-[#f4c542] font-semibold">
                کیش آن ڈیلیوری پر قابل قبول
              </span>
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-400 font-bold">
                ₨
              </div>
              <input
                type="number"
                min="100"
                step="50"
                value={bidAmount || ''}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                placeholder="رقم درج کریں..."
                className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#141d18] font-bold text-base text-slate-900 dark:text-white tabular-nums focus:ring-2 focus:ring-[#0f5132] outline-none"
                required
              />
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-500">فوری تجاویز:</span>
              {quickOffers.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBidAmount(q.amount)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer ${
                    bidAmount === q.amount
                      ? 'bg-[#0f5132] text-white border-[#0f5132]'
                      : 'bg-slate-100 dark:bg-[#141d18] border-slate-200 dark:border-emerald-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {q.label} (₨ {q.amount.toLocaleString()})
                </button>
              ))}
            </div>
          </div>

          {/* Bidder Contact Fields */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-emerald-950">
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              آپ کے رابطے کی معلومات (Contact Details):
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                  آپ کا نام (Full Name) *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute start-2.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={bidderName}
                    onChange={(e) => setBidderName(e.target.value)}
                    placeholder="مثلاً: احمد خان"
                    className="w-full ps-8 pe-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#141d18] text-xs outline-none focus:ring-2 focus:ring-[#0f5132]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                  واٹس ایپ / موبائل نمبر *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute start-2.5 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={bidderPhone}
                    onChange={(e) => setBidderPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full ps-8 pe-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#141d18] text-xs font-mono outline-none focus:ring-2 focus:ring-[#0f5132]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                  شہر (City)
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute start-2.5 top-3 text-slate-400" />
                  <select
                    value={bidderCity}
                    onChange={(e) => setBidderCity(e.target.value)}
                    className="w-full ps-8 pe-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#141d18] text-xs outline-none focus:ring-2 focus:ring-[#0f5132]"
                  >
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">
                  کوئی خاص پیغام یا سائز (اختیاری)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="سائز 42، براؤن رنگ وغیرہ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-950 bg-white dark:bg-[#141d18] text-xs outline-none focus:ring-2 focus:ring-[#0f5132]"
                />
              </div>
            </div>
          </div>

          {/* Success Message Banner if submitted */}
          {submitted && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-center font-bold text-xs animate-bounce">
              🎉 پیشکش موصول ہو گئی! دستکار آپ سے جلد رابطہ کرے گا۔
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-emerald-950 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={!bidderName || !bidderPhone || bidAmount <= 0}
              className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98 disabled:opacity-50 cursor-pointer font-nastaliq"
            >
              <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
              <span>پیشکش واٹس ایپ پر بھیجیں (WhatsApp Bid)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={!bidderName || !bidderPhone || bidAmount <= 0}
              className="py-3 px-4 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-98 disabled:opacity-50 cursor-pointer font-nastaliq"
            >
              <Gavel className="w-4 h-4 text-[#f4c542]" />
              <span>پورٹل پر بولی محفوظ کریں</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
