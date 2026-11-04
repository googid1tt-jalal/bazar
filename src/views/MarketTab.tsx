import React from 'react';
import { ProductItem, CATEGORIES, Language } from '../types/market';
import { ProductCard } from '../components/ProductCard';
import { t } from '../locales/translations';

interface MarketTabProps {
  products: ProductItem[];
  searchQuery: string;
  selectedCategory: string;
  onCategoryChange?: (catId: string) => void;
  onResetSearch?: () => void;
  currentLanguage?: Language;
  onOrder: (product: ProductItem) => void;
  onBid: (product: ProductItem) => void;
  onOpenQR?: (product: ProductItem) => void;
  onGoToSell: () => void;
}

export const MarketTab: React.FC<MarketTabProps> = ({
  products,
  searchQuery,
  selectedCategory,
  onCategoryChange,
  currentLanguage = 'ur',
  onOrder,
  onBid,
  onOpenQR
}) => {
  const filteredProducts = products.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold">Welcome to Hunar Bazaar</h2>
        <p className="opacity-80">Explore authentic crafts and imported goods.</p>
      </div>

      {/* Top Categories */}
      <section>
        <h2 className="text-lg font-bold mb-4">Top Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {CATEGORIES.slice(1, 5).map(cat => (
            <div key={cat.id} className="cursor-pointer" onClick={() => onCategoryChange && onCategoryChange(cat.id)}>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-16 w-16 flex items-center justify-center text-2xl mb-2 mx-auto">{cat.emoji}</div>
              <p className="text-xs text-center font-medium">{cat.nameEnglish}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <h2 className="text-lg font-bold mb-4">Trending</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              currentLanguage={currentLanguage}
              onOrder={onOrder}
              onBid={onBid}
            />
          ))}
        </div>
      </section>
      
      {/* New Arrivals */}
      <section>
        <h2 className="text-lg font-bold mb-4">New Arrivals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filteredProducts.slice(4, 8).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              currentLanguage={currentLanguage}
              onOrder={onOrder}
              onBid={onBid}
            />
          ))}
        </div>
      </section>
      
      {/* Footer Legal Note */}
      <footer className="text-center text-xs text-slate-500 mt-10 p-4 border-t">
        یہ ایپ دراز، ایمیزون، مرکز اور علی بابا سے وابستہ نہیں ہے۔ خریداری متعلقہ ویب سائٹ پر ہوگی اور ہمیں کمیشن مل سکتا ہے۔
      </footer>
    </div>
  );
};
