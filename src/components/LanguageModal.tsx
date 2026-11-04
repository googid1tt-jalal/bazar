import React from 'react';
import { Language } from '../types/market';
import { SUPPORTED_LANGUAGES } from '../types/market';
import { Check, Globe, X } from 'lucide-react';
import { t } from '../locales/translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-fade-in">
      <div className="bg-white dark:bg-[#1a241e] w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-emerald-950 relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0f5132] text-[#f4c542] flex items-center justify-center shadow-xs">
              <Globe className="w-5 h-5 text-[#f4c542]" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white font-nastaliq">
                {t('toggleLanguage', currentLanguage)} (Select Language)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                اپنی پسندیدہ زبان منتخب کریں (Choose your preferred language)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-emerald-950/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-emerald-900 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Language List */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-[#0f5132] dark:border-[#f4c542] shadow-sm ring-2 ring-amber-400/50'
                    : 'bg-white dark:bg-[#121915] hover:bg-slate-50 dark:hover:bg-emerald-950/30 border-slate-200 dark:border-emerald-950/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left rtl:text-right">
                    <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white font-nastaliq">
                      {lang.nativeName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                      {lang.englishName} • {lang.dir.toUpperCase()}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-7 h-7 rounded-full bg-[#0f5132] dark:bg-[#f4c542] text-[#f4c542] dark:text-[#0f5132] flex items-center justify-center shadow-xs">
                    <Check className="w-4 h-4 font-black" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] text-slate-400 font-medium">
          App UI & RTL layout updates instantly. Choice is saved locally.
        </div>
      </div>
    </div>
  );
};
