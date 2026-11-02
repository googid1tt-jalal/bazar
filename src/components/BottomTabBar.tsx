import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Plus, PackageCheck, MessageSquare, ShieldAlert } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, t, orders, currentUser, chatMessages } = useApp();

  const userOrdersCount = orders.filter(
    o => (o.buyerId === currentUser?.id || o.sellerId === currentUser?.id) &&
         (o.status === 'payment_submitted' || o.status === 'in_progress' || o.status === 'delivered')
  ).length;

  const unreadChatsCount = chatMessages.filter(
    m => m.recipientId === currentUser?.id && !m.read
  ).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-bottom">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'home' ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">{t('navHome')}</span>
        </button>

        {/* Tab 2: Browse */}
        <button
          onClick={() => setActiveTab('browse')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'browse' ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'browse' ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">{t('navBrowse')}</span>
        </button>

        {/* Tab 3: Sell / Post Gig (Center Accent Button) */}
        <button
          onClick={() => setActiveTab('sell')}
          className="flex flex-col items-center justify-center -mt-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-900/30 group-active:scale-95 transition-transform border-2 border-white">
            <Plus className="w-6 h-6 stroke-[2.5px]" />
          </div>
          <span className="text-[10px] font-semibold text-emerald-900 tracking-tight mt-0.5">
            {t('navSell')}
          </span>
        </button>

        {/* Tab 4: Orders */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`min-h-[44px] min-w-[44px] relative flex flex-col items-center justify-center transition-colors ${
            activeTab === 'orders' ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PackageCheck className={`w-5 h-5 ${activeTab === 'orders' ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">{t('navOrders')}</span>
          {userOrdersCount > 0 && (
            <span className="absolute top-1.5 right-3 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {userOrdersCount}
            </span>
          )}
        </button>

        {/* Tab 5: Inbox / Chat */}
        <button
          onClick={() => setActiveTab('inbox')}
          className={`min-h-[44px] min-w-[44px] relative flex flex-col items-center justify-center transition-colors ${
            activeTab === 'inbox' ? 'text-emerald-800 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className={`w-5 h-5 ${activeTab === 'inbox' ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">{t('navInbox')}</span>
          {unreadChatsCount > 0 && (
            <span className="absolute top-1.5 right-3 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadChatsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
