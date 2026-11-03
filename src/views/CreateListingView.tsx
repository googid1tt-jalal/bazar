import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCategory, ListingType } from '../types';
import {
  Upload,
  Plus,
  X,
  CheckCircle,
  Video,
  ShoppingBag,
  Sparkles,
  Info,
  DollarSign,
  Clock,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';

interface CreateListingViewProps {
  onSuccess: (listingId: string) => void;
}

export const CreateListingView: React.FC<CreateListingViewProps> = ({ onSuccess }) => {
  const { addListing, currentUser, t, language, isRTL } = useApp();

  const [type, setType] = useState<ListingType>('gig');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListingCategory>('video_editing');
  const [price, setPrice] = useState<string>('3000');
  const [deliveryTime, setDeliveryTime] = useState('2 دن (48 Hours)');
  const [city, setCity] = useState(currentUser?.city || 'Peshawar');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState<string[]>([
    '/src/assets/images/video_editor_gig_1793620851205.jpg'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available image presets for fast selection
  const presetImages = [
    { label: 'Video Desk', url: '/src/assets/images/video_editor_gig_1793620851205.jpg' },
    { label: 'Peshawari Chappal', url: '/src/assets/images/peshawari_chappal_1793620850599.jpg' },
    { label: 'Swati Shawl', url: '/src/assets/images/swat_embroidered_shawl_1793620851668.jpg' },
    { label: 'Sidr Honey', url: '/src/assets/images/sidr_honey_jar_1793620854016.jpg' },
    { label: 'Tutoring / Study', url: '/src/assets/images/tutor_learning_session_1793620852755.jpg' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).slice(0, 5 - images.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPreset = (url: string) => {
    if (images.length < 5 && !images.includes(url)) {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const numPrice = Number(price) || 0;
  const platformFee = Math.round(numPrice * 0.1);
  const sellerPayout = numPrice - platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || numPrice <= 0 || images.length === 0) return;

    setIsSubmitting(true);

    const newListing = addListing({
      title,
      description,
      type,
      category,
      price: numPrice,
      deliveryTime,
      city,
      images,
      videoUrl: videoUrl || undefined,
      status: 'approved',
      featured: true
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(newListing.id);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 nastaliq-heading">
            {t('createListingTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'ur'
              ? 'اپنا ہنر یا سامان پاکستان کے قابل اعتماد خریداروں کے سامنے پیش کریں۔'
              : language === 'ps'
              ? 'خپل هنر او سامان د پاکستان باوري پیرودونکو ته وړاندې کړئ.'
              : 'Post your freelance gig or physical product with guaranteed escrow security.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* 1. Listing Type Toggle */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-800">
              {t('chooseType')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('gig');
                  if (category === 'handmade' || category === 'used_items') setCategory('video_editing');
                }}
                className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-3 ${
                  type === 'gig'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${type === 'gig' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">{t('typeGig')}</h4>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {language === 'ur' ? 'آن لائن سروسز جیسے ایڈیٹنگ، ڈیزائن، ترجمہ' : language === 'ps' ? 'آنلاین خدمات لکه ایډیټ، ژباړه' : 'Digital services & freelancing'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('product');
                  if (category === 'video_editing' || category === 'design') setCategory('handmade');
                }}
                className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer flex items-start gap-3 ${
                  type === 'product'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${type === 'product' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">{t('typeProduct')}</h4>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {language === 'ur' ? 'روایتی و استعمال شدہ سامان جیسے چپل، شال، شہد' : language === 'ps' ? 'څپلی، شالونه، د غرونو عسل' : 'Physical crafts & goods'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Listing Title */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-800">
              {t('listingTitleInput')} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('listingTitlePlaceholder')}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* 3. Category & City Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-800">
                {t('categorySelect')} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ListingCategory)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              >
                <option value="video_editing">{t('categoryVideo')}</option>
                <option value="design">{t('categoryDesign')}</option>
                <option value="writing_translation">{t('categoryWriting')}</option>
                <option value="tutoring">{t('categoryTutoring')}</option>
                <option value="repairs">{t('categoryRepairs')}</option>
                <option value="handmade">{t('categoryHandmade')}</option>
                <option value="used_items">{t('categoryUsed')}</option>
                <option value="local_services">{t('categoryServices')}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-800">
                {t('cityInput')} *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              >
                <option value="Peshawar">Peshawar (پشاور)</option>
                <option value="Quetta">Quetta (کوئٹہ)</option>
                <option value="Swat">Swat (سوات)</option>
                <option value="Mardan">Mardan (مردان)</option>
                <option value="Karak">Karak (کرک)</option>
                <option value="Bannu">Bannu (بنوں)</option>
                <option value="Islamabad">Islamabad (اسلام آباد)</option>
                <option value="Rawalpindi">Rawalpindi (راولپنڈی)</option>
                <option value="Lahore">Lahore (لاہور)</option>
                <option value="Karachi">Karachi (کراچی)</option>
              </select>
            </div>
          </div>

          {/* 4. Price & Delivery Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-800">
                {t('priceInput')} *
              </label>
              <div className="relative">
                <span className="absolute start-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                  ₨
                </span>
                <input
                  type="number"
                  required
                  min="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3500"
                  className="w-full ps-9 pe-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 tabular-nums font-bold"
                />
              </div>

              {/* Commission Breakdown strip */}
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>{language === 'ur' ? 'آپ کی کمائی (90%):' : language === 'ps' ? 'ستاسو پیسې (90%):' : 'You Earn (90%):'} <strong className="text-emerald-800">₨ {sellerPayout.toLocaleString()}</strong></span>
                <span>{language === 'ur' ? 'ہنر فیس (10%):' : language === 'ps' ? 'فیس (10%):' : 'Platform (10%):'} ₨ {platformFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-800">
                {t('deliveryTimeInput')} *
              </label>
              <input
                type="text"
                required
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                placeholder={t('deliveryTimePlaceholder')}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
          </div>

          {/* 5. Detailed Description */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-800">
              {t('descriptionInput')} *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
            />
          </div>

          {/* 6. Photos (Up to 5) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800">
                {t('photosUpload')} ({images.length}/5) *
              </label>
              <span className="text-[11px] text-slate-400">
                {language === 'ur' ? 'کم از کم 1 تصویر لازمی ہے' : language === 'ps' ? 'لږ تر لږه یو عکس اړین دی' : 'At least 1 photo required'}
              </span>
            </div>

            {/* Selected Images Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 group">
                  <img src={img} alt="upload" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 end-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-emerald-700 transition">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium">
                    {language === 'ur' ? 'تصویر چنیں' : language === 'ps' ? 'عکس پورته کړئ' : 'Upload'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Quick Presets Picker */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-1.5">
                {language === 'ur' ? 'یا روایتی پری سیٹ تصاویر میں سے منتخب کریں:' : language === 'ps' ? 'یا له چمتو عکسونو څخه وټاکئ:' : 'Or choose from artisan preset photos:'}
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
                {presetImages.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddPreset(preset.url)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 whitespace-nowrap flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Video URL (Optional) */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-800">
              {t('videoUrlInput')}
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting || images.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'اشاعت جاری ہے...' : t('publishListing')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
