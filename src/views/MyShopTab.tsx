import React, { useState } from 'react';
import { ProductItem, OrderItem, CourierService, BidItem } from '../types/market';
import { ProductCard } from '../components/ProductCard';
import { SellerStats } from '../components/SellerStats';
import { formatToPakistaniWhatsapp } from '../utils/helpers';
import {
  Store,
  Truck,
  DollarSign,
  PackageCheck,
  Printer,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Gavel,
  Check,
  X,
  MessageCircle,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface MyShopTabProps {
  products: ProductItem[];
  orders: OrderItem[];
  couriers: CourierService[];
  bids: BidItem[];
  onDeleteProduct: (id: string) => void;
  onGoToSell: () => void;
  onOpenShipmentModal: (order: OrderItem) => void;
  onOpenShippingLabel: (order: OrderItem) => void;
  onAcceptBid: (bidId: string) => void;
  onDeclineBid: (bidId: string) => void;
  onBid?: (product: ProductItem) => void;
}

export const MyShopTab: React.FC<MyShopTabProps> = ({
  products,
  orders,
  couriers,
  bids,
  onDeleteProduct,
  onGoToSell,
  onOpenShipmentModal,
  onOpenShippingLabel,
  onAcceptBid,
  onDeclineBid,
  onBid
}) => {
  const [subTab, setSubTab] = useState<'products' | 'bids' | 'shipping' | 'earnings'>('products');
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

  // Filter only items posted by me
  const myProducts = products.filter((p) => p.isMine);

  // Filter orders for my products (or all orders in dev session so seller can test immediately)
  const myProductTitles = new Set(myProducts.map((p) => p.title));
  const sellerOrders = orders.filter((o) => myProductTitles.has(o.productTitle) || myProducts.length === 0 || o.id);

  // Bids metrics
  const pendingBidsCount = bids.filter((b) => b.status === 'pending').length;

  // Shipping metrics
  const readyToShipCount = sellerOrders.filter(
    (o) => o.shippingStatus === 'placed' || o.shippingStatus === 'confirmed' || o.shippingStatus === 'packed'
  ).length;

  const inTransitCount = sellerOrders.filter(
    (o) => o.shippingStatus === 'shipped' || o.shippingStatus === 'out_for_delivery'
  ).length;

  const deliveredCount = sellerOrders.filter((o) => o.shippingStatus === 'delivered').length;

  // COD & Earnings calculation
  const totalDeliveredCOD = sellerOrders
    .filter((o) => o.shippingStatus === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const platformCommission = Math.round(totalDeliveredCOD * 0.1); // 10%
  const sellerNetEarnings = totalDeliveredCOD - platformCommission;

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header & Sub-Tab Bar */}
      <div className="bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Store className="w-5 h-5 text-[#0f5132] dark:text-[#f4c542]" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-nastaliq">
                سیلر ڈیش بورڈ و دکان (Seller Dashboard)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مصنوعات، موصولہ بولیاں، پارسل ترسیل، اور کیش آن ڈیلیوری آمدن
              </p>
            </div>
          </div>

          <button
            onClick={onGoToSell}
            className="px-3.5 py-2 rounded-xl bg-[#f4c542] hover:bg-[#e5b634] text-[#0f5132] font-extrabold text-xs shadow-xs transition cursor-pointer font-nastaliq flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>نیا آئٹم لگائیں</span>
          </button>
        </div>

        {/* 4 Sub-Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-[#121915] rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setSubTab('products')}
            className={`py-2 px-2 text-center rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'products'
                ? 'bg-white dark:bg-[#1e2b24] text-[#0f5132] dark:text-[#f4c542] font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>میری مصنوعات ({myProducts.length})</span>
          </button>

          <button
            onClick={() => setSubTab('bids')}
            className={`py-2 px-2 text-center rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'bids'
                ? 'bg-white dark:bg-[#1e2b24] text-[#0f5132] dark:text-[#f4c542] font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>بولیاں و آفرز</span>
            {pendingBidsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0f5132] text-white text-[10px] flex items-center justify-center font-bold">
                {pendingBidsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('shipping')}
            className={`py-2 px-2 text-center rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'shipping'
                ? 'bg-white dark:bg-[#1e2b24] text-[#0f5132] dark:text-[#f4c542] font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>شپنگ و پارسلز</span>
            {readyToShipCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {readyToShipCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('earnings')}
            className={`py-2 px-2 text-center rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              subTab === 'earnings'
                ? 'bg-white dark:bg-[#1e2b24] text-[#0f5132] dark:text-[#f4c542] font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>آمدن و COD لیجر</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: My Products */}
      {subTab === 'products' && (
        <div className="space-y-4">
          {myProducts.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 p-6 space-y-3">
              <div className="text-5xl select-none">📦</div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 font-nastaliq">
                آپ نے ابھی تک کوئی چیز شائع نہیں کی
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                ہنر بازار پر اپنا سامان لگائیں تاکہ خریدار واٹس ایپ پر آرڈر بھیج سکیں۔
              </p>
              <button
                onClick={onGoToSell}
                className="px-5 py-2.5 rounded-xl bg-[#0f5132] text-white hover:bg-emerald-900 font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer"
              >
                📢 ابھی پہلا آئٹم لگائیں
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {myProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showDelete={true}
                  onDelete={() => setProductToDelete(product)}
                />
              ))}
            </div>
          )}

          {/* Bottom WhatsApp Note */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 shadow-xs">
            <span className="text-lg">💬</span>
            <span className="font-bold leading-relaxed">
              نوٹ: خریدار کا آرڈر آپ کے واٹس ایپ پر آئے گا۔
            </span>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Bids & Offers Management */}
      {subTab === 'bids' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-[#1a241e] rounded-2xl border border-slate-200 dark:border-emerald-950 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-[#f4c542] flex items-center justify-center font-bold">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-nastaliq">
                  دستکاری بولیاں اور خریدار پیشکشیں (Bids & Custom Offers)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  خریدار کی جانب سے موصول ہونے والی بولیاں قبول کر کے فوری آرڈر میں تبدیل کریں
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-[#f4c542] font-bold text-xs border border-amber-200 dark:border-amber-800">
              کل بولیاں: {bids.length}
            </span>
          </div>

          {bids.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 p-6 space-y-3">
              <div className="text-5xl select-none">🔨</div>
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-200 font-nastaliq">
                ابھی تک کوئی بولی یا پیشکش موصول نہیں ہوئی
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                جب خریدار آپ کے سامان پر اپنی مرضی کی قیمت پیش کریں گے تو وہ یہاں نظر آئیں گی۔
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((bid) => {
                const diff = bid.bidAmount - bid.askingPrice;
                const diffPercent = Math.abs(Math.round((diff / bid.askingPrice) * 100));
                const bidderWaClean = formatToPakistaniWhatsapp(bid.bidderPhone);
                const negotiateText = `السلام علیکم ${bid.bidderName}! ہنر بازار پر آپ کی "${bid.productTitle}" کے لیے ₨ ${bid.bidAmount.toLocaleString()} کی پیشکش موصول ہوئی ہے۔`;

                return (
                  <div
                    key={bid.id}
                    className="p-4 bg-white dark:bg-[#1a241e] rounded-2xl border border-slate-200 dark:border-emerald-950 shadow-xs space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#141d18] overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-emerald-900">
                          {bid.productPhoto ? (
                            <img
                              src={bid.productPhoto}
                              alt={bid.productTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">🧶</span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {bid.productTitle}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            <span>مانگی گئی قیمت: ₨ {bid.askingPrice.toLocaleString()}</span>
                            <span>•</span>
                            <span>{bid.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          bid.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                            : bid.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                        }`}
                      >
                        {bid.status === 'pending'
                          ? 'زیرِ جائزہ ⏳ (Pending)'
                          : bid.status === 'accepted'
                          ? 'منظور شدہ ✅ (Accepted)'
                          : 'مسترد ❌ (Declined)'}
                      </span>
                    </div>

                    {/* Bidder & Amount Info Box */}
                    <div className="p-3 bg-slate-50 dark:bg-[#121915] rounded-xl border border-slate-200 dark:border-emerald-950 flex items-center justify-between flex-wrap gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">خریدار (Bidder):</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {bid.bidderName} ({bid.bidderCity}) · 📞 {bid.bidderPhone}
                        </span>
                      </div>

                      <div className="text-end">
                        <span className="text-slate-500 block text-[11px]">پیشکش کردہ رقم (Offer):</span>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-base sm:text-lg font-black text-[#0f5132] dark:text-[#f4c542] tabular-nums font-mono">
                            ₨ {bid.bidAmount.toLocaleString()}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              diff < 0
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {diff < 0 ? `₨ ${Math.abs(diff)} کم (-${diffPercent}%)` : `+₨ ${diff}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bid Message Note */}
                    {bid.message && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/50">
                        <span className="font-bold text-amber-900 dark:text-amber-300">خریدار کا نوٹ: </span>
                        {bid.message}
                      </p>
                    )}

                    {/* Actions if Pending */}
                    {bid.status === 'pending' && (
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <button
                          onClick={() => onAcceptBid(bid.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs font-nastaliq"
                        >
                          <Check className="w-3.5 h-3.5 text-[#f4c542]" />
                          <span>✅ پیشکش منظور کریں (آرڈر بنائیں)</span>
                        </button>

                        <button
                          onClick={() => onDeclineBid(bid.id)}
                          className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer font-nastaliq"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>مسترد</span>
                        </button>

                        <a
                          href={`https://wa.me/${bidderWaClean}?text=${encodeURIComponent(negotiateText)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs font-nastaliq"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                          <span>واٹس ایپ پر مول تول</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Shipping & Parcels Flow */}
      {subTab === 'shipping' && (
        <div className="space-y-4">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-950 shadow-xs">
              <span className="text-[11px] text-slate-400 block font-medium">تیار برائے شپنگ</span>
              <span className="text-lg sm:text-xl font-bold text-amber-600 tabular-nums">
                {readyToShipCount}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-950 shadow-xs">
              <span className="text-[11px] text-slate-400 block font-medium">راستے میں (In Transit)</span>
              <span className="text-lg sm:text-xl font-bold text-blue-600 tabular-nums">
                {inTransitCount}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-950 shadow-xs">
              <span className="text-[11px] text-slate-400 block font-medium">کامیاب ترسیلات</span>
              <span className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-[#f4c542] tabular-nums">
                {deliveredCount}
              </span>
            </div>
          </div>

          {/* Orders List for Shipping */}
          {sellerOrders.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 p-6 text-slate-400 text-xs">
              ابھی تک کوئی آرڈر موصول نہیں ہوا۔ خریدار کے واٹس ایپ پر آرڈر دینے کے بعد وہ یہاں ظاہر ہو گا۔
            </div>
          ) : (
            <div className="space-y-3">
              {sellerOrders.map((order) => {
                const isReady = order.shippingStatus === 'placed' || order.shippingStatus === 'confirmed';
                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1c2621] border border-slate-200 dark:border-emerald-950 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            آرڈر #{order.id} - {order.productTitle}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isReady
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : order.shippingStatus === 'shipped' || order.shippingStatus === 'out_for_delivery'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {order.shippingStatus === 'placed' ? 'نیا آرڈر (Placed)' :
                             order.shippingStatus === 'confirmed' ? 'تصدیق شدہ (Confirmed)' :
                             order.shippingStatus === 'packed' ? 'پیک شدہ (Packed)' :
                             order.shippingStatus === 'shipped' ? 'کورئیر روانہ (Shipped)' :
                             order.shippingStatus === 'out_for_delivery' ? 'رائیڈر کے پاس (Out for Delivery)' :
                             order.shippingStatus === 'delivered' ? 'ترسیل مکمل (Delivered)' :
                             order.shippingStatus}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          خریدار: <strong>{order.buyerName}</strong> · 📞 {order.buyerPhone}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          📍 {order.buyerArea ? `${order.buyerArea}، ` : ''}{order.buyerAddress}، {order.buyerCity}
                        </p>
                      </div>

                      <div className="text-end">
                        <span className="text-xs text-slate-400 block">سی او ڈی وصولی:</span>
                        <span className="text-sm sm:text-base font-extrabold text-[#0f5132] dark:text-[#f4c542] tabular-nums">
                          ₨ {order.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Courier and CN info if assigned */}
                    {order.trackingNumber && (
                      <div className="p-2.5 bg-slate-50 dark:bg-[#141d18] rounded-xl flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                        <span>کورئیر: <strong>{order.courierName}</strong></span>
                        <span className="font-mono text-emerald-800 dark:text-[#f4c542]">
                          CN: <strong>{order.trackingNumber}</strong>
                        </span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-end gap-2 flex-wrap">
                      <button
                        onClick={() => onOpenShippingLabel(order)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-emerald-900 bg-slate-50 dark:bg-[#141d18] hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#0f5132] dark:text-[#f4c542]" />
                        <span>پیکنگ سلپ پرنٹ</span>
                      </button>

                      <button
                        onClick={() => onOpenShipmentModal(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#f4c542]" />
                        <span>شپنگ و کورئیر کنٹرول</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: COD & Earnings Ledger + Monthly Recharts Analytics */}
      {subTab === 'earnings' && (
        <div className="space-y-5">
          {/* Recharts Monthly Sales, Commission, and Delivery Success Rates */}
          <SellerStats orders={sellerOrders} />


          {/* COD Settlement History Table */}
          <div className="bg-white dark:bg-[#1a241e] rounded-2xl border border-slate-200 dark:border-emerald-950 p-4 space-y-3">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-nastaliq">
              کیش آن ڈیلیوری آرڈرز لیجر (COD Orders Ledger):
            </h4>

            {sellerOrders.length === 0 ? (
              <p className="text-slate-400 text-xs py-4 text-center">کوئی ٹرانزیکشن موجود نہیں ہے۔</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-emerald-950 text-slate-500">
                      <th className="py-2 text-start font-bold">آرڈر #</th>
                      <th className="py-2 text-start font-bold">سامان</th>
                      <th className="py-2 text-start font-bold">کورئیر</th>
                      <th className="py-2 text-start font-bold">رقم</th>
                      <th className="py-2 text-start font-bold">COD اسٹیٹس</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-emerald-950/60">
                    {sellerOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-[#141d18]">
                        <td className="py-2.5 font-bold font-mono">#{o.id.slice(-6)}</td>
                        <td className="py-2.5 truncate max-w-xs">{o.productTitle}</td>
                        <td className="py-2.5">{o.courierName || 'زیرِ فیصلہ'}</td>
                        <td className="py-2.5 font-bold tabular-nums">₨ {o.totalPrice.toLocaleString()}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.shippingStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {o.shippingStatus === 'delivered' ? 'وصول شدہ (Collected)' : 'پینڈنگ (Pending)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#1a241e] rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-emerald-950 space-y-4 animate-scale-up">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-nastaliq">
                آئٹم حذف کریں؟
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              کیا آپ واقعی <strong>"{productToDelete.title}"</strong> کو اپنی دکان اور بازار سے حذف کرنا چاہتے ہیں؟
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                منسوخ
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                ہاں، حذف کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
