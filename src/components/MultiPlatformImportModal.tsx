import React, { useState } from 'react';
import { ProductItem, Language, CATEGORIES } from '../types/market';
import {
  PlatformType,
  MultiPlatformImportResult,
  MULTI_PLATFORM_PRESET_ITEMS,
  fetchMultiPlatformProduct,
  convertMultiPlatformResultToProductItem,
  detectPlatformFromUrl
} from '../utils/multiPlatformImporter';
import {
  PackagePlus,
  X,
  Search,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Building2,
  ShoppingBag,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

interface MultiPlatformImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (product: ProductItem) => void;
  currentLanguage?: Language;
}

export const MultiPlatformImportModal: React.FC<MultiPlatformImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  currentLanguage = 'ur'
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('Amazon');
  const [urlInput, setUrlInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedResult, setFetchedResult] = useState<MultiPlatformImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editable fields before publishing
  const [customPricePkr, setCustomPricePkr] = useState<number | string>('');
  const [selectedCategory, setSelectedCategory] = useState('electrician_tools');

  if (!isOpen) return null;

  const handleFetch = async (inputStr: string) => {
    if (!inputStr.trim()) {
      setErrorMsg('براہ کرم کسی بھی پلیٹ فارم (Amazon, Alibaba, Daraz, Markaz) کی لنک درج کریں۔');
      return;
    }

    try {
      setIsFetching(true);
      setErrorMsg('');
      setSuccessMsg('');

      const detected = detectPlatformFromUrl(inputStr);
      setSelectedPlatform(detected);

      const result = await fetchMultiPlatformProduct(inputStr.trim(), detected);
      setFetchedResult(result);
      setCustomPricePkr(result.retailPricePkr);
      setSelectedCategory(result.category);
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMsg('پروڈکٹ کا لنک پروسیس کرنے میں مسئلہ آیا۔ ذیل میں تیار آئٹمز میں سے چنیں۔');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSelectPreset = (preset: MultiPlatformImportResult) => {
    setSelectedPlatform(preset.platform);
    setFetchedResult(preset);
    setCustomPricePkr(preset.retailPricePkr);
    setSelectedCategory(preset.category);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleConfirmPublish = () => {
    if (!fetchedResult) return;

    const finalPrice = Number(customPricePkr) || fetchedResult.retailPricePkr;
    const itemToImport = convertMultiPlatformResultToProductItem(fetchedResult);
    itemToImport.price = finalPrice;
    itemToImport.category = selectedCategory;

    onImportSuccess(itemToImport);
    setSuccessMsg(`${fetchedResult.platform} سے پروڈکٹ ہنر بازار مارکیٹ پلیس میں شامل ہو گیا!`);

    setTimeout(() => {
      setSuccessMsg('');
      setFetchedResult(null);
      setUrlInput('');
      onClose();
    }, 1500);
  };

  const filteredPresets = MULTI_PLATFORM_PRESET_ITEMS.filter(
    (p) => p.platform === selectedPlatform
  );

  return (
    <div className="fixed inset-[#000] z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-900 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f5132] via-[#12623d] to-[#0a3a24] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#f4c542] text-[#0f5132] flex items-center justify-center font-black shadow-md shrink-0">
              <PackagePlus className="w-6 h-6 text-[#0f5132]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black font-nastaliq text-white">
                  🌐 ملٹی پلیٹ فارم امپورٹ (Amazon, Alibaba, Daraz, Markaz)
                </h2>
                <span className="text-[10px] font-bold text-amber-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Automated API Sync
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium font-nastaliq">
                امیزون، علی بابا ہول سیل، دراز اور مرکز ایپ کے پروڈکٹس 1-کلک میں لائیں
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 transition cursor-pointer"
            title="بند کریں"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Platform Tabs Bar */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800 dark:text-slate-200 font-nastaliq text-xs">
              سورس پلیٹ فارم منتخب کریں (Source Platform):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPlatform('Amazon')}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  selectedPlatform === 'Amazon'
                    ? 'bg-[#0f5132] text-white border-emerald-800 shadow-sm font-black'
                    : 'bg-slate-50 dark:bg-[#141d18] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-900 hover:bg-slate-100'
                }`}
              >
                <span>📦 Amazon</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform('Alibaba')}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  selectedPlatform === 'Alibaba'
                    ? 'bg-[#0f5132] text-white border-emerald-800 shadow-sm font-black'
                    : 'bg-slate-50 dark:bg-[#141d18] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-900 hover:bg-slate-100'
                }`}
              >
                <span>🏭 Alibaba</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform('Daraz')}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  selectedPlatform === 'Daraz'
                    ? 'bg-[#0f5132] text-white border-emerald-800 shadow-sm font-black'
                    : 'bg-slate-50 dark:bg-[#141d18] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-900 hover:bg-slate-100'
                }`}
              >
                <span>🟠 Daraz PK</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform('Markaz')}
                className={`py-2.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                  selectedPlatform === 'Markaz'
                    ? 'bg-[#0f5132] text-white border-emerald-800 shadow-sm font-black'
                    : 'bg-slate-50 dark:bg-[#141d18] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-900 hover:bg-slate-100'
                }`}
              >
                <span>🟢 Markaz App</span>
              </button>
            </div>
          </div>

          {/* 2. URL Input Field */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800 dark:text-slate-200 font-nastaliq text-xs">
              {selectedPlatform} پروڈکٹ کا لنک یا کٹلاگ کوڈ درج کریں:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={`https://www.${selectedPlatform.toLowerCase()}.com/product/12345...`}
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-300 dark:border-emerald-900 bg-slate-50 dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] font-mono text-xs"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => handleFetch(urlInput)}
                disabled={isFetching}
                className="px-4 py-2.5 rounded-2xl bg-[#0f5132] hover:bg-[#12623d] active:scale-95 text-white font-black transition cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0 font-nastaliq text-xs"
              >
                {isFetching ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#f4c542]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#f4c542]" />
                )}
                <span>امپورٹ کریں</span>
              </button>
            </div>
          </div>

          {/* 3. Preset Catalogue per Selected Platform */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-emerald-950">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700 dark:text-slate-300 font-nastaliq text-xs">
                تیار {selectedPlatform} کٹلاگ آئٹمز (1-Click Import):
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200">
                ⭐ Top Verified Catalog
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto p-1">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    fetchedResult?.id === preset.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-[#0f5132] ring-2 ring-[#0f5132]'
                      : 'bg-white dark:bg-[#141d18] border-slate-200 dark:border-emerald-900 hover:border-emerald-600'
                  }`}
                >
                  <img
                    src={preset.photoUrl}
                    alt={preset.title}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {preset.titleUrdu}
                    </h4>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-[#0f5132] dark:text-[#f4c542] font-mono">
                        ₨ {preset.retailPricePkr.toLocaleString()}
                      </span>
                      {preset.wholesalePricePkr && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                          (ہول سیل: ₨ {preset.wholesalePricePkr.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Fetched Product Preview */}
          {fetchedResult && (
            <div className="p-4 rounded-3xl bg-amber-50/80 dark:bg-emerald-950/40 border-2 border-[#0f5132] space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0f5132] dark:text-[#f4c542] flex items-center gap-1 font-nastaliq">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{fetchedResult.platform} پروڈکٹ موصول ہو گیا — شائع کریں</span>
                </span>
                <span className="text-[10px] font-bold bg-white dark:bg-black px-2 py-0.5 rounded-full border text-slate-700 dark:text-slate-200">
                  {fetchedResult.sellerBadge}
                </span>
              </div>

              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                <img
                  src={fetchedResult.photoUrl}
                  alt={fetchedResult.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border-2 border-white shadow-sm shrink-0"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                    {fetchedResult.titleUrdu}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {fetchedResult.descriptionUrdu}
                  </p>
                  <div className="flex items-center gap-3 text-xs flex-wrap pt-1 font-mono">
                    <span className="font-black text-[#0f5132] dark:text-[#f4c542] text-sm sm:text-base">
                      قیمت: ₨ {fetchedResult.retailPricePkr.toLocaleString()}
                    </span>
                    {fetchedResult.wholesalePricePkr && (
                      <span className="text-amber-700 dark:text-amber-400 font-bold text-xs">
                        ہول سیل ریٹ: ₨ {fetchedResult.wholesalePricePkr.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200 dark:border-emerald-900">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    مقامی مارکیٹ قیمت (PKR Price):
                  </label>
                  <input
                    type="number"
                    value={customPricePkr}
                    onChange={(e) => setCustomPricePkr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-xs font-extrabold tabular-nums text-[#0f5132] dark:text-[#f4c542]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    کیٹیگری (Category):
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-900 bg-white dark:bg-[#141d18] text-xs font-bold"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.nameUrdu}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Final Publish Button */}
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="w-full py-3 px-4 rounded-2xl bg-[#f4c542] hover:bg-[#e5b634] active:scale-98 text-[#0f5132] font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md font-nastaliq"
              >
                <span>✅ ہنر بازار مارکیٹ میں ابھی شامل کریں</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
