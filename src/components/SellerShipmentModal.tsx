import React, { useState } from 'react';
import { OrderItem, CourierService, OrderShippingStatus } from '../types/market';
import {
  X,
  Truck,
  Printer,
  Package,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  Send,
  Phone,
  MapPin
} from 'lucide-react';

interface SellerShipmentModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
  couriers: CourierService[];
  onUpdateShipment: (orderId: string, updates: Partial<OrderItem>) => void;
  onOpenShippingLabel: (order: OrderItem) => void;
}

export const SellerShipmentModal: React.FC<SellerShipmentModalProps> = ({
  order,
  isOpen,
  onClose,
  couriers,
  onUpdateShipment,
  onOpenShippingLabel
}) => {
  if (!isOpen || !order) return null;

  const [selectedCourierId, setSelectedCourierId] = useState(order.courierId || couriers[0]?.id || 'tcs');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [shippingNotes, setShippingNotes] = useState(order.shippingNotes || '');
  const [failureReason, setFailureReason] = useState('');
  const [returnResolution, setReturnResolution] = useState<'replacement' | 'refund'>('replacement');
  const [sellerReturnNotes, setSellerReturnNotes] = useState('');

  const selectedCourier = couriers.find((c) => c.id === selectedCourierId);

  const handleSaveCourierAndCN = () => {
    onUpdateShipment(order.id, {
      courierId: selectedCourierId,
      courierName: selectedCourier?.name || 'TCS Express',
      trackingNumber: trackingNumber.trim(),
      shippingNotes: shippingNotes.trim()
    });
  };

  const handleUpdateStatus = (status: OrderShippingStatus, noteText?: string) => {
    const courierObj = couriers.find((c) => c.id === selectedCourierId);
    const dateFormatted = new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date().toLocaleDateString('ur-PK');

    const newTimelineEvent = {
      status,
      titleUrdu: status === 'confirmed' ? 'سیلر نے آرڈر کی تصدیق کر دی' :
                 status === 'packed' ? 'آرڈر پیک کر دیا گیا ہے' :
                 status === 'shipped' ? `پارسل ${courierObj?.name || ''} کے سپرد کر دیا گیا` :
                 status === 'out_for_delivery' ? 'کورئیر رائیڈر پارسل لے کر روانہ ہو چکا ہے' :
                 status === 'delivered' ? 'گاہک کو پارسل مل گیا اور سی او ڈی رقم موصول ہو گئی' :
                 'ترسیل کی کوشش ناکام ہوئی (گاہک دستیاب نہیں)',
      timestamp: dateFormatted,
      note: noteText || shippingNotes
    };

    onUpdateShipment(order.id, {
      shippingStatus: status,
      courierId: selectedCourierId,
      courierName: courierObj?.name,
      trackingNumber: trackingNumber.trim() || order.trackingNumber,
      shippingNotes: shippingNotes.trim() || order.shippingNotes,
      shippedAt: status === 'shipped' ? new Date().toISOString() : order.shippedAt,
      deliveredAt: status === 'delivered' ? new Date().toISOString() : order.deliveredAt,
      codStatus: status === 'delivered' ? 'collected' : order.codStatus,
      timeline: [...order.timeline, newTimelineEvent]
    });
  };

  const handleMarkDeliveryFailed = () => {
    if (!failureReason.trim()) return;
    const dateFormatted = new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' });
    onUpdateShipment(order.id, {
      shippingStatus: 'delivery_failed',
      deliveryAttemptCount: (order.deliveryAttemptCount || 0) + 1,
      failureReason: failureReason.trim(),
      timeline: [
        ...order.timeline,
        {
          status: 'delivery_failed',
          titleUrdu: `ترسیل کی کوشش ناکام: ${failureReason.trim()}`,
          timestamp: dateFormatted,
          note: 'سیلر اگلے کاروباری روز دوبارہ ترسیل کی کوشش کرے گا۔'
        }
      ]
    });
    setFailureReason('');
  };

  const handleApproveReturn = () => {
    if (!order.returnRequest) return;
    onUpdateShipment(order.id, {
      returnRequest: {
        ...order.returnRequest,
        status: 'approved',
        resolution: returnResolution,
        sellerNotes: sellerReturnNotes.trim() || 'واپسی منظور کر لی گئی ہے۔'
      }
    });
  };

  const handleRejectReturn = () => {
    if (!order.returnRequest) return;
    onUpdateShipment(order.id, {
      returnRequest: {
        ...order.returnRequest,
        status: 'rejected',
        sellerNotes: sellerReturnNotes.trim() || 'معائنہ کے بعد درخواست مسترد کی گئی۔'
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950 overflow-hidden max-h-[92vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-[#0f5132] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#f4c542]" />
            <h3 className="font-bold text-base sm:text-lg font-nastaliq">
              شپنگ و کورئیر کنٹرول (Seller Shipping)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Order Snapshot & Print Label Trigger */}
          <div className="p-3.5 bg-[#f6f4ee] dark:bg-[#121915] rounded-2xl border border-slate-200 dark:border-emerald-950 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                آرڈر #{order.id} · {order.date}
              </span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                {order.productTitle} ({order.quantity} دانہ)
              </h4>
              <p className="text-xs font-extrabold text-[#0f5132] dark:text-[#f4c542] tabular-nums mt-0.5">
                سی او ڈی وصولی رقم: ₨ {order.totalPrice.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => onOpenShippingLabel(order)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-[#1c2621] border border-slate-300 dark:border-emerald-900 text-slate-800 dark:text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:border-[#0f5132] transition cursor-pointer shrink-0"
            >
              <Printer className="w-4 h-4 text-[#0f5132] dark:text-[#f4c542]" />
              <span>پیکنگ سلپ پرنٹ کریں</span>
            </button>
          </div>

          {/* Consignee (Buyer) Address details */}
          <div className="p-3 bg-slate-50 dark:bg-[#141d18] rounded-xl border border-slate-200 dark:border-emerald-950 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              خریدار کی ترسیل کا پتہ (Consignee):
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              {order.buyerName} · 📞 {order.buyerPhone}
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {order.buyerArea ? `${order.buyerArea}، ` : ''}{order.buyerAddress}، {order.buyerCity}
            </p>
          </div>

          {/* 1. Courier Selection */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              کورئیر کا انتخاب کریں (Select Courier Service):
            </label>
            <select
              value={selectedCourierId}
              onChange={(e) => setSelectedCourierId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white font-semibold text-xs"
            >
              {couriers.filter((c) => c.isActive).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameUrdu} ({c.name})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Tracking Number (CN) Input */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              ٹریکنگ نمبر / کنسا ئنمنٹ نمبر (CN / Tracking Number) *
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="مثلاً: TCS-998822101 / LP-482910"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-[#0f5132]"
            />
          </div>

          {/* 3. Shipping Notes */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              شپنگ نوٹس (احتیاط / ہدایات):
            </label>
            <input
              type="text"
              value={shippingNotes}
              onChange={(e) => setShippingNotes(e.target.value)}
              placeholder="مثلاً: نازک سامان، احتیاط سے لے جائیں..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* Status Progression Controls */}
          <div className="pt-2 border-t border-slate-100 dark:border-emerald-950 space-y-2">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block mb-1">
              مرحلہ وار آرڈر اسٹیٹس اپ ڈیٹ کریں:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleUpdateStatus('confirmed')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  order.shippingStatus === 'confirmed'
                    ? 'bg-emerald-100 dark:bg-emerald-950 border-[#0f5132] text-[#0f5132] dark:text-[#f4c542] font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-slate-200 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>1. آرڈر تصدیق شدہ</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('packed')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  order.shippingStatus === 'packed'
                    ? 'bg-emerald-100 dark:bg-emerald-950 border-[#0f5132] text-[#0f5132] dark:text-[#f4c542] font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-slate-200 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>2. پیک ہو گیا (Packed)</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('shipped')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  order.shippingStatus === 'shipped'
                    ? 'bg-emerald-100 dark:bg-emerald-950 border-[#0f5132] text-[#0f5132] dark:text-[#f4c542] font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-slate-200 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>3. کورئیر کو دیا (Shipped)</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus('out_for_delivery')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                  order.shippingStatus === 'out_for_delivery'
                    ? 'bg-emerald-100 dark:bg-emerald-950 border-[#0f5132] text-[#0f5132] dark:text-[#f4c542] font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 border-slate-200 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>4. رائیڈر روانہ (Out for Delivery)</span>
              </button>
            </div>

            {/* Complete & Collected button */}
            <button
              type="button"
              onClick={() => handleUpdateStatus('delivered')}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#f4c542]" />
              <span>✅ ترسیل مکمل و سی او ڈی رقم وصول ہو گئی (Delivered)</span>
            </button>
          </div>

          {/* Delivery Failed section */}
          <div className="pt-2 border-t border-slate-100 dark:border-emerald-950 space-y-2">
            <span className="font-bold text-xs text-rose-800 dark:text-rose-400 block">
              ترسیل کی ناکامی رپورٹ کریں (Delivery Failed):
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="وجہ: مثلاً گاہک نے فون نہیں اٹھایا، گھر بند تھا..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-white dark:bg-[#141d18] text-xs"
              />
              <button
                type="button"
                onClick={handleMarkDeliveryFailed}
                disabled={!failureReason.trim()}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs transition"
              >
                ناکامی درج کریں
              </button>
            </div>
          </div>

          {/* Return Request Moderation section */}
          {order.returnRequest && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>خریدار نے واپسی کی درخواست کی ہے:</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300">
                وجہ: {order.returnRequest.reason}
              </p>

              {order.returnRequest.status === 'pending' ? (
                <div className="space-y-2 pt-1 border-t border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="res"
                        checked={returnResolution === 'replacement'}
                        onChange={() => setReturnResolution('replacement')}
                      />
                      <span>تبدیلی (Replacement)</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="res"
                        checked={returnResolution === 'refund'}
                        onChange={() => setReturnResolution('refund')}
                      />
                      <span>رقم واپسی (Refund)</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    value={sellerReturnNotes}
                    onChange={(e) => setSellerReturnNotes(e.target.value)}
                    placeholder="خریدار کے لیے جواب یا نوٹ لکھیں..."
                    className="w-full p-2 rounded-lg border border-amber-300 bg-white dark:bg-[#121915]"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleApproveReturn}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                    >
                      واپسی منظور کریں (Approve)
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectReturn}
                      className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      واپسی مسترد کریں (Reject)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="font-bold text-emerald-800 dark:text-emerald-300 pt-1">
                  فیصلہ: {order.returnRequest.status === 'approved' ? `منظور شدہ (${order.returnRequest.resolution})` : 'مسترد'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
