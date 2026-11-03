import React from 'react';
import { CATEGORIES, Language, AppUser } from '../types/market';
import { PWAInstallButton } from './PWAInstallButton';
import { Sun, Moon, Bell, ShieldCheck, User, Search, X, Menu } from 'lucide-react';
import { t } from '../locales/translations';

interface HeaderProps {
  currentTab: string;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (catId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenAdmin: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  isSideNavigationOpen: boolean;
  onOpenSideNavigation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  isDarkMode,
  onToggleDarkMode,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenAdmin,
  currentLanguage,
  onLanguageChange,
  currentUser,
  onOpenAuth,
  isSideNavigationOpen,
  onOpenSideNavigation
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f5132] text-white shadow-md border-b border-emerald-900/60 transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5">
        {/* Single Row: [Logo] --- [Resized Compact Search Bar] --- [Actions & Nav Menu] */}
        <div className="relative flex items-center justify-between gap-2 sm:gap-4 pl-9">
          <button
            type="button"
            onClick={onOpenSideNavigation}
            aria-label={t('drawerNavigation', currentLanguage)}
            aria-expanded={isSideNavigationOpen}
            aria-controls="side-navigation"
            className="absolute left-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c542]"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          {/* 1. Hunar Bazaar Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#f4c542] flex items-center justify-center p-1 shadow-sm shrink-0">
              <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="Hunar Bazaar" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-xl font-black tracking-tight text-white leading-tight font-nastaliq">
                  🧶 {t('appName', currentLanguage)}
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/90 hidden lg:block leading-none mt-0.5">
                {currentLanguage === 'ps'
                  ? 'د پښتنو، بلوڅو، سندیانو او سرائیکیانو بازار'
                  : currentLanguage === 'en'
                  ? 'Pashtun • Baloch • Sindhi • Saraiki Crafts'
                  : 'پشتون • بلوچ • سندھی • سرائیکی بازار'}
              </p>
            </div>
          </div>

          {/* 2. Resized Compact Search Bar Placed Between Logo and Navigation Menu */}
          <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg flex items-center gap-1.5 mx-1">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholderCompact', currentLanguage)}
                className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542] shadow-xs"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Compact Category Filter (Visible in market tab or always handy) */}
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="hidden sm:inline-block w-28 sm:w-36 py-1.5 sm:py-2 px-2 rounded-xl bg-[#f4c542] text-[#0f5132] font-extrabold text-[11px] sm:text-xs focus:outline-none focus:ring-2 focus:ring-white shadow-xs cursor-pointer truncate"
              title="Category Filter"
            >
              {CATEGORIES.map((cat) => {
                const catName =
                  currentLanguage === 'ps'
                    ? cat.namePashto
                    : currentLanguage === 'en'
                    ? cat.nameEnglish
                    : cat.nameUrdu;
                return (
                  <option key={cat.id} value={cat.id} className="bg-white text-slate-900 font-medium">
                    {cat.emoji} {catName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 3. Action Controls & Navigation Menu: Admin (Jalal Habib), Lang, Auth, Notifs, Dark Mode */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Dynamic Language Switcher (Urdu, Pashto, English) */}
            <div className="flex items-center bg-emerald-950/80 p-0.5 rounded-xl border border-emerald-800 text-[10px] sm:text-xs font-bold">
              <button
                type="button"
                onClick={() => onLanguageChange('ur')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition cursor-pointer ${
                  currentLanguage === 'ur'
                    ? 'bg-[#f4c542] text-[#0f5132] shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="اردو (Urdu)"
              >
                اردو
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ps')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition cursor-pointer ${
                  currentLanguage === 'ps'
                    ? 'bg-[#f4c542] text-[#0f5132] shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="پښتو (Pashto)"
              >
                پښتو
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 sm:px-2 py-1 rounded-lg transition cursor-pointer ${
                  currentLanguage === 'en'
                    ? 'bg-[#f4c542] text-[#0f5132] shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Admin Profile Section: Displaying "جلال حبیب" / "Habib" */}
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-400/90 hover:bg-amber-300 text-[#0f5132] transition border border-amber-300 font-extrabold text-[11px] sm:text-xs flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
              title="ایڈمن پورٹل — جلال حبیب (Jalal Habib)"
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0f5132]" />
              <span className="font-nastaliq font-black">
                {currentLanguage === 'en' ? 'Jalal Habib' : 'جلال حبیب'}
              </span>
            </button>

            {/* User Profile / Auth Button */}
            <button
              type="button"
              onClick={onOpenAuth}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white transition border border-emerald-700/60 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title={currentUser ? currentUser.name : t('login', currentLanguage)}
            >
              <User className="w-3.5 h-3.5 text-[#f4c542]" />
              <span className="hidden md:inline font-nastaliq max-w-20 truncate">
                {currentUser ? currentUser.firstName : t('login', currentLanguage)}
              </span>
            </button>

            {/* Notifications Bell */}
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white transition cursor-pointer border border-emerald-700/60"
              title="اطلاعات (Notifications)"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f4c542]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-[#0f5132] font-black text-[9px] rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Dark Mode toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-1.5 sm:p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 transition cursor-pointer border border-emerald-700/60"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f4c542]" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* PWA Install */}
            <PWAInstallButton />
          </div>
        </div>

        {/* Mobile Category Chips (Scrollable row on very small screens) */}
        <div className="flex sm:hidden items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const catName =
              currentLanguage === 'ps'
                ? cat.namePashto
                : currentLanguage === 'en'
                ? cat.nameEnglish
                : cat.nameUrdu;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#f4c542] text-[#0f5132]'
                    : 'bg-emerald-950/60 text-emerald-200 hover:text-white'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{catName}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
