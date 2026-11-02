import React, { useState } from 'react';
import { ProductItem, OrderItem, SavedAddress, PAKISTANI_CITIES } from '../types/market';
import { buildWhatsAppOrderUrl } from '../utils/helpers';
import { X, Truck, MapPin, Plus, Check } from 'lucide-react';

interface OrderModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (order: OrderItem) => void;
  savedAddresses: SavedAddress[];
  onSaveNewAddress: (addr: SavedAddress) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderPlaced,
  savedAddresses,
  onSaveNewAddress
}) => {
  if (!isOpen || !product) return null;

  const defaultAddr = savedAddresses[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedAddrId, setSelectedAddrId] = useState<string>(defaultAddr ? defaultAddr.id : 'new');
  
  // Custom or new address state
  const [buyerName, setBuyerName] = useState(defaultAddr?.fullName || '');
  const [buyerPhone, setBuyerPhone] = useState(defaultAddr?.phone || '');
  const [buyerCity, setBuyerCity] = useState(defaultAddr?.city || PAKISTANI_CITIES[0]);
  const [buyerArea, setBuyerArea] = useState(defaultAddr?.area || '');
  const [buyerAddress, setBuyerAddress] = useState(defaultAddr?.fullAddress || '');
  const [saveForFuture, setSaveForFuture] = useState(true);

  // Financials
  const itemsPrice = product.price * quantity;
  const shippingFee = product.shippingFee ?? 200;
  const codTotal = itemsPrice + shippingFee;

  const handleSelectAddress = (addr: SavedAddress) => {
    setSelectedAddrId(addr.id);
    setBuyerName(addr.fullName);
    setBuyerPhone(addr.phone);
    setBuyerCity(addr.city);
    setBuyerArea(addr.area);
    setBuyerAddress(addr.fullAddress);
  };

  const handleSwitchToNewAddress = () => {
    setSelectedAddrId('new');
    setBuyerName('');
    setBuyerPhone('');
    setBuyerArea('');
    setBuyerAddress('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim() || !buyerAddress.trim()) return;

    // Save address if requested
    if (selectedAddrId === 'new' && saveForFuture) {
      const newSaved: SavedAddress = {
        id: `addr_${Date.now()}`,
        fullName: buyerName.trim(),
        phone: buyerPhone.trim(),
        city: buyerCity,
        area: buyerArea.trim(),
        fullAddress: buyerAddress.trim(),
        isDefault: savedAddresses.length === 0
      };
      onSaveNewAddress(newSaved);
    }

    const orderId = `ord_${Date.now()}`;
    const dateFormatted = new Date().toLocaleDateString('ur-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const newOrder: OrderItem = {
      id: orderId,
      productId: product.id,
      productTitle: product.title,
      productPhoto: product.photoUrl,
      category: product.category,
      price: product.price,
      quantity,
      itemsPrice,
      shippingFee,
      totalPrice: codTotal,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerCity,
      buyerArea: buyerArea.trim(),
      buyerAddress: buyerAddress.trim(),
      sellerWhatsapp: product.whatsapp,
      city: product.city,
      date: dateFormatted,
      shippingStatus: 'placed',
      codStatus: 'pending',
      timeline: [
        {
          status: 'placed',
          titleUrdu: 'آرڈر موصول ہو گیا (Order Placed)',
          timestamp: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }) + ' · ' + dateFormatted,
          note: 'سیلر آرڈر چیک کر کے تصدیق کرے گا۔'
        }
      ]
    };

    onOrderPlaced(newOrder);

    // Build WhatsApp URL with full COD breakdown
    const waUrl = buildWhatsAppOrderUrl({
      sellerWhatsapp: product.whatsapp,
      productTitle: product.title,
      quantity,
      itemsPrice,
      shippingFee,
      totalPrice: codTotal,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      buyerCity,
      buyerArea: buyerArea.trim(),
      buyerAddress: buyerAddress.trim()
    });

    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950 overflow-hidden max-h-[92vh] flex flex-col animate-scale-up">
        {/* Modal Header */}
        <div className="p-4 bg-[#0f5132] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h3 className="font-bold text-base sm:text-lg font-nastaliq">
              آرڈر و کیش آن ڈیلیوری ترسیل
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Item summary banner */}
          <div className="p-3 bg-[#f6f4ee] dark:bg-[#121915] rounded-2xl border border-slate-200 dark:border-emerald-950 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-emerald-950 overflow-hidden flex items-center justify-center shrink-0">
              {product.photoUrl ? (
                <img src={product.photoUrl} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">🧶</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-xs sm:text-sm">
                {product.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                سیلر کا شہر: 📍 {product.city}
              </p>
              <p className="text-xs font-extrabold text-[#0f5132] dark:text-[#f4c542] tabular-nums mt-0.5">
                {product.price.toLocaleString()} روپے فی دانہ
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              تعداد (Quantity):
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-900 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-base hover:bg-slate-200 cursor-pointer"
              >
                -
              </button>
              <span className="font-extrabold text-base text-slate-900 dark:text-white tabular-nums px-3">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-900 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-base hover:bg-slate-200 cursor-pointer"
              >
                +
              </button>
              <div className="flex-1 text-end">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">اشیاء رقم:</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {itemsPrice.toLocaleString()} روپے
                </span>
              </div>
            </div>
          </div>

          {/* Saved Addresses Picker */}
          {savedAddresses.length > 0 && (
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-emerald-950">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#0f5132] dark:text-[#f4c542]" />
                  <span>محفوظ شدہ پتے (Saved Addresses):</span>
                </label>
                <button
                  type="button"
                  onClick={handleSwitchToNewAddress}
                  className="text-xs text-[#0f5132] dark:text-[#f4c542] hover:underline flex items-center gap-0.5 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>نیا پتہ درج کریں</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {savedAddresses.map((addr) => {
                  const isSel = selectedAddrId === addr.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectAddress(addr)}
                      className={`p-2.5 rounded-xl border text-start transition cursor-pointer ${
                        isSel
                          ? 'border-[#0f5132] bg-emerald-50/70 dark:bg-emerald-950/60 dark:border-[#f4c542]'
                          : 'border-slate-200 dark:border-emerald-950 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                        <span>{addr.fullName}</span>
                        {isSel && <Check className="w-3.5 h-3.5 text-[#0f5132] dark:text-[#f4c542]" />}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {addr.city} · {addr.phone}
                      </div>
                      <div className="text-[10px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                        {addr.fullAddress}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery Address Fields */}
          <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-emerald-950">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
              ترسیل کی تفصیلات (Delivery Address):
            </h4>

            {/* Name & Phone in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                  خریدار کا نام (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="مثلاً: خان زمان"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                  موبائل نمبر (Active Mobile Number) *
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] text-xs font-mono"
                />
              </div>
            </div>

            {/* City & Area in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                  شہر (City) *
                </label>
                <select
                  value={buyerCity}
                  onChange={(e) => setBuyerCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] text-xs font-medium"
                >
                  {PAKISTANI_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                  علاقہ / سیکٹر (Area / Sector)
                </label>
                <input
                  type="text"
                  value={buyerArea}
                  onChange={(e) => setBuyerArea(e.target.value)}
                  placeholder="مثلاً: حیات آباد فیز 2 / گلبرگ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] text-xs"
                />
              </div>
            </div>

            {/* Full Street Address */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                مکمل پتہ (Street / House / Landmark) *
              </label>
              <textarea
                required
                rows={2}
                value={buyerAddress}
                onChange={(e) => setBuyerAddress(e.target.value)}
                placeholder="مکان نمبر، گلی نمبر یا قریبی مشہور جگہ..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] text-xs"
              />
            </div>

            {selectedAddrId === 'new' && (
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveForFuture}
                  onChange={(e) => setSaveForFuture(e.target.checked)}
                  className="w-4 h-4 text-[#0f5132] rounded"
                />
                <span>یہ پتہ آئندہ آرڈرز کے لیے محفوظ رکھیں</span>
              </label>
            )}
          </div>

          {/* Shipping Charges & Cash on Delivery Breakdown */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>اشیاء کی قیمت ({quantity} دانہ):</span>
              <span className="font-semibold tabular-nums">{itemsPrice.toLocaleString()} روپے</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#0f5132] dark:text-[#f4c542]" />
                <span>ترسیل چارجز (Delivery Charges):</span>
              </span>
              <span className="font-semibold tabular-nums">
                {shippingFee === 0 ? (
                  <strong className="text-emerald-700 dark:text-emerald-300">مفت (Free)</strong>
                ) : (
                  `${shippingFee.toLocaleString()} روپے`
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-sm font-extrabold text-[#0f5132] dark:text-[#f4c542]">
              <span>کل واجب الادا رقم (Cash on Delivery):</span>
              <span className="text-base tabular-nums">{codTotal.toLocaleString()} روپے</span>
            </div>

            <div className="text-[11px] text-emerald-800 dark:text-emerald-300 pt-0.5">
              💵 ادائیگی: مال ملنے پر کورئیر رائیڈر کو ادا کریں (کیش آن ڈیلیوری)
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#f4c542] hover:bg-[#e5b634] active:scale-98 text-[#0f5132] font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-nastaliq"
          >
            <span>✅ آرڈر بھیجیں (واٹس ایپ)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
