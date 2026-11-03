import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Upload,
  Star,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Check
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const {
    orders,
    currentUser,
    submitPaymentProof,
    sellerAcceptOrder,
    sellerDeliverOrder,
    buyerConfirmDelivery,
    submitReview,
    t,
    language,
    setActiveTab,
    setSelectedChatUserId
  } = useApp();

  const [filterRole, setFilterRole] = useState<'buyer' | 'seller'>('buyer');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Payment proof form state
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash' | 'easypaisa' | 'bank_transfer'>('jazzcash');
  const [tid, setTid] = useState('');
  const [proofPreview, setProofPreview] = useState<string>('');

  // Seller delivery state
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Review modal state
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const userOrders = orders.filter((o) => {
    if (filterRole === 'buyer') {
      return o.buyerId === currentUser?.id;
    } else {
      return o.sellerId === currentUser?.id;
    }
  });

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || userOrders[0] || null;

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setProofPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    if (!tid) return;
    submitPaymentProof(orderId, paymentMethod, tid, proofPreview || undefined);
    setTid('');
    setProofPreview('');
  };

  const handleDeliver = (orderId: string) => {
    sellerDeliverOrder(orderId, deliveryNotes || undefined);
    setDeliveryNotes('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder || !comment.trim()) return;
    submitReview(reviewOrder.id, rating, comment);
    setReviewOrder(null);
    setComment('');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return (
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
            {t('statusPendingPayment')}
          </span>
        );
      case 'payment_submitted':
        return (
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
            {t('statusPaymentSubmitted')}
          </span>
        );
      case 'payment_verified':
        return (
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-md">
            {t('statusPaymentVerified')}
          </span>
        );
      case 'accepted':
      case 'in_progress':
        return (
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
            {t('statusInProgress')}
          </span>
        );
      case 'delivered':
        return (
          <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
            {t('statusDelivered')}
          </span>
        );
      case 'completed':
        return (
          <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100 border border-emerald-400 px-2.5 py-0.5 rounded-md">
            {t('statusCompleted')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* View Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 nastaliq-heading">
            {t('myOrders')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ur'
              ? 'اپنے تمام جاری و مکمل شدہ آرڈرز اور ایسکرو ادائیگیوں کی حالت دیکھیں۔'
              : language === 'ps'
              ? 'د خپلو ټولو آرډرونو او پیسو روان حالت دلته وګورئ.'
              : 'Track active order delivery, escrow status, and release payments.'}
          </p>
        </div>

        {/* Filter Role (As Buyer vs As Seller) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterRole('buyer')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              filterRole === 'buyer'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('ordersAsBuyer')}
          </button>
          <button
            onClick={() => setFilterRole('seller')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              filterRole === 'seller'
                ? 'bg-white text-emerald-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('ordersAsSeller')}
          </button>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            {language === 'ur' ? 'ابھی کوئی آرڈر موجود نہیں' : language === 'ps' ? 'تر اوسه کوم آرډر نشته' : 'No orders found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterRole === 'buyer'
              ? (language === 'ur' ? 'مارکیٹ پلیس سے اپنی پسند کا ہنر یا سامان آرڈر کریں۔' : 'Browse listings to place your first order.')
              : (language === 'ur' ? 'اپنا گگ بنائیں تاکہ خریدار آپ سے رابطہ کر سکیں۔' : 'Post a gig to start receiving orders.')}
          </p>
          <button
            onClick={() => setActiveTab(filterRole === 'buyer' ? 'browse' : 'sell')}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 transition"
          >
            {filterRole === 'buyer' ? t('navBrowse') : t('sellButton')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Order List Column (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {userOrders.map((order) => {
              const isSelected = activeOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={order.listingImage}
                      alt={order.listingTitle}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold text-slate-500">
                          #{order.id.slice(-6)}
                        </span>
                        {getStatusBadge(order.status)}
                      </div>
                      <h4 className="font-semibold text-slate-900 text-xs truncate">
                        {order.listingTitle}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                        <span>
                          {filterRole === 'buyer' ? order.sellerName : order.buyerName}
                        </span>
                        <span className="font-bold text-emerald-800 tabular-nums">
                          ₨ {order.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Order Details Column (7 cols) */}
          {activeOrder && (
            <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">
                    {t('orderId')} {activeOrder.id}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                    {activeOrder.listingTitle}
                  </h3>
                </div>
                <div>{getStatusBadge(activeOrder.status)}</div>
              </div>

              {/* Order Financials Breakdown */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t('amount')}</span>
                  <span className="font-bold text-slate-900 tabular-nums">₨ {activeOrder.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>{t('platformFee')}</span>
                  <span className="tabular-nums">₨ {activeOrder.platformFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-bold text-emerald-900 pt-1 border-t border-slate-200">
                  <span>{t('sellerPayout')}</span>
                  <span className="tabular-nums">₨ {activeOrder.sellerPayout.toLocaleString()}</span>
                </div>
              </div>

              {/* Counterparty & Chat trigger */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs">
                <div>
                  <span className="text-emerald-800 font-semibold block">
                    {filterRole === 'buyer' ? `سیلر: ${activeOrder.sellerName}` : `خریدار: ${activeOrder.buyerName}`}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    فون: {filterRole === 'buyer' ? (activeOrder.sellerPhone || '0313-9876543') : (activeOrder.buyerPhone || '0300-1122334')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedChatUserId(filterRole === 'buyer' ? activeOrder.sellerId : activeOrder.buyerId);
                    setActiveTab('inbox');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('contactSeller')}</span>
                </button>
              </div>

              {/* Interactive Step: Step 1 - Payment Proof Submission (Buyer side) */}
              {activeOrder.status === 'pending_payment' && filterRole === 'buyer' && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-3.5">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 text-xs sm:text-sm">
                        {t('paymentGuideTitle')}
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        {t('paymentGuideDesc')}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800">{t('jazzcashBankDetails')}</p>
                    <p className="text-slate-700">{t('accountTitle')}</p>
                    <p className="text-slate-900 font-bold font-mono">
                      JazzCash / Easypaisa: 0300-1234567
                    </p>
                    <p className="text-slate-700 font-mono">
                      Meezan Bank IBAN: PK36MEZN0001234567890123
                    </p>
                    <p className="text-[11px] text-amber-700 pt-1">
                      رقم: <strong>₨ {activeOrder.amount.toLocaleString()}</strong>
                    </p>
                  </div>

                  <form onSubmit={(e) => handleSubmitProof(e, activeOrder.id)} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        ادائیگی کا ذریعہ:
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e: any) => setPaymentMethod(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="jazzcash">JazzCash (جاز کیش)</option>
                        <option value="easypaisa">Easypaisa (ایزی پیسہ)</option>
                        <option value="bank_transfer">Bank Transfer (بینک ٹرانسفر)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        {t('enterTransactionId')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={tid}
                        onChange={(e) => setTid(e.target.value)}
                        placeholder="مثلاً: JC-992019401"
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">
                        {t('uploadProof')}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofUpload}
                        className="w-full text-xs text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-emerald-100 file:text-emerald-800"
                      />
                      {proofPreview && (
                        <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border">
                          <img src={proofPreview} alt="proof" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs cursor-pointer"
                    >
                      {t('submitPaymentProof')}
                    </button>
                  </form>
                </div>
              )}

              {/* Status: Payment submitted -> awaiting admin verification notice */}
              {activeOrder.status === 'payment_submitted' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <Clock className="w-4 h-4 text-blue-700" />
                    <span>{t('statusPaymentSubmitted')}</span>
                  </div>
                  <p className="text-blue-800">
                    {language === 'ur'
                      ? `آپ کی ٹرانزیکشن ID (${activeOrder.transactionId}) موصول ہو چکی ہے۔ ایڈمن بینک/جازکیش اکاؤنٹ چیک کر کے تصدیق کرے گا جس کے بعد سیلر کام شروع کرے گا۔`
                      : 'Payment receipt submitted. Admin is currently verifying the funds into escrow.'}
                  </p>
                  <div className="text-[11px] text-blue-600">
                    نوٹ: آپ اوپر "Admin (Me)" پر سوئچ کر کے خود بھی اس ادائیگی کو فوری طور پر تصدیق کر سکتے ہیں!
                  </div>
                </div>
              )}

              {/* Status: Payment verified in Escrow */}
              {activeOrder.status === 'payment_verified' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{t('statusPaymentVerified')}</span>
                  </div>
                  <p className="text-emerald-800">
                    {language === 'ur'
                      ? 'رقم کامیابی سے ہنر بازار کے پاس جمع ہو چکی ہے۔ یہ رقم سیلر کو اس وقت ملے گی جب خریدار تسلی بخش ترسیل کی تصدیق کرے۔'
                      : 'Funds are securely verified in platform escrow.'}
                  </p>

                  {filterRole === 'seller' && (
                    <button
                      onClick={() => sellerAcceptOrder(activeOrder.id)}
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition cursor-pointer"
                    >
                      {t('sellerAcceptOrder')}
                    </button>
                  )}
                </div>
              )}

              {/* Status: In Progress (Seller can mark delivered) */}
              {(activeOrder.status === 'in_progress' || activeOrder.status === 'accepted') && (
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-indigo-900 font-bold">
                    <Clock className="w-4 h-4 text-indigo-700" />
                    <span>{t('statusInProgress')}</span>
                  </div>
                  <p className="text-indigo-800">
                    {filterRole === 'seller'
                      ? 'کام مکمل کرنے کے بعد نیچے دیے گئے بٹن پر کلک کر کے ترسیل کی اطلاع دیں۔'
                      : 'سیلر آپ کے آرڈر پر کام کر رہا ہے۔ آپ چیٹ کے ذریعے اپ ڈیٹ حاصل کر سکتے ہیں۔'}
                  </p>

                  {filterRole === 'seller' && (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="ترسیل کی تفصیل، ٹریکنگ نمبر، یا گوگل ڈرائیو لنک..."
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                      <button
                        onClick={() => handleDeliver(activeOrder.id)}
                        className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold transition cursor-pointer"
                      >
                        {t('sellerMarkDelivered')}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Status: Delivered (Buyer confirms delivery) */}
              {activeOrder.status === 'delivered' && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Package className="w-4 h-4 text-purple-700" />
                    <span>{t('statusDelivered')}</span>
                  </div>
                  {activeOrder.deliveryNotes && (
                    <div className="p-2.5 bg-white rounded-lg border border-purple-200 text-purple-950 font-medium">
                      نوٹ سیلر: {activeOrder.deliveryNotes}
                    </div>
                  )}
                  <p className="text-purple-800">
                    {filterRole === 'buyer'
                      ? 'سیلر نے کام کی ترسیل کر دی ہے۔ کام کا معائنہ کریں اور اطمینان کی صورت میں تصدیق فرمائیں تاکہ ایسکرو رقم سیلر کو دی جا سکے۔'
                      : 'آپ کی ترسیل خریدار کے جائزے کے لیے بھیج دی گئی ہے۔'}
                  </p>

                  {filterRole === 'buyer' && (
                    <button
                      onClick={() => buyerConfirmDelivery(activeOrder.id)}
                      className="w-full py-2.5 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t('buyerConfirmDelivery')}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Status: Completed (Buyer can leave Review) */}
              {activeOrder.status === 'completed' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{t('statusCompleted')}</span>
                  </div>
                  <p className="text-emerald-800">
                    {language === 'ur'
                      ? 'یہ آرڈر کامیابی سے مکمل ہو چکا ہے! سیلر کو ادائیگی کی منظوری دے دی گئی ہے۔'
                      : 'Order completed and delivery verified.'}
                  </p>

                  {filterRole === 'buyer' && !activeOrder.reviewSubmitted && (
                    <button
                      onClick={() => setReviewOrder(activeOrder)}
                      className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                      <span>{t('leaveReview')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <h3 className="font-bold text-base text-slate-900 nastaliq-heading">
              {t('leaveReview')}
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">اسٹار ریٹنگ:</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 stroke-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">اپنا تبصرہ لکھیں:</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="سیلر کے کام کا معیار اور تجربہ کیسا رہا؟"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewOrder(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  منسوخ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs"
                >
                  {t('submitReview')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
