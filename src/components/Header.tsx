import React from 'react';
import { CATEGORIES, Language, AppUser } from '../types/market';
import { User, Search, Globe, Bell } from 'lucide-react';
import { t } from '../locales/translations';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  currentLanguage: Language;
  onOpenLanguageModal: () => void;
  currentUser: AppUser | null;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  unreadNotificationsCount,
  onOpenNotifications,
  currentLanguage,
  onOpenLanguageModal,
  currentUser,
  onToggleSidebar
}) => {
  const searchPlaceholderText =
    currentLanguage === 'ps'
      ? 'لټون...'
      : currentLanguage === 'en'
      ? 'Search Hunar Bazaar'
      : 'تلاش کریں...';

  const avatarContent = currentUser?.firstName 
    ? currentUser.firstName.charAt(0).toUpperCase() 
    : <User className="w-5 h-5 text-emerald-900" />;

  return (
    <header className="sticky top-0 z-40 bg-[#0f5132] text-white shadow-md border-b border-emerald-900/60 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          {/* Top-Left: Profile/Menu Avatar Toggle */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggleSidebar}
              className="w-10 h-10 rounded-full bg-[#f4c542] text-[#0f5132] flex items-center justify-center font-black shadow-md border-2 border-amber-300 cursor-pointer active:scale-90 transition"
              aria-label="Open Sidebar Menu"
            >
              {avatarContent}
            </button>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white font-nastaliq hidden sm:block">
              {t('appName', currentLanguage)}
            </h1>
          </div>

          {/* Centered Brand on Mobile */}
          <h1 className="text-lg font-black tracking-tight text-white font-nastaliq block sm:hidden flex-1 text-center">
            {t('appName', currentLanguage)}
          </h1>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onOpenLanguageModal}
              className="p-2 rounded-xl bg-emerald-800/90 text-white cursor-pointer hover:bg-emerald-700 transition"
              title="Change Language"
            >
              <Globe className="w-5 h-5 text-[#f4c542]" />
            </button>
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-emerald-800/90 text-white cursor-pointer hover:bg-emerald-700 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#f4c542]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-[#0f5132] font-black text-[10px] rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Compact Search Bar */}
        <div className="w-full flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholderText}
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542] shadow-sm font-medium transition"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
