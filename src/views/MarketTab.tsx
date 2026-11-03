import React from 'react';
import { ProductItem } from '../types/market';
import { ProductCard } from '../components/ProductCard';

interface MarketTabProps {
  products: ProductItem[];
  searchQuery: string;
  selectedCategory: string;
  onOrder: (product: ProductItem) => void;
  onBid: (product: ProductItem) => void;
  onGoToSell: () => void;
}

export const MarketTab: React.FC<MarketTabProps> = ({
  products,
  searchQuery,
  selectedCategory,
  onOrder,
  onBid,
  onGoToSell
}) => {
  // Live filtering by search query (title, description, city) and category
  const filteredProducts = products.filter((item) => {
    // Category check
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Search query check (title, description, city)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCity = item.city.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCity) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Feed Result Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          {filteredProducts.length} دستکاری اشیاء دستیاب ہیں
        </span>
        {searchQuery && (
          <span className="text-[#0f5132] dark:text-[#f4c542] font-bold">
            تلاش برائے: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 p-8 space-y-4">
          <div className="text-5xl select-none">🧶</div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 font-nastaliq">
            ابھی کوئی چیز نہیں
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            اس زمرے یا تلاش میں کوئی دستکاری دستیاب نہیں ہے۔ آپ اپنی روایتی چیزیں یہاں شائع کر سکتے ہیں!
          </p>
          <button
            onClick={onGoToSell}
            className="px-5 py-2.5 rounded-xl bg-[#f4c542] hover:bg-[#e5b634] text-[#0f5132] font-extrabold text-xs sm:text-sm shadow-sm transition font-nastaliq cursor-pointer"
          >
            ➕ اپنی چیز بیچیں
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrder={onOrder}
              onBid={onBid}
            />
          ))}
        </div>
      )}
    </div>
  );
};
