import React from 'react';
import { Home, Search, Plus, ShoppingBag, User } from 'lucide-react';

export type TabKey = 'home' | 'search' | 'sell' | 'orders' | 'profile';

interface BottomNavProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  ordersCount?: number;
  isHidden?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  ordersCount = 0,
  isHidden = false
}) => {
  if (isHidden) return null;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'ہوم', icon: <Home size={24} /> },
    { key: 'search', label: 'تلاش', icon: <Search size={24} /> },
    { key: 'sell', label: 'بیچیں', icon: <Plus size={28} strokeWidth={3} /> },
    { key: 'orders', label: 'آرڈرز', icon: <ShoppingBag size={24} /> },
    { key: 'profile', label: 'پروفائل', icon: <User size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#121915] border-t border-slate-200 dark:border-emerald-950 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] safe-bottom h-[64px]">
      <div className="max-w-xl mx-auto h-full grid grid-cols-5 items-center relative">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          const isCenter = tab.key === 'sell';

          if (isCenter) {
            return (
              <div key={tab.key} className="flex flex-col items-center justify-center h-full relative">
                <button
                  onClick={() => onTabChange(tab.key)}
                  className={`-translate-y-4 w-14 h-14 rounded-full bg-[#0f5132] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer border-4 border-white dark:border-[#121915]`}
                  aria-label={tab.label}
                >
                  {tab.icon}
                </button>
                <span className="absolute bottom-1 text-[11px] font-bold font-nastaliq text-slate-500 dark:text-slate-400">
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex flex-col items-center justify-center h-full gap-1 transition-all active:scale-95 cursor-pointer relative ${
                isActive ? 'text-[#0f5132] dark:text-[#f4c542]' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-[#0f5132] dark:bg-[#f4c542] rounded-b-full animate-fade-in" />
              )}
              
              <div className="relative">
                {tab.icon}
                {tab.key === 'orders' && ordersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-[#121915]">
                    {ordersCount}
                  </span>
                )}
              </div>
              
              <span className="text-[11px] font-bold font-nastaliq whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
