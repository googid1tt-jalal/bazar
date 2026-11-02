import React from 'react';

export type TabKey = 'market' | 'sell' | 'myshop' | 'orders';

interface BottomNavProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  myItemsCount?: number;
  ordersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  myItemsCount = 0,
  ordersCount = 0
}) => {
  const tabs: { key: TabKey; label: string; icon: string; count?: number }[] = [
    { key: 'market', label: 'بازار', icon: '🛍️' },
    { key: 'sell', label: 'بیچیں', icon: '➕' },
    { key: 'myshop', label: 'میری دکان', icon: '📦', count: myItemsCount },
    { key: 'orders', label: 'میرے آرڈر', icon: '🧾', count: ordersCount },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#15201a]/95 backdrop-blur-md border-t border-slate-200 dark:border-emerald-950/80 shadow-lg safe-bottom">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`min-h-[48px] min-w-[44px] relative flex flex-col items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'text-[#0f5132] dark:text-[#f4c542] font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="text-xl sm:text-2xl leading-none">{tab.icon}</div>
              <span className="text-[11px] sm:text-xs tracking-tight mt-1 whitespace-nowrap font-nastaliq">
                {tab.label}
              </span>

              {/* Notification Badge if applicable */}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="absolute top-1 left-3 sm:left-4 min-w-4 h-4 px-1 rounded-full bg-[#0f5132] dark:bg-[#f4c542] text-white dark:text-[#0f5132] text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {tab.count}
                </span>
              )}

              {/* Active Indicator bar */}
              {isActive && (
                <span className="absolute bottom-1 w-6 h-1 rounded-full bg-[#f4c542]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
