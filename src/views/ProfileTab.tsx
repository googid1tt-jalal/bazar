import React from 'react';
import { AppUser, Language } from '../types/market';
import { User, Mail, Phone, MapPin, Settings, LogOut, ShieldCheck, ShoppingBag, Package } from 'lucide-react';
import { t } from '../locales/translations';

interface ProfileTabProps {
  currentUser: AppUser | null;
  currentLanguage: Language;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  currentUser,
  currentLanguage,
  onLogout,
  onOpenAuth
}) => {
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center text-slate-400">
          <User size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-nastaliq text-slate-900 dark:text-white">ہنر بازار میں خوش آمدید</h2>
          <p className="text-sm text-slate-500">اپنا اکاؤنٹ لاگ ان کریں یا نیا بنائیں</p>
        </div>
        <button
          onClick={onOpenAuth}
          className="w-full max-w-xs py-3.5 bg-[#0f5132] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition-transform cursor-pointer"
        >
          لاگ اِن / سائن اپ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24">
      {/* Profile Header */}
      <div className="bg-white dark:bg-[#1a241e] rounded-3xl p-6 border border-slate-100 dark:border-emerald-950 shadow-xs flex flex-col items-center text-center space-y-3">
        <div className="w-24 h-24 rounded-full bg-[#f4c542] text-[#0f5132] flex items-center justify-center text-4xl font-black shadow-md border-4 border-white dark:border-emerald-900">
          {currentUser.firstName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
             {currentUser.email ? <><Mail size={12} /> {currentUser.email}</> : <><Phone size={12} /> {currentUser.phone}</>}
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="bg-white dark:bg-[#1a241e] rounded-3xl overflow-hidden border border-slate-100 dark:border-emerald-950 shadow-xs">
        <ProfileMenuItem icon={<User size={20} />} label="میرا پروفائل" />
        <ProfileMenuItem icon={<Package size={20} />} label="میرے پروڈکٹس" />
        <ProfileMenuItem icon={<ShoppingBag size={20} />} label="میرے آرڈرز" />
        <ProfileMenuItem icon={<Settings size={20} />} label="سیٹنگز" />
        <ProfileMenuItem icon={<ShieldCheck size={20} />} label="مدد اور رابطہ" />
      </div>

      <button
        onClick={onLogout}
        className="w-full py-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
      >
        <LogOut size={20} />
        <span className="font-nastaliq">لاگ آؤٹ</span>
      </button>
    </div>
  );
};

const ProfileMenuItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-emerald-950/20 transition-colors border-b border-slate-50 dark:border-emerald-950/50 last:border-0 text-slate-700 dark:text-slate-200">
    <div className="text-[#0f5132] dark:text-[#f4c542]">{icon}</div>
    <span className="font-bold font-nastaliq flex-1 text-start">{label}</span>
  </button>
);
