import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Languages, UserRound, X } from 'lucide-react';
import { CATEGORIES, Language } from '../types/market';
import { t } from '../locales/translations';
import { TabKey } from './BottomNav';

interface SideNavigationProps {
  isOpen: boolean;
  currentLanguage: Language;
  currentUserName?: string;
  selectedCategory: string;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectTab: (tab: TabKey) => void;
  onOpenAccount: () => void;
  onSignOut: () => void;
  onLanguageChange: (language: Language) => void;
}

const categoryGroups = [
  { key: 'drawerHandicrafts', categoryIds: ['embroidery_clothes', 'woodwork', 'carpets_blankets', 'other'], icon: '🧶' },
  { key: 'drawerClothing', categoryIds: ['embroidery_clothes', 'chappal', 'carpets_blankets'], icon: '👕' },
  { key: 'drawerJewelry', categoryIds: ['jewelry'], icon: '💍' },
  { key: 'drawerHomeDecor', categoryIds: ['woodwork', 'carpets_blankets'], icon: '🏠' },
  { key: 'drawerFoodItems', categoryIds: ['dry_fruits_food'], icon: '🍯' },
  { key: 'drawerArt', categoryIds: ['other', 'embroidery_clothes', 'woodwork'], icon: '🎨' }
] as const;

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'اردو' },
  { code: 'ps', label: 'پښتو' }
];

export const SideNavigation: React.FC<SideNavigationProps> = ({
  isOpen,
  currentLanguage,
  currentUserName,
  selectedCategory,
  onClose,
  onSelectCategory,
  onSelectTab,
  onOpenAccount,
  onSignOut,
  onLanguageChange
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const isRtl = currentLanguage !== 'en';

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const selectCategory = (categoryId: string) => {
    onSelectCategory(categoryId);
    onSelectTab('market');
    onClose();
  };

  const selectTab = (tab: TabKey) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <>
      <button
        type="button"
        aria-label={t('drawerClose', currentLanguage)}
        aria-hidden={!isOpen}
        tabIndex={-1}
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/55 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        id="side-navigation"
        dir={isRtl ? 'rtl' : 'ltr'}
        aria-label={t('drawerNavigation', currentLanguage)}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed top-0 bottom-0 z-[60] flex flex-col bg-white text-slate-900 shadow-2xl transition-transform duration-300 ease-out dark:bg-[#17211b] dark:text-slate-100 ${
          isRtl
            ? `right-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
            : `left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
        style={{ width: 'min(80vw, 320px)' }}
      >
        <div className="flex min-h-[76px] items-center justify-between bg-[#0f5132] px-4 py-3 text-white">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <UserRound className="h-6 w-6 text-[#f4c542]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{t('drawerHello', currentLanguage)},</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAccount();
                }}
                className="max-w-full truncate text-start text-sm font-semibold text-[#f4c542] hover:underline"
              >
                {currentUserName || t('drawerSignIn', currentLanguage)}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('drawerClose', currentLanguage)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
          <section aria-labelledby="drawer-shop-title">
            <h2 id="drawer-shop-title" className="border-b border-slate-200 px-4 py-3 text-sm font-extrabold dark:border-slate-700">
              {t('drawerShopByCategory', currentLanguage)}
            </h2>
            <div className="py-1">
              {categoryGroups.map((group) => {
                const isExpanded = expandedCategory === group.key;
                return (
                  <div key={group.key}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedCategory(isExpanded ? null : group.key)}
                      className="flex min-h-11 w-full items-center gap-3 px-4 text-start text-sm transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
                    >
                      <span className="w-5 text-center" aria-hidden="true">{group.icon}</span>
                      <span className="flex-1">{t(group.key, currentLanguage)}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                      ) : (
                        <ChevronRight
                          className={`h-4 w-4 shrink-0 text-slate-500 ${isRtl ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="bg-slate-50 py-1 dark:bg-black/10">
                        {group.categoryIds.map((categoryId) => {
                          const category = CATEGORIES.find((item) => item.id === categoryId);
                          if (!category) return null;
                          const categoryName = currentLanguage === 'en'
                            ? category.nameEnglish
                            : currentLanguage === 'ps'
                              ? category.namePashto
                              : category.nameUrdu;
                          return (
                            <button
                              key={categoryId}
                              type="button"
                              aria-current={selectedCategory === categoryId ? 'page' : undefined}
                              onClick={() => selectCategory(categoryId)}
                              className={`flex min-h-10 w-full items-center gap-2 py-2 pe-4 ps-12 text-start text-sm transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10 ${
                                selectedCategory === categoryId
                                  ? 'bg-slate-100 font-bold text-[#0f5132] dark:bg-white/10 dark:text-[#f4c542]'
                                  : 'text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              <span aria-hidden="true">{category.emoji}</span>
                              <span>{categoryName}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => selectCategory('all')}
                className="flex min-h-11 w-full items-center gap-3 px-4 text-start text-sm font-bold transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
              >
                <span className="w-5 text-center" aria-hidden="true">🛍️</span>
                <span>{t('drawerSeeAll', currentLanguage)}</span>
              </button>
            </div>
          </section>

          <section aria-labelledby="drawer-programs-title" className="border-t border-slate-200 dark:border-slate-700">
            <h2 id="drawer-programs-title" className="px-4 py-3 text-sm font-extrabold">
              {t('drawerPrograms', currentLanguage)}
            </h2>
            {(['drawerTodaysDeals', 'drawerNewArrivals', 'drawerTopSellers'] as const).map((labelKey) => (
              <button
                key={labelKey}
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  selectTab('market');
                }}
                className="flex min-h-11 w-full items-center px-4 text-start text-sm transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
              >
                {t(labelKey, currentLanguage)}
              </button>
            ))}
          </section>

          <section aria-labelledby="drawer-help-title" className="mt-1 border-t border-slate-200 dark:border-slate-700">
            <h2 id="drawer-help-title" className="px-4 py-3 text-sm font-extrabold">
              {t('drawerHelpSettings', currentLanguage)}
            </h2>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAccount();
              }}
              className="flex min-h-11 w-full items-center px-4 text-start text-sm transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
            >
              {t('drawerYourAccount', currentLanguage)}
            </button>
            <button
              type="button"
              aria-expanded={isLanguageExpanded}
              onClick={() => setIsLanguageExpanded((expanded) => !expanded)}
              className="flex min-h-11 w-full items-center gap-3 px-4 text-start text-sm transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
            >
              <Languages className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span className="flex-1">{t('drawerLanguage', currentLanguage)}</span>
              {isLanguageExpanded
                ? <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
                : <ChevronRight className={`h-4 w-4 text-slate-500 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />}
            </button>
            {isLanguageExpanded && (
              <div className="bg-slate-50 py-1 dark:bg-black/10">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    type="button"
                    aria-current={currentLanguage === language.code ? 'true' : undefined}
                    onClick={() => onLanguageChange(language.code)}
                    className={`flex min-h-10 w-full items-center py-2 pe-4 ps-12 text-start text-sm transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10 ${
                      currentLanguage === language.code
                        ? 'font-bold text-[#0f5132] dark:text-[#f4c542]'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {language.label}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => selectTab('orders')}
              className="flex min-h-11 w-full items-center px-4 text-start text-sm transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
            >
              {t('drawerOrders', currentLanguage)}
            </button>
            <button
              type="button"
              onClick={() => selectTab('orders')}
              className="flex min-h-11 w-full items-center px-4 text-start text-sm transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
            >
              {t('drawerCustomerService', currentLanguage)}
            </button>
            {currentUserName && (
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="flex min-h-11 w-full items-center px-4 text-start text-sm text-red-700 transition hover:bg-slate-100 focus-visible:bg-slate-100 dark:text-red-300 dark:hover:bg-white/10 dark:focus-visible:bg-white/10"
              >
                {t('drawerSignOut', currentLanguage)}
              </button>
            )}
          </section>
        </nav>
      </aside>
    </>
  );
};
