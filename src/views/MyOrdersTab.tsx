import React, { useState } from 'react';
import { OrderItem, CourierService, BidItem } from '../types/market';
import {
  Receipt,
  CheckCheck,
  XCircle,
  Truck,
  Package,
  ExternalLink,
  Clock,
  RotateCcw,
  Ban,
  ChevronRight,
  Gavel
} from 'lucide-react';

interface MyOrdersTabProps {
  orders: OrderItem[];
  couriers: CourierService[];
  bids?: BidItem[];
  onUpdateStatus: (orderId: string, newStatus: any) => void;
  onGoToMarket: () => void;
  onOpenTrackingModal: (order: OrderItem) => void;
}

export const MyOrdersTab: React.FC<MyOrdersTabProps> = ({
  orders,
  couriers,
  bids = [],
  onUpdateStatus,
  onGoToMarket,
  onOpenTrackingModal
}) => {
  const [activeSection, setActiveSection] = useState<'orders' | 'bids'>('orders');
  const getStatusBadge = (status: OrderItem['shippingStatus'] | string) => {
    switch (status) {
      case 'placed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs border border-amber-300 dark:border-amber-800">
            آرڈر موصول ⏳ (Placed)
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs border border-blue-300 dark:border-blue-800">
            تصدیق شدہ (Confirmed)
          </span>
        );
      case 'packed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs border border-indigo-300 dark:border-indigo-800">
            پیک ہو گیا 📦 (Packed)
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold text-xs border border-purple-300 dark:border-purple-800">
            کورئیر کے سپرد 🚚 (Shipped)
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 font-bold text-xs border border-cyan-300 dark:border-cyan-800 animate-pulse">
            رائیڈر روانہ 🛵 (Out for Delivery)
          </span>
        );
      case 'delivered':
      case 'مال مل گیا ✅':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs border border-emerald-300 dark:border-emerald-800">
            مال مل گیا ✅ (Delivered)
          </span>
        );
      case 'cancelled':
      case 'منسوخ ❌':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs border border-rose-300 dark:border-rose-800">
            منسوخ شدہ ❌ (Cancelled)
          </span>
        );
      case 'delivery_failed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs border border-rose-300 dark:border-rose-800">
            ترسیل نامکمل ⚠️ (Failed)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-950 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Receipt className="w-5 h-5 text-[#0f5132] dark:text-[#f4c542]" />
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-nastaliq">
              میرے آرڈر اور ترسیل کی ٹریکنگ (My Orders & Tracking)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              کل آرڈرز: {orders.length} · میری بولیاں: {bids.length}
            </p>
          </div>
        </div>

        <button
          onClick={onGoToMarket}
          className="px-3.5 py-1.5 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          بازار سے مزید خریدیں
        </button>
      </div>

      {/* Section Toggle: Orders vs Placed Bids */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-[#121915] rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveSection('orders')}
          className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'orders'
              ? 'bg-white dark:bg-[#1e2b24] text-[#0f5132] dark:text-[#f4c542] font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>میرے آرڈرز ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('bids')}
          className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSection === 'bids'
              ? 'bg-white dark:bg-[#1e2b24] text-[#0f5132] dark:text-[#f4c542] font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Gavel className="w-3.5 h-3.5" />
          <span>میری لگائی گئی بولیاں ({bids.length})</span>
        </button>
      </div>

      {/* Section 1: Orders */}
      {activeSection === 'orders' && (
        orders.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 p-6 space-y-3">
            <div className="text-5xl select-none">🧾</div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 font-nastaliq">
              ابھی تک کوئی آرڈر نہیں دیا
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              بازار سے کوئی بھی پسندیدہ دستکاری منتخب کریں اور واٹس ایپ پر کیش آن ڈیلیوری آرڈر دیں۔
            </p>
            <button
              onClick={onGoToMarket}
              className="px-5 py-2.5 rounded-xl bg-[#f4c542] hover:bg-[#e5b634] text-[#0f5132] font-extrabold text-xs sm:text-sm shadow-sm transition cursor-pointer font-nastaliq"
            >
              🛍️ بازار میں خریداری کریں
            </button>
          </div>
        ) : (
          <div className="space-y-4">
          {orders.map((order) => {
            const isCancellable = order.shippingStatus === 'placed' || order.shippingStatus === 'confirmed';
            const isDelivered = order.shippingStatus === 'delivered' || order.status === 'مال مل گیا ✅';

            const courierObj = couriers.find((c) => c.id === order.courierId);
            const trackingUrl = (courierObj?.trackingUrlTemplate && order.trackingNumber)
              ? `${courierObj.trackingUrlTemplate}${order.trackingNumber}`
              : null;

            return (
              <div
                key={order.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1c2621] border border-slate-200 dark:border-emerald-950 shadow-xs flex flex-col justify-between gap-4"
              >
                {/* Product and Order Info Header */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-emerald-950 overflow-hidden shrink-0 border border-slate-200 dark:border-emerald-900 flex items-center justify-center">
                    {order.productPhoto ? (
                      <img src={order.productPhoto} alt={order.productTitle} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🧶</span>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                        {order.productTitle}
                      </h4>
                      {getStatusBadge(order.shippingStatus || order.status || 'placed')}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>تعداد: <strong>{order.quantity} دانہ</strong></span>
                      <span>·</span>
                      <span>
                        کل رقم: <strong className="text-[#0f5132] dark:text-[#f4c542] tabular-nums font-bold">{order.totalPrice.toLocaleString()} روپے</strong>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                      <span>تاریخ: {order.date}</span>
                      <span>·</span>
                      <span>پتہ: 📍 {order.buyerCity}</span>
                      <span>·</span>
                      <span>ادائیگی: کیش آن ڈیلیوری</span>
                    </div>
                  </div>
                </div>

                {/* Courier & Tracking Banner */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141d18] border border-slate-200 dark:border-emerald-950 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#0f5132] dark:text-[#f4c542]" />
                    <span className="text-slate-700 dark:text-slate-300">
                      کورئیر: <strong>{order.courierName || 'سیلر کورئیر کا انتخاب کر رہا ہے'}</strong>
                    </span>
                    {order.trackingNumber && (
                      <span className="font-mono text-emerald-800 dark:text-[#f4c542] font-semibold">
                        (CN: {order.trackingNumber})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {trackingUrl && (
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#0f5132] dark:text-[#f4c542] hover:underline font-bold flex items-center gap-1"
                      >
                        <span>ویب سائٹ ٹریکنگ</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <button
                      onClick={() => onOpenTrackingModal(order)}
                      className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-[#0f5132] dark:text-[#f4c542] border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
                    >
                      مراحل ٹریک کریں ❯
                    </button>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-emerald-950/60 justify-end flex-wrap">
                  {!isDelivered && order.shippingStatus !== 'cancelled' && (
                    <button
                      onClick={() => onUpdateStatus(order.id, 'delivered')}
                      className="px-3.5 py-2 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs cursor-pointer font-nastaliq"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-[#f4c542]" />
                      <span>✅ مال مل گیا</span>
                    </button>
                  )}

                  {isCancellable && (
                    <button
                      onClick={() => {
                        if (confirm('کیا آپ واقعی یہ آرڈر منسوخ کرنا چاہتے ہیں؟')) {
                          onUpdateStatus(order.id, 'cancelled');
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 text-slate-700 hover:text-rose-600 dark:text-slate-300 font-semibold text-xs transition cursor-pointer"
                    >
                      <span>منسوخ</span>
                    </button>
                  )}

                  {isDelivered && (
                    <button
                      onClick={() => onOpenTrackingModal(order)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>واپسی / رپورٹ</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Section 2: My Placed Bids */}
      {activeSection === 'bids' && (
        bids.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 p-6 space-y-3">
            <div className="text-5xl select-none">🔨</div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 font-nastaliq">
              آپ نے ابھی تک کسی چیز پر بولی نہیں لگائی
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              بازار میں جا کر دستکاروں کو اپنی پسند کی قیمت پیش کریں اور مول تول کریں۔
            </p>
            <button
              onClick={onGoToMarket}
              className="px-5 py-2.5 rounded-xl bg-[#0f5132] text-white hover:bg-emerald-900 font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer font-nastaliq"
            >
              🛍️ بازار میں بولیاں دیکھیں
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-white dark:bg-[#1a241e] rounded-2xl border border-slate-200 dark:border-emerald-950 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#141d18] overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-emerald-900">
                      {b.productPhoto ? (
                        <img src={b.productPhoto} alt={b.productTitle} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">🧶</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {b.productTitle}
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        مانگی گئی قیمت: ₨ {b.askingPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      b.status === 'accepted'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : b.status === 'declined'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {b.status === 'accepted'
                      ? 'منظور شدہ ✅ (Accepted)'
                      : b.status === 'declined'
                      ? 'مسترد ❌ (Declined)'
                      : 'زیرِ جائزہ ⏳ (Pending)'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-[#121915] rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 block">میری پیشکش رقم:</span>
                    <span className="text-sm sm:text-base font-black text-[#0f5132] dark:text-[#f4c542] font-mono tabular-nums">
                      ₨ {b.bidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-end">
                    <span className="text-[10px] text-slate-400 block">تاریخ و وقت:</span>
                    <span className="text-slate-600 dark:text-slate-300 text-[11px]">{b.createdAt}</span>
                  </div>
                </div>

                {b.message && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50/40 p-2 rounded-lg">
                    نوٹ: {b.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
