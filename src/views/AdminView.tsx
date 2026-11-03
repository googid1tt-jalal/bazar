import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  UserCheck,
  Settings,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Trash2
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    orders,
    listings,
    reports,
    allUsers,
    adminVerifyPayment,
    adminReleasePayout,
    updateListingStatus,
    deleteListing,
    resolveReport,
    marketplaceName,
    setMarketplaceName,
    t,
    language
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'payments' | 'payouts' | 'listings' | 'reports' | 'settings'>('payments');
  const [selectedProofImg, setSelectedProofImg] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(marketplaceName);

  // Financial calculations
  const totalGMV = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalCommission = orders
    .filter((o) => o.status === 'completed' || o.payoutStatus === 'released')
    .reduce((sum, o) => sum + o.platformFee, 0);

  const pendingPayments = orders.filter((o) => o.status === 'payment_submitted');
  const readyPayouts = orders.filter((o) => o.status === 'completed' && o.payoutStatus !== 'released');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  const handleSaveMarketplaceName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setMarketplaceName(nameInput.trim());
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Banner */}
      <div className="bg-emerald-950 text-white p-5 sm:p-7 rounded-2xl border border-emerald-800 shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400 text-emerald-950 font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel (Me)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t('adminTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200">
            {t('adminSubtitle')}
          </p>
        </div>

        <div className="text-end">
          <span className="text-xs text-emerald-300 block">پلیٹ فارم محفوظ کیش ریونیو</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 tabular-nums">
            ₨ {totalCommission.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">{t('totalGMV')}</span>
          <span className="text-lg sm:text-xl font-bold text-slate-900 tabular-nums block mt-1">
            ₨ {totalGMV.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            تمام آرڈرز کا حجم
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">{t('totalCommission')}</span>
          <span className="text-lg sm:text-xl font-bold text-emerald-800 tabular-nums block mt-1">
            ₨ {totalCommission.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            10% ہنر بازار فیس
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">{t('pendingPayments')}</span>
          <span className="text-lg sm:text-xl font-bold text-amber-600 tabular-nums block mt-1">
            {pendingPayments.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            جازکیش / ایزی پیسہ رسیدیں
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 block">زیرِ التواء ادائیگیاں (Payouts)</span>
          <span className="text-lg sm:text-xl font-bold text-purple-700 tabular-nums block mt-1">
            {readyPayouts.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            سیلرز کو 90% ریلیز
          </span>
        </div>
      </div>

      {/* Navigation Admin Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-3 pt-2 gap-1 overflow-x-auto no-scrollbar text-xs font-semibold">
        <button
          onClick={() => setActiveAdminTab('payments')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'payments'
              ? 'border-emerald-800 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t('tabPayments')}</span>
          {pendingPayments.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-400 text-emerald-950 text-[10px] rounded-full font-bold">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('payouts')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'payouts'
              ? 'border-emerald-800 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t('tabPayouts')}</span>
          {readyPayouts.length > 0 && (
            <span className="px-1.5 py-0.2 bg-purple-600 text-white text-[10px] rounded-full font-bold">
              {readyPayouts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('listings')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'listings'
              ? 'border-emerald-800 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('tabListings')} ({listings.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('reports')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeAdminTab === 'reports'
              ? 'border-emerald-800 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>{t('tabReports')}</span>
          {pendingReports.length > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] rounded-full font-bold">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('settings')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'settings'
              ? 'border-emerald-800 text-emerald-950 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('tabSettings')}
        </button>
      </div>

      {/* Admin Tab Content */}
      <div className="bg-white rounded-b-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        {/* Tab 1: Escrow Payments Verification */}
        {activeAdminTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 nastaliq-heading">
              {t('tabPayments')} - مینوئل رسیدوں کی تصدیق
            </h3>
            <p className="text-xs text-slate-500">
              خریداروں کی طرف سے جازکیش یا ایزی پیسہ پر بھیجی گئی رقوم کی TID اور رسید چیک کر کے ایسکرو میں تصدیق کریں۔
            </p>

            {pendingPayments.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                کوئی بھی ادائیگی تصدیق طلب نہیں ہے۔ تمام ایسکرو فنڈز کلیئر ہیں۔
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPayments.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={order.listingImage}
                        alt="item"
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            #{order.id}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">
                          خریدار: <strong>{order.buyerName}</strong> ({order.buyerPhone || '0300-0000000'})
                        </p>
                        <p className="text-xs font-mono text-emerald-900">
                          TID: <strong>{order.transactionId}</strong> · رقم: ₨ {order.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.paymentProofUrl && (
                        <button
                          onClick={() => setSelectedProofImg(order.paymentProofUrl!)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-1 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>رسید دیکھیں</span>
                        </button>
                      )}

                      <button
                        onClick={() => adminVerifyPayment(order.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('verifyPayment')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Seller Payouts */}
        {activeAdminTab === 'payouts' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 nastaliq-heading">
              {t('tabPayouts')} - سیلرز کو 90% رقم کی منتقلی
            </h3>
            <p className="text-xs text-slate-500">
              خریدار کی طرف سے ترسیل کی تصدیق کے بعد 10% پلیٹ فارم کمیشن منہا کر کے باقی رقم سیلر کے اکاؤنٹ میں ریلیز کریں۔
            </p>

            {readyPayouts.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                کوئی بھی آرڈر ادائیگی کے لیے پینڈنگ نہیں ہے۔
              </div>
            ) : (
              <div className="space-y-3">
                {readyPayouts.map((order) => {
                  const seller = allUsers.find((u) => u.id === order.sellerId);
                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 flex items-center justify-between flex-wrap gap-4"
                    >
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                          آرڈر #{order.id} - {order.listingTitle}
                        </span>
                        <p className="text-xs text-slate-700">
                          سیلر: <strong>{order.sellerName}</strong> ({seller?.jazzcashAccount || seller?.easypaisaAccount || '0313-9876543'})
                        </p>
                        <div className="text-xs text-slate-600 flex items-center gap-3">
                          <span>کل رقم: ₨ {order.amount.toLocaleString()}</span>
                          <span>10% کمیشن: <strong>₨ {order.platformFee.toLocaleString()}</strong></span>
                          <span className="text-emerald-800 font-bold">
                            سیلر کا حصہ (90%): ₨ {order.sellerPayout.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => adminReleasePayout(order.id)}
                        className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs transition shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>{t('releasePayout')}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Listings Moderation */}
        {activeAdminTab === 'listings' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 nastaliq-heading">
              {t('tabListings')} - اشتہارات کا انتظام و نگرانی
            </h3>

            <div className="space-y-2.5">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between flex-wrap gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={l.images[0]}
                      alt={l.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 text-xs truncate max-w-xs sm:max-w-md">
                        {l.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {l.sellerName} · {l.city} · ₨ {l.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {l.status === 'pending' ? (
                      <button
                        onClick={() => updateListingStatus(l.id, 'approved')}
                        className="px-3 py-1 rounded-lg bg-emerald-800 text-white text-xs font-semibold"
                      >
                        {t('approve')}
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        Approved
                      </span>
                    )}

                    <button
                      onClick={() => deleteListing(l.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: User & Listing Reports */}
        {activeAdminTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 nastaliq-heading">
              {t('tabReports')} - شکایات کا معائنہ
            </h3>

            {reports.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                کوئی نئی شکایت موصول نہیں ہوئی ہے۔
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 flex items-start justify-between flex-wrap gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-700" />
                        <span className="font-bold text-rose-950 text-xs sm:text-sm">
                          {r.targetName}
                        </span>
                        <span className="text-[10px] text-slate-500">({r.targetType})</span>
                      </div>
                      <p className="text-xs text-rose-900 font-semibold">
                        وجہ: {r.reason}
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        تفصیل: {r.details}
                      </p>
                      <span className="text-[10px] text-slate-400 block">
                        رپورٹر: {r.reporterName}
                      </span>
                    </div>

                    <div>
                      {r.status === 'pending' ? (
                        <button
                          onClick={() => resolveReport(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-800 hover:bg-rose-900 text-white font-semibold text-xs transition"
                        >
                          حل شدہ قرار دیں
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-800 font-bold">Resolved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Marketplace Settings */}
        {activeAdminTab === 'settings' && (
          <div className="space-y-4 max-w-md">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 nastaliq-heading">
              {t('tabSettings')} - مارکیٹ پلیس کا نام تبدیل کریں
            </h3>
            <p className="text-xs text-slate-500">
              آپ کے سوال میں دیے گئے "[Your Name]" کی مناسبت سے آپ اس مارکیٹ پلیس کا عنوان اپنی مرضی سے تبدیل کر سکتے ہیں:
            </p>

            <form onSubmit={handleSaveMarketplaceName} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  مارکیٹ پلیس کا عنوان (Branded Title):
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <button
                type="submit"
                className="py-2 px-4 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition"
              >
                محفوظ کریں (Save Name)
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Screenshot Viewer Modal */}
      {selectedProofImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="max-w-md w-full bg-white rounded-2xl overflow-hidden p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h4 className="font-bold text-sm text-slate-900">رسید کا اسکرین شاٹ</h4>
              <button
                onClick={() => setSelectedProofImg(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                بند کریں ✕
              </button>
            </div>
            <img src={selectedProofImg} alt="Proof" className="w-full h-auto rounded-lg max-h-96 object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
