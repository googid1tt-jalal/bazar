import React from 'react';
import { OrderItem } from '../types/market';
import { Printer, X, Truck, Package, Phone, MapPin } from 'lucide-react';

interface ShippingLabelModalProps {
  order: OrderItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden text-slate-900 max-h-[92vh] flex flex-col animate-scale-up">
        {/* Top Control Bar */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-[#f4c542]" />
            <span className="font-bold text-xs sm:text-sm font-nastaliq">
              شپنگ لیبل و پیکنگ سلپ (Shipping Label & Packing Slip)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg bg-[#f4c542] text-[#0f5132] font-bold text-xs flex items-center gap-1 hover:bg-[#e5b634] transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>پرنٹ کریں (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Label Area */}
        <div id="printable-shipping-label" className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Header Row */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🧶</span>
                <span className="text-base font-extrabold font-nastaliq">
                  ہنر بازار (Hunar Bazaar)
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                پشتون • بلوچ • سندھی • سرائیکی دستکاری
              </p>
            </div>

            <div className="text-end">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-extrabold text-[11px] uppercase tracking-wider block">
                C.O.D. PARCEL
              </span>
              <span className="text-[11px] font-bold text-slate-700 block mt-1">
                آرڈر #: {order.id}
              </span>
            </div>
          </div>

          {/* Courier & Tracking Barcode Strip */}
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                منتخب کورئیر (Courier Service):
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {order.courierName || 'TCS / Leopards / Trax'}
              </span>
            </div>
            <div className="text-end">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                ٹریکنگ نمبر (CN / Tracking #):
              </span>
              <span className="text-sm font-extrabold font-mono text-emerald-800">
                {order.trackingNumber || 'CN-PENDING'}
              </span>
            </div>
          </div>

          {/* Mock Visual Barcode */}
          <div className="py-2 text-center bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center">
            <div className="font-mono text-xl sm:text-2xl tracking-[6px] select-none text-slate-900">
              ||||| | |||| ||| ||||||| ||| |||||
            </div>
            <span className="font-mono text-[10px] text-slate-500">
              *{order.trackingNumber || order.id}*
            </span>
          </div>

          {/* Consignee (Buyer) & Shipper (Seller) 2-Box Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Consignee Box */}
            <div className="p-3 rounded-xl border border-slate-300 bg-slate-50/50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-extrabold block">
                ارسال برائے (Deliver To / Consignee):
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {order.buyerName}
              </p>
              <p className="text-xs text-slate-800 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{order.buyerPhone}</span>
              </p>
              <p className="text-xs text-slate-700 leading-relaxed pt-1">
                {order.buyerArea ? `${order.buyerArea}، ` : ''}{order.buyerAddress}
              </p>
              <p className="font-bold text-xs text-slate-900">
                📍 {order.buyerCity}
              </p>
            </div>

            {/* Shipper (Seller) Box */}
            <div className="p-3 rounded-xl border border-slate-300 bg-slate-50/50 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-extrabold block">
                ارسال کنندہ (Shipper / Seller):
              </span>
              <p className="font-bold text-slate-900 text-sm">
                ہنر بازار پارٹنر دکان
              </p>
              <p className="text-xs text-slate-800 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-slate-500" />
                <span>{order.sellerWhatsapp}</span>
              </p>
              <p className="text-xs text-slate-700">
                شہر: 📍 {order.city}
              </p>
              {order.shippingNotes && (
                <div className="pt-1 text-[11px] text-amber-900 font-semibold">
                  نوٹ: {order.shippingNotes}
                </div>
              )}
            </div>
          </div>

          {/* Order Contents Breakdown */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 p-2 font-bold text-[11px] text-slate-700 flex justify-between">
              <span>دستکاری سامان (Product Item)</span>
              <span>تعداد / رقم</span>
            </div>
            <div className="p-2.5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 text-xs">
                  {order.productTitle}
                </p>
                <span className="text-[10px] text-slate-500">
                  فی دانہ: ₨ {order.price.toLocaleString()}
                </span>
              </div>
              <div className="text-end font-bold text-xs tabular-nums">
                {order.quantity} دانہ · ₨ {order.itemsPrice.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Big COD Amount to Collect Box */}
          <div className="p-4 bg-emerald-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-emerald-300 text-[10px] uppercase font-bold block">
                کورئیر رائیڈر وصولی رقم (C.O.D. Amount to Collect):
              </span>
              <span className="text-xs text-emerald-200">
                (اشیاء: ₨ {order.itemsPrice.toLocaleString()} + ترسیل: ₨ {order.shippingFee.toLocaleString()})
              </span>
            </div>
            <div className="text-end">
              <span className="text-xl sm:text-2xl font-black text-[#f4c542] tabular-nums">
                ₨ {order.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="text-[10px] text-slate-400 text-center pt-2">
            گاہک کو پارسل کھول کر چیک کرنے کی اجازت دی جائے۔ کسی بھی مسئلہ کی صورت میں 03001234567 پر رابطہ کریں۔
          </div>
        </div>
      </div>
    </div>
  );
};
