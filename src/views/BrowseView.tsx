import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from '../components/ListingCard';
import { ListingCategory, ListingType } from '../types';
import { Search, Filter, SlidersHorizontal, RotateCcw, MapPin, Tag } from 'lucide-react';

interface BrowseViewProps {
  initialCategory?: ListingCategory;
  onSelectListing: (id: string) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({ initialCategory, onSelectListing }) => {
  const { listings, t, language } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'all'>(
    initialCategory || 'all'
  );
  const [selectedType, setSelectedType] = useState<ListingType | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Extract unique cities
  const cities = useMemo(() => {
    const list = Array.from(new Set(listings.map(l => l.city)));
    return ['all', ...list];
  }, [listings]);

  // Categories list
  const categoriesList: { id: ListingCategory | 'all'; label: string }[] = [
    { id: 'all', label: t('allCategories') },
    { id: 'video_editing', label: t('categoryVideo') },
    { id: 'handmade', label: t('categoryHandmade') },
    { id: 'design', label: t('categoryDesign') },
    { id: 'writing_translation', label: t('categoryWriting') },
    { id: 'tutoring', label: t('categoryTutoring') },
    { id: 'used_items', label: t('categoryUsed') },
    { id: 'repairs', label: t('categoryRepairs') },
    { id: 'local_services', label: t('categoryServices') },
  ];

  // Filtering Logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        if (item.status !== 'approved') return false;

        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchSeller = item.sellerName.toLowerCase().includes(q);
          const matchCity = item.city.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSeller && !matchCity) return false;
        }

        // Category
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Type (Gig vs Product)
        if (selectedType !== 'all' && item.type !== selectedType) {
          return false;
        }

        // City
        if (selectedCity !== 'all' && item.city !== selectedCity) {
          return false;
        }

        // Min Price
        if (minPrice && item.price < Number(minPrice)) {
          return false;
        }

        // Max Price
        if (maxPrice && item.price > Number(maxPrice)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.sellerRating - a.sellerRating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [listings, search, selectedCategory, selectedType, selectedCity, minPrice, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedCity('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('featured');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Search & Top Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full ps-10 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition"
            />
          </div>

          {/* Type Toggle: Gigs vs Products vs All */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedType === 'all' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterAll')}
            </button>
            <button
              onClick={() => setSelectedType('gig')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedType === 'gig' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterGigs')}
            </button>
            <button
              onClick={() => setSelectedType('product')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedType === 'product' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('filterProducts')}
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="shrink-0">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="price_asc">{t('sortPriceAsc')}</option>
              <option value="price_desc">{t('sortPriceDesc')}</option>
              <option value="rating">{t('sortRating')}</option>
              <option value="newest">{t('sortNewest')}</option>
            </select>
          </div>
        </div>

        {/* Mobile Type Toggle Bar */}
        <div className="flex sm:hidden items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setSelectedType('all')}
            className={`flex-1 py-1.5 text-center rounded-lg transition ${
              selectedType === 'all' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            {t('filterAll')}
          </button>
          <button
            onClick={() => setSelectedType('gig')}
            className={`flex-1 py-1.5 text-center rounded-lg transition ${
              selectedType === 'gig' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            {t('filterGigs')}
          </button>
          <button
            onClick={() => setSelectedType('product')}
            className={`flex-1 py-1.5 text-center rounded-lg transition ${
              selectedType === 'product' ? 'bg-white text-emerald-950 shadow-xs font-bold' : 'text-slate-600'
            }`}
          >
            {t('filterProducts')}
          </button>
        </div>

        {/* Categories Horizontal Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* City & Price Range Filter Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* City dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-medium"
              >
                <option value="all">
                  {language === 'ur' ? 'تمام شہر (All Cities)' : language === 'ps' ? 'ټول ښارونه' : 'All Cities'}
                </option>
                <option value="Peshawar">Peshawar (پشاور)</option>
                <option value="Quetta">Quetta (کوئٹہ)</option>
                <option value="Swat">Swat (سوات)</option>
                <option value="Mardan">Mardan (مردان)</option>
                <option value="Karak">Karak (کرک)</option>
                <option value="Islamabad">Islamabad (اسلام آباد)</option>
                <option value="Lahore">Lahore (لاہور)</option>
                <option value="Karachi">Karachi (کراچی)</option>
              </select>
            </div>

            {/* Price inputs */}
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                placeholder={t('minPrice') + ' (PKR)'}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 sm:w-28 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 tabular-nums"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder={t('maxPrice') + ' (PKR)'}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 sm:w-28 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 tabular-nums"
              />
            </div>
          </div>

          {/* Reset Filters */}
          {(search || selectedCategory !== 'all' || selectedType !== 'all' || selectedCity !== 'all' || minPrice || maxPrice) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-slate-500 hover:text-emerald-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetFilters')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">
          {filteredListings.length}{' '}
          {language === 'ur' ? 'اشتہارات دستیاب ہیں' : language === 'ps' ? 'اعلانونه وموندل شول' : 'listings found'}
        </span>
      </div>

      {/* Grid Results */}
      {filteredListings.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Tag className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm sm:text-base">
            {language === 'ur' ? 'کوئی اشتہار نہیں ملا' : language === 'ps' ? 'کوم اعلان ونه موندل شو' : 'No listings match your filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'ur'
              ? 'تلاش کے الفاظ بدل کر دیکھیں یا فلٹرز کو دوبارہ ترتیب دیں۔'
              : language === 'ps'
              ? 'د لټون کلیمه بدله کړئ یا فلټرونه بیا تنظیم کړئ.'
              : 'Try adjusting your search criteria or resetting the filters.'}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-medium text-xs hover:bg-emerald-900 transition"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onClick={() => onSelectListing(listing.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
