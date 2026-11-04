import React, { useState } from 'react';
import { 
  X, User, Package, Heart, ShoppingBag, Settings, 
  HelpCircle, Info, LogOut, Globe, Moon, Sun, 
  ChevronRight, Mail, Phone, Lock, Eye, EyeOff
} from 'lucide-react';
import { t } from '../locales/translations';
import { Language, AppUser } from '../types/market';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  currentLanguage: Language;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLanguage: () => void;
  onOpenAuth: (mode?: 'login' | 'register' | 'forgot') => void;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLanguage,
  isDarkMode,
  onToggleDarkMode,
  onOpenLanguage,
  onOpenAuth,
  onLogout,
  onNavigate
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white dark:bg-[#121915] z-50 shadow-2xl flex flex-col animate-slide-in-left overflow-hidden">
        {/* Header/Close */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-emerald-950/60 bg-[#0f5132] text-white">
          <h2 className="text-lg font-black font-nastaliq">ہنر بازار مارکیٹ پلیس مینو</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* User Profile Section */}
          <div className="p-5 bg-emerald-50 dark:bg-emerald-950/20 border-b border-slate-100 dark:border-emerald-950/40">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#f4c542] text-[#0f5132] flex items-center justify-center font-black text-2xl shadow-md border-2 border-white dark:border-emerald-900">
                  {currentUser.firstName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email || currentUser.phone}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-emerald-950 flex items-center justify-center text-slate-500 dark:text-emerald-400">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 font-nastaliq">ہنر بازار مارکیٹ پلیس میں خوش آمدید</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onOpenAuth('login')}
                    className="py-2 bg-[#0f5132] text-white rounded-xl text-sm font-bold font-nastaliq shadow-sm active:scale-95 transition"
                  >
                    لاگ اِن
                  </button>
                  <button 
                    onClick={() => onOpenAuth('register')}
                    className="py-2 border border-slate-300 dark:border-emerald-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold font-nastaliq shadow-xs active:scale-95 transition"
                  >
                    نیا اکاؤنٹ
                  </button>
                </div>
                <button 
                  onClick={() => onOpenAuth('login')}
                  className="w-full py-2 flex items-center justify-center gap-2 border border-slate-300 dark:border-emerald-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                  Google سے لاگ اِن
                </button>
                <div className="text-center">
                  <button 
                    onClick={() => onOpenAuth('forgot')}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-medium font-nastaliq"
                  >
                    پاس ورڈ بھول گئے؟
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {currentUser && (
              <>
                <SidebarLink icon={<User className="w-5 h-5" />} label="میرا پروفائل" onClick={() => onNavigate('profile')} />
                <SidebarLink icon={<Package className="w-5 h-5" />} label="میرے پروڈکٹس" onClick={() => onNavigate('myshop')} />
                <SidebarLink icon={<Heart className="w-5 h-5" />} label="پسندیدہ" onClick={() => onNavigate('favorites')} />
                <SidebarLink icon={<ShoppingBag className="w-5 h-5" />} label="میرے آرڈرز" onClick={() => onNavigate('orders')} />
                <div className="my-2 border-t border-slate-100 dark:border-emerald-950/60" />
              </>
            )}
            <SidebarLink icon={<Settings className="w-5 h-5" />} label="سیٹنگز" onClick={() => onNavigate('settings')} />
            <SidebarLink icon={<HelpCircle className="w-5 h-5" />} label="مدد اور رابطہ" onClick={() => onNavigate('help')} />
            <SidebarLink icon={<Info className="w-5 h-5" />} label="ہمارے بارے میں" onClick={() => onNavigate('about')} />
          </nav>

          {/* Preferences */}
          <div className="p-4 bg-slate-50 dark:bg-emerald-950/10 mt-2 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Globe className="w-5 h-5" />
                <span className="font-nastaliq">زبان (Language)</span>
              </div>
              <button 
                onClick={onOpenLanguage}
                className="text-xs bg-white dark:bg-emerald-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-emerald-800 font-bold uppercase"
              >
                {currentLanguage}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span className="font-nastaliq">ڈارک موڈ</span>
              </div>
              <button 
                onClick={onToggleDarkMode}
                className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-emerald-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isDarkMode ? 'right-1' : 'right-6'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer / Logout */}
        {currentUser && (
          <div className="p-4 border-t border-slate-100 dark:border-emerald-950/60">
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-3 p-3 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 rounded-xl font-bold font-nastaliq hover:bg-rose-100 transition active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              لاگ آؤٹ
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#1a241e] w-full max-w-xs p-6 rounded-3xl shadow-xl space-y-4 text-center">
            <div className="w-16 h-14 bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <LogOut className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white font-nastaliq">کیا آپ لاگ آؤٹ کرنا چاہتے ہیں؟</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">آپ کو دوبارہ لاگ ان کرنا پڑے گا۔</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 bg-slate-100 dark:bg-emerald-950 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300"
              >
                منسوخ
              </button>
              <button 
                onClick={() => {
                  onLogout();
                  setShowLogoutConfirm(false);
                  onClose();
                }}
                className="py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold"
              >
                جی ہاں
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SidebarLink = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-3.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-emerald-950/30 rounded-2xl transition group"
  >
    <div className="flex items-center gap-4">
      <div className="text-emerald-700 dark:text-emerald-400 group-hover:scale-110 transition">
        {icon}
      </div>
      <span className="font-bold font-nastaliq text-sm sm:text-base">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-emerald-900" />
  </button>
);
