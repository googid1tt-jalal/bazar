import React, { useState } from 'react';
import { CourierService, OrderItem, ProductItem, BidItem } from '../types/market';
import { ShieldCheck, Truck, Plus, Trash2, X, AlertTriangle, Package, CheckCircle2, TrendingUp } from 'lucide-react';
import { SellerStats } from './SellerStats';

interface AdminShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  couriers: CourierService[];
  orders: OrderItem[];
  products: ProductItem[];
  bids?: BidItem[];
  onAddCourier: (courier: CourierService) => void;
  onToggleCourier: (id: string) => void;
  onDeleteCourier: (id: string) => void;
}

export const AdminShippingModal: React.FC<AdminShippingModalProps> = ({
  isOpen,
  onClose,
  couriers,
  orders,
  products,
  bids = [],
  onAddCourier,
  onToggleCourier,
  onDeleteCourier
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'shipments' | 'couriers' | 'disputes' | 'analytics'>('shipments');
  const [newCourierName, setNewCourierName] = useState('');
  const [newCourierUrdu, setNewCourierUrdu] = useState('');
  const [newTrackingTemplate, setNewTrackingTemplate] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const disputes = orders.filter((o) => o.returnRequest || o.shippingStatus === 'delivery_failed');

  const handleCreateCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourierName.trim()) return;

    const newC: CourierService = {
      id: `courier_${Date.now()}`,
      name: newCourierName.trim(),
      nameUrdu: newCourierUrdu.trim() || newCourierName.trim(),
      trackingUrlTemplate: newTrackingTemplate.trim(),
      phone: newPhone.trim() || '021-111-000-000',
      isActive: true
    };

    onAddCourier(newC);
    setNewCourierName('');
    setNewCourierUrdu('');
    setNewTrackingTemplate('');
    setNewPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950 overflow-hidden max-h-[92vh] flex flex-col animate-scale-up">
        {/* Header with Admin Profile: Jalal Habib */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f4c542] text-[#0f5132] font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
              JH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg font-nastaliq text-white">
                  جلال حبیب (Jalal Habib)
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#0f5132] text-[#f4c542] text-[10px] font-black border border-emerald-700/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>سپر ایڈمن (Super Admin)</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                ایڈمن پورٹل، شپنگ و آمدن کنٹرول پینل • پشاور و اسلام آباد
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-emerald-950 bg-slate-50 dark:bg-[#121915] text-xs font-semibold px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('shipments')}
            className={`py-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'shipments'
                ? 'border-[#0f5132] text-[#0f5132] dark:text-[#f4c542] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            تمام پارسل و ترسیلات ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-[#0f5132] text-[#0f5132] dark:text-[#f4c542] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>سیلز و آمدن تجزیہ (Recharts Stats)</span>
          </button>

          <button
            onClick={() => setActiveTab('couriers')}
            className={`py-2 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'couriers'
                ? 'border-[#0f5132] text-[#0f5132] dark:text-[#f4c542] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            کورئیر لسٹ ({couriers.length})
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`py-2 px-3 border-b-2 transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              activeTab === 'disputes'
                ? 'border-[#0f5132] text-[#0f5132] dark:text-[#f4c542] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>تنازعات و واپسی ({disputes.length})</span>
            {disputes.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {disputes.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Tab 1: All Shipments */}
          {activeTab === 'shipments' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">
                حالیہ تمام آرڈرز اور ترسیلی صورتحال:
              </h4>

              {orders.length === 0 ? (
                <p className="text-slate-400 py-8 text-center">ابھی تک کوئی پارسل روانہ نہیں ہوا۔</p>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-emerald-950 bg-slate-50 dark:bg-[#141d18] flex items-center justify-between flex-wrap gap-2 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            #{o.id} - {o.productTitle}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
                            {o.shippingStatus}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                          خریدار: {o.buyerName} ({o.buyerCity}) · 📞 {o.buyerPhone}
                        </p>
                        <p className="text-emerald-800 dark:text-[#f4c542] font-semibold mt-0.5">
                          کورئیر: {o.courierName || 'زیرِ جائزہ'} · CN: {o.trackingNumber || 'ابھی نہیں لگا'}
                        </p>
                      </div>

                      <div className="text-end">
                        <span className="font-bold text-sm text-slate-900 dark:text-white tabular-nums block">
                          ₨ {o.totalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          سی او ڈی ({o.codStatus})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Couriers Manager */}
          {activeTab === 'couriers' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                تعاون شدہ کورئیر سروسز (Manage Couriers):
              </h4>

              {/* Add New Courier Form */}
              <form onSubmit={handleCreateCourier} className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl space-y-2.5 text-xs">
                <span className="font-bold text-[#0f5132] dark:text-[#f4c542] block">
                  ➕ نیا کورئیر شامل کریں:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={newCourierName}
                    onChange={(e) => setNewCourierName(e.target.value)}
                    placeholder="کورئیر کا نام (مثلاً: Fly Courier)"
                    className="p-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#121915]"
                  />
                  <input
                    type="text"
                    value={newCourierUrdu}
                    onChange={(e) => setNewCourierUrdu(e.target.value)}
                    placeholder="اردو نام (فلائی کورئیر)"
                    className="p-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#121915]"
                  />
                </div>

                <input
                  type="url"
                  value={newTrackingTemplate}
                  onChange={(e) => setNewTrackingTemplate(e.target.value)}
                  placeholder="ٹریکنگ لنک سانچہ (مثلاً: https://flycourier.pk/track?cn=)"
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#121915] text-xs font-mono"
                />

                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#0f5132] text-white font-bold text-xs hover:bg-emerald-900 transition cursor-pointer"
                >
                  کورئیر محفوظ کریں
                </button>
              </form>

              {/* Couriers List */}
              <div className="space-y-2">
                {couriers.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-emerald-950 bg-white dark:bg-[#141d18] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Truck className="w-4 h-4 text-[#0f5132] dark:text-[#f4c542]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {c.nameUrdu}
                          </span>
                          <span className="text-[11px] text-slate-400">({c.name})</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-xs sm:max-w-md">
                          {c.trackingUrlTemplate || 'مقامی ذاتی رائیڈر ترسیل'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleCourier(c.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          c.isActive
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {c.isActive ? 'فعال (Active)' : 'غیر فعال'}
                      </button>

                      <button
                        onClick={() => onDeleteCourier(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Remove Courier"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Disputes & Returns */}
          {activeTab === 'disputes' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white">
                گاہک واپسی کی درخواستیں و ترسیلی تنازعات:
              </h4>

              {disputes.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  الحمدللہ، کوئی تنازع یا ناکام ترسیل نہیں ہے۔
                </div>
              ) : (
                <div className="space-y-3">
                  {disputes.map((d) => (
                    <div
                      key={d.id}
                      className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          آرڈر #{d.id} - {d.productTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                          {d.shippingStatus}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        خریدار: {d.buyerName} · 📞 {d.buyerPhone} · شہر: {d.buyerCity}
                      </p>
                      {d.returnRequest && (
                        <p className="text-rose-700 dark:text-rose-300 font-semibold">
                          واپسی کی وجہ: {d.returnRequest.reason}
                        </p>
                      )}
                      {d.failureReason && (
                        <p className="text-amber-800 dark:text-amber-300 font-semibold">
                          ناکامی کی وجہ: {d.failureReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Platform Analytics & SellerStats */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <SellerStats orders={orders} bids={bids} isAdminView={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
