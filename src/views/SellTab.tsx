import React, { useState } from 'react';
import { CATEGORIES, ProductItem } from '../types/market';
import { resizeAndCompressImage } from '../utils/helpers';
import { Upload, X, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface SellTabProps {
  onPublish: (item: ProductItem) => void;
}

export const SellTab: React.FC<SellTabProps> = ({ onPublish }) => {
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1].id); // default to 'embroidery_clothes'
  const [price, setPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('200');
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [city, setCity] = useState('پشاور');
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Preset fast photo samples if user wants to test quickly
  const craftPresets = [
    { label: 'پشاوری چپل', url: '/src/assets/images/peshawari_chappal_1793620850599.jpg' },
    { label: 'سواتی شال', url: '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg' },
    { label: 'خالص شہد', url: '/src/assets/images/sidr_honey_jar_1793620854016.jpg' }
  ];

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setErrorMessage('');
      // Requirement: resize to max 500px width and compress to JPEG 0.7
      const compressedDataUrl = await resizeAndCompressImage(file, 500, 0.7);
      setPhotoUrl(compressedDataUrl);
    } catch (err) {
      console.error('Image compression failed:', err);
      setErrorMessage('تصویر محفوظ کرنے میں دشواری پیش آئی۔ دوبارہ کوشش کریں۔');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !city.trim() || !whatsapp.trim() || !description.trim()) {
      setErrorMessage('براہ کرم تمام ضروری خانے پر کریں۔');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMessage('براہ کرم درست قیمت درج کریں۔');
      return;
    }

    const feeNumber = isFreeShipping ? 0 : (Number(shippingFee) || 0);

    const newItem: ProductItem = {
      id: `prod_${Date.now()}`,
      title: title.trim(),
      category,
      price: numPrice,
      shippingFee: feeNumber,
      city: city.trim(),
      whatsapp: whatsapp.trim(),
      description: description.trim(),
      photoUrl: photoUrl.trim(),
      createdAt: new Date().toISOString(),
      isMine: true
    };

    onPublish(newItem);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* 3-Step Hint Banner as specified */}
      <div className="p-4 rounded-2xl bg-[#0f5132] text-white shadow-sm border border-emerald-900 space-y-1">
        <h2 className="font-bold text-sm sm:text-base font-nastaliq">
          📢 نیا سامان یا دستکاری شائع کریں
        </h2>
        <p className="text-xs sm:text-sm text-[#f4c542] font-semibold leading-relaxed">
          1) تصویر لگائیں 2) نام اور قیمت لکھیں 3) شائع کریں دبائیں
        </p>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a241e] p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-emerald-950 shadow-xs space-y-5 text-xs sm:text-sm">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* 1. Photo Upload (Resizes to max 500px & JPEG 0.7) */}
        <div className="space-y-2">
          <label className="block font-bold text-slate-800 dark:text-slate-200">
            1. دستکاری کی تصویر لگائیں:
          </label>

          {photoUrl ? (
            <div className="relative aspect-4/3 w-full max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-[#0f5132] shadow-xs">
              <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
                className="absolute top-2 left-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex flex-col items-center justify-center aspect-4/3 max-w-xs mx-auto border-2 border-dashed border-slate-300 dark:border-emerald-900 rounded-2xl p-4 bg-[#f6f4ee] dark:bg-[#121915] text-slate-500 hover:border-[#0f5132] dark:hover:border-[#f4c542] cursor-pointer transition">
                <Upload className="w-8 h-8 mb-2 text-[#0f5132] dark:text-[#f4c542]" />
                <span className="font-bold text-xs text-slate-700 dark:text-slate-200">
                  {isCompressing ? 'تصویر تیار ہو رہی ہے...' : 'موبائل سے تصویر منتخب کریں'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  خودکار طور پر 500px کمپریس ہو جائے گی
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={isCompressing}
                  className="hidden"
                />
              </label>

              {/* Sample Craft Presets */}
              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-400 block mb-1">
                  یا تیار دستکاری تصویر منتخب کریں:
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {craftPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-emerald-950 bg-slate-50 dark:bg-emerald-950 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Item Name */}
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            2. چیز کا نام (Item Name) *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: پشاوری چپل / پشتون کڑھائی والی ٹوپی / سواتی شال"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
          />
        </div>

        {/* 3. Category Dropdown with Visual Icons */}
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            قسم (Category) *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] font-semibold"
          >
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Price & City in responsive 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              قیمت (Price in PKR) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="3000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] font-bold tabular-nums"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                روپے
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
              شہر (City) *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="مثلاً: پشاور، مردان، کوئٹہ، سوات"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
            />
          </div>
        </div>

        {/* 4b. Shipping Charges */}
        <div className="p-3 bg-slate-50 dark:bg-[#141d18] rounded-2xl border border-slate-200 dark:border-emerald-950 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              ترسیل / ڈلیوری فیس (Shipping Charges):
            </label>
            <label className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-[#f4c542] font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isFreeShipping}
                onChange={(e) => setIsFreeShipping(e.target.checked)}
                className="w-4 h-4 text-[#0f5132] rounded"
              />
              <span>مفت ترسیل (Free Delivery)</span>
            </label>
          </div>

          {!isFreeShipping && (
            <div className="relative">
              <input
                type="number"
                min="0"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                placeholder="200"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#121915] text-xs font-bold tabular-nums"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                روپے فیس
              </span>
            </div>
          )}
        </div>

        {/* 5. WhatsApp Number */}
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            واٹس ایپ نمبر (WhatsApp Number) *
          </label>
          <input
            type="tel"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="03001234567"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] font-mono"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            خریدار کا آرڈر براہ راست اس واٹس ایپ پر موصول ہو گا۔
          </span>
        </div>

        {/* 6. Description */}
        <div>
          <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
            تفصیل (Description) *
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="دستکاری کا معیار، سائز، مواد اور بنانے کی تفصیل لکھیں..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132]"
          />
        </div>

        {/* 7. Big Gold Publish Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-xl bg-[#f4c542] hover:bg-[#e5b634] active:scale-98 text-[#0f5132] font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-nastaliq"
        >
          <span>📢 شائع کریں</span>
        </button>
      </form>
    </div>
  );
};
