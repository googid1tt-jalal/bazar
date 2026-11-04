import React, { useState } from 'react';
import { ProductItem, Language, CATEGORIES, PAKISTANI_CITIES } from '../types/market';
import {
  AMAZON_PRESET_ITEMS,
  AmazonImportResult,
  fetchAmazonProduct,
  convertAmazonResultToProductItem,
  extractAsinFromUrl
} from '../utils/amazonImporter';
import { t } from '../locales/translations';
import {
  PackagePlus,
  X,
  Search,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  DollarSign,
  ArrowRight,
  Info,
  RefreshCw
} from 'lucide-react';

interface AmazonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (product: ProductItem) => void;
  currentLanguage?: Language;
}

export const AmazonImportModal: React.FC<AmazonImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  currentLanguage = 'ur'
}) => {
  const [amazonUrlInput, setAmazonUrlInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedResult, setFetchedResult] = useState<AmazonImportResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editable preview fields
  const [customPricePkr, setCustomPricePkr] = useState<number | string>('');
  const [selectedCity, setSelectedCity] = useState('پشاور (Peshawar)');
  const [customCategory, setCustomCategory] = useState('chappal');

  if (!isOpen) return null;

  const handleFetch = async (urlOrAsin: string) => {
    if (!urlOrAsin.trim()) {
      setErrorMsg(
        currentLanguage === 'en'
          ? 'Please enter an Amazon link or ASIN.'
          : 'براہ کرم ایمیزون کی لنکس یا پروڈکٹ کوڈ (ASIN) درج کریں۔'
      );
      return;
    }

    try {
      setIsFetching(true);
      setErrorMsg('');
      setSuccessMsg('');

      const result = await fetchAmazonProduct(urlOrAsin.trim());
      setFetchedResult(result);
      setCustomPricePkr(result.pricePkr);
      setCustomCategory(result.category);
    } catch (err) {
      console.error('Amazon import error:', err);
      setErrorMsg(
        currentLanguage === 'en'
          ? 'Failed to fetch product from Amazon link. Please try a preset item below.'
          : 'ایمیزون لنک سے ڈیٹا حاصل کرنے میں ناکامی ہوئی۔ ذیل میں دیے گئے ایمیزون آئٹمز میں سے چنیں۔'
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleSelectPreset = (preset: AmazonImportResult) => {
    setFetchedResult(preset);
    setCustomPricePkr(preset.pricePkr);
    setCustomCategory(preset.category);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleConfirmPublish = () => {
    if (!fetchedResult) return;

    const priceNum = Number(customPricePkr) || fetchedResult.pricePkr;
    const itemToImport = convertAmazonResultToProductItem(fetchedResult, selectedCity);
    itemToImport.price = priceNum;
    itemToImport.category = customCategory;

    onImportSuccess(itemToImport);
    setSuccessMsg(
      currentLanguage === 'en'
        ? 'Amazon product imported successfully!'
        : 'ایمیزون پروڈکٹ ہنر بازار میں کامیابی سے شائع ہو گیا!'
    );

    setTimeout(() => {
      setSuccessMsg('');
      setFetchedResult(null);
      setAmazonUrlInput('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-[#000] z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-900 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f5132] to-[#12623d] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f4c542] text-[#0f5132] flex items-center justify-center font-black shadow-md">
              <PackagePlus className="w-6 h-6 text-[#0f5132]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-nastaliq text-white">
                  📦 {currentLanguage === 'en' ? 'Amazon Product Importer' : 'ایمیزون پروڈکٹ امپورٹ (Amazon Import)'}
                </h2>
                <span className="text-[10px] font-bold text-amber-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Automated Scraper & API
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium font-nastaliq">
                ایمیزون لنکس سے پروڈکٹ کا عنوان، تصویر اور قیمت خودکار پاکستان مارکیٹ میں شائع کریں
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

        {/* Scrollable Content */}
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

          {/* 1. URL / ASIN Input Box */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800 dark:text-slate-200 font-nastaliq text-sm">
              1. ایمیزون پروڈکٹ لنک یا ASIN کوڈ درج کریں (Paste Amazon URL / ASIN):
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={amazonUrlInput}
                  onChange={(e) => setAmazonUrlInput(e.target.value)}
                  placeholder="https://www.amazon.com/dp/B08N5WRWNW یا B08N5WRWNW..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-slate-300 dark:border-emerald-900 bg-slate-50 dark:bg-[#141d18] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f5132] font-mono text-xs"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => handleFetch(amazonUrlInput)}
                disabled={isFetching}
                className="px-4 py-2.5 rounded-2xl bg-[#0f5132] hover:bg-[#12623d] active:scale-95 text-white font-extrabold transition cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0 font-nastaliq"
              >
                {isFetching ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#f4c542]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#f4c542]" />
                )}
                <span>درآمد کریں</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              مثال: ایمیزون پروڈکٹ کے صفحے کا لنک کاپی کر کے یہاں پیسٹ کریں۔ سسٹم قیمت (USD) کو خودکار PKR میں بدل دے گا۔
            </p>
          </div>

          {/* 2. Curated Amazon Presets (1-Click Demo Import) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-emerald-950">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700 dark:text-slate-300 font-nastaliq text-xs">
                یا تیار ایمیزون پروڈکٹس سے منتخب کریں (1-Click Presets):
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                ⭐ Prime & Choice Items
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {AMAZON_PRESET_ITEMS.map((preset) => (
                <div
                  key={preset.asin}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    fetchedResult?.asin === preset.asin
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-[#0f5132] ring-2 ring-[#0f5132]'
                      : 'bg-white dark:bg-[#141d18] border-slate-200 dark:border-emerald-900 hover:border-emerald-600'
                  }`}
                >
                  <img
                    src={preset.photoUrl}
                    alt={preset.title}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {preset.titleUrdu}
                    </h4>
                    <div className="flex items-center justify-between mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-[#0f5132] dark:text-[#f4c542]">
                        ₨ {preset.pricePkr.toLocaleString()} (${preset.priceUsd})
                      </span>
                      <span className="text-amber-500 font-bold">⭐ {preset.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Fetched Result Preview & Publish Form */}
          {fetchedResult && (
            <div className="p-4 rounded-3xl bg-amber-50/70 dark:bg-emerald-950/40 border-2 border-[#0f5132] dark:border-emerald-700 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0f5132] dark:text-[#f4c542] flex items-center gap-1 font-nastaliq">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ایمیزون پروڈکٹ تیار ہے — تفصیل کا جائزہ لیں</span>
                </span>
                <span className="text-[10px] font-mono bg-white dark:bg-black px-2 py-0.5 rounded-md border text-slate-600 dark:text-slate-300">
                  ASIN: {fetchedResult.asin}
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
                  <div className="flex items-center gap-3 text-xs flex-wrap pt-1">
                    <span className="font-bold text-slate-500 dark:text-slate-400">
                      اصلی قیمت: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">${fetchedResult.priceUsd} USD</span>
                    </span>
                    <span className="font-bold text-[#0f5132] dark:text-[#f4c542]">
                      حسب تبدیل: <span className="font-mono font-extrabold text-base">₨ {fetchedResult.pricePkr.toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable Fields for local bazaar listing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200 dark:border-emerald-900">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    مقامی مارکیٹ قیمت (Selling Price PKR):
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
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
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

              {/* Action publish button */}
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="w-full py-3 px-4 rounded-2xl bg-[#f4c542] hover:bg-[#e5b634] active:scale-98 text-[#0f5132] font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md font-nastaliq"
              >
                <span>✅ ہنر بازار مارکیٹ میں ابھی شائع کریں</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
