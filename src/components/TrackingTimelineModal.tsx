import React, { useState } from 'react';
import { OrderItem, CourierService, DEFAULT_COURIERS } from '../types/market';
import {
  X,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  Ban,
  MapPin,
  Phone
} from 'lucide-react';

interface TrackingTimelineModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  couriers: CourierService[];
  onCancelOrder: (orderId: string) => void;
  onRequestReturn: (orderId: string, reason: string, photoUrl?: string) => void;
}

export const TrackingTimelineModal: React.FC<TrackingTimelineModalProps> = ({
  order,
  isOpen,
  onClose,
  couriers,
  onCancelOrder,
  onRequestReturn
}) => {
  if (!isOpen || !order) return null;

  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnReason, setReturnReason] = useState('defect');
  const [returnDetails, setReturnDetails] = useState('');
  const [returnPhoto, setReturnPhoto] = useState('');

  const courier = couriers.find((c) => c.id === order.courierId) ||
    DEFAULT_COURIERS.find((c) => c.id === order.courierId);

  const trackingUrl = (courier?.trackingUrlTemplate && order.trackingNumber)
    ? `${courier.trackingUrlTemplate}${order.trackingNumber}`
    : null;

  // 6 standard timeline stages
  const stages = [
    { key: 'placed', labelUrdu: 'آرڈر موصول (Placed)', icon: Clock },
    { key: 'confirmed', labelUrdu: 'تصدیق شدہ (Confirmed)', icon: CheckCircle2 },
    { key: 'packed', labelUrdu: 'پیک ہو گیا (Packed)', icon: Package },
    { key: 'shipped', labelUrdu: 'روانہ ہو گیا (Shipped)', icon: Truck },
    { key: 'out_for_delivery', labelUrdu: 'ترسیل کے لیے روانہ (Out for Delivery)', icon: Truck },
    { key: 'delivered', labelUrdu: 'ترسیل مکمل (Delivered)', icon: CheckCircle2 }
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'placed': return 0;
      case 'confirmed': return 1;
      case 'packed': return 2;
      case 'shipped': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(order.shippingStatus);
  const isCancellable = order.shippingStatus === 'placed' || order.shippingStatus === 'confirmed';
  const isDelivered = order.shippingStatus === 'delivered';

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnDetails.trim()) return;
    const fullReason = `${returnReason === 'defect' ? 'خرابی یا نقص' : returnReason === 'wrong_size' ? 'سائز درست نہیں' : 'تصویر سے مختلف'}: ${returnDetails.trim()}`;
    onRequestReturn(order.id, fullReason, returnPhoto || undefined);
    setShowReturnForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950 overflow-hidden max-h-[92vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-[#0f5132] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#f4c542]" />
            <h3 className="font-bold text-base sm:text-lg font-nastaliq">
              آرڈر ٹریکنگ و ترسیل کی حالت
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Order Header info */}
          <div className="p-3 bg-[#f6f4ee] dark:bg-[#121915] rounded-2xl border border-slate-200 dark:border-emerald-950 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                آرڈر نمبر #{order.id}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {order.productTitle}
              </h4>
            </div>
            <div className="text-end">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                کیش آن ڈیلیوری:
              </span>
              <span className="text-sm font-extrabold text-[#0f5132] dark:text-[#f4c542] tabular-nums">
                ₨ {order.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Courier Card with Live Tracking Link */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold block">
                  کورئیر سروس:
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {order.courierName || 'سیلر کورئیر کا انتخاب کر رہا ہے'}
                </span>
              </div>

              {order.trackingNumber && (
                <div className="text-end">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold block">
                    ٹریکنگ نمبر (CN):
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-emerald-900 dark:text-[#f4c542]">
                    {order.trackingNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Courier Tracking Button */}
            {trackingUrl ? (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <span>کورئیر کی ویب سائٹ پر ٹریک کریں</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#f4c542]" />
              </a>
            ) : order.trackingNumber ? (
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                ٹریکنگ نمبر {order.trackingNumber} کورئیر کے سسٹم میں درج ہے۔
              </div>
            ) : null}
          </div>

          {/* 6-Stage Visual Timeline */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-nastaliq">
              ترسیل کے مراحل (Delivery Timeline):
            </h4>

            <div className="space-y-2 relative pr-4 border-r-2 border-emerald-200 dark:border-emerald-900">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                const Icon = stage.icon;

                return (
                  <div key={stage.key} className="relative flex items-center gap-3">
                    {/* Step indicator circle */}
                    <div
                      className={`absolute -right-[23px] w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#f4c542] text-[#0f5132] ring-4 ring-emerald-100 dark:ring-emerald-950 font-bold scale-110'
                          : isPassed
                          ? 'bg-[#0f5132] text-white'
                          : 'bg-slate-200 dark:bg-emerald-950 text-slate-400'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>

                    <div className="flex-1 py-1">
                      <span
                        className={`text-xs block ${
                          isCurrent
                            ? 'font-extrabold text-[#0f5132] dark:text-[#f4c542]'
                            : isPassed
                            ? 'font-semibold text-slate-800 dark:text-slate-200'
                            : 'text-slate-400 dark:text-slate-600'
                        }`}
                      >
                        {stage.labelUrdu}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Address Recap */}
          <div className="p-3 bg-slate-50 dark:bg-[#141d18] rounded-xl border border-slate-200 dark:border-emerald-950 text-xs space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              ترسیل کا پتہ:
            </span>
            <p className="text-slate-800 dark:text-slate-200">
              {order.buyerName} · 📞 {order.buyerPhone}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              {order.buyerArea ? `${order.buyerArea}، ` : ''}{order.buyerAddress}، {order.buyerCity}
            </p>
          </div>

          {/* Delivery Problems & Actions: Cancel / Return */}
          <div className="pt-2 border-t border-slate-100 dark:border-emerald-950 space-y-2">
            {/* Cancel Button before Shipped */}
            {isCancellable && order.shippingStatus !== 'cancelled' && (
              <button
                onClick={() => {
                  if (confirm('کیا آپ واقعی یہ آرڈر منسوخ کرنا چاہتے ہیں؟')) {
                    onCancelOrder(order.id);
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer font-nastaliq"
              >
                <Ban className="w-4 h-4" />
                <span>آرڈر منسوخ کریں (Cancel Order)</span>
              </button>
            )}

            {/* Return Request Button after Delivered */}
            {isDelivered && !order.returnRequest && !showReturnForm && (
              <button
                onClick={() => setShowReturnForm(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer font-nastaliq"
              >
                <RotateCcw className="w-4 h-4" />
                <span>واپسی یا تبدیلی کی درخواست کریں (Return / Replace)</span>
              </button>
            )}

            {/* Existing Return Request Status */}
            {order.returnRequest && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                  <span>واپسی کی درخواست (Return Request):</span>
                  <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px]">
                    {order.returnRequest.status === 'pending'
                      ? 'زیرِ جائزہ ⏳'
                      : order.returnRequest.status === 'approved'
                      ? 'منظور شدہ ✅'
                      : 'مسترد ❌'}
                  </span>
                </div>
                <p className="text-amber-800 dark:text-amber-300">
                  وجہ: {order.returnRequest.reason}
                </p>
                {order.returnRequest.sellerNotes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    سیلر کا جواب: {order.returnRequest.sellerNotes}
                  </p>
                )}
              </div>
            )}

            {/* Return Form Form */}
            {showReturnForm && (
              <form onSubmit={handleReturnSubmit} className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl space-y-2.5 text-xs">
                <h5 className="font-bold text-amber-900 dark:text-amber-200">
                  واپسی کی وجہ منتخب کریں:
                </h5>

                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-amber-300 bg-white dark:bg-[#121915]"
                >
                  <option value="defect">خرابی یا ٹوٹ پھوٹ (Defective/Damaged)</option>
                  <option value="wrong_size">سائز یا ناپ درست نہیں (Wrong Size)</option>
                  <option value="not_as_described">تصویر یا تفصیل کے مطابق نہیں (Different from Photo)</option>
                </select>

                <textarea
                  required
                  rows={2}
                  value={returnDetails}
                  onChange={(e) => setReturnDetails(e.target.value)}
                  placeholder="مکمل تفصیل درج کریں..."
                  className="w-full p-2 rounded-lg border border-amber-300 bg-white dark:bg-[#121915]"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReturnForm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-semibold"
                  >
                    منسوخ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1.5 rounded-lg bg-[#0f5132] text-white font-bold"
                  >
                    درخواست جمع کروائیں
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
