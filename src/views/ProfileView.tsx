import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Star,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  Edit3,
  CreditCard,
  LogOut,
  UserCheck
} from 'lucide-react';

interface ProfileViewProps {
  onOpenUserSwitcher: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenUserSwitcher }) => {
  const { currentUser, updateProfile, t, language, logout, setActiveTab } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [city, setCity] = useState(currentUser?.city || 'Peshawar');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [jazzcash, setJazzcash] = useState(currentUser?.jazzcashAccount || '');
  const [easypaisa, setEasypaisa] = useState(currentUser?.easypaisaAccount || '');

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      city,
      bio,
      jazzcashAccount: jazzcash,
      easypaisaAccount: easypaisa
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Profile Header Canvas */}
        <div className="h-32 bg-emerald-950 relative p-4 flex items-end">
          <div className="absolute top-3 end-3 flex items-center gap-2">
            <button
              onClick={onOpenUserSwitcher}
              className="px-3 py-1.5 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t('switchRole')}</span>
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-3.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                    {currentUser.name}
                  </h1>
                  {currentUser.role === 'admin' ? (
                    <span className="text-[11px] bg-amber-400 text-emerald-950 font-bold px-2 py-0.5 rounded">
                      Platform Admin
                    </span>
                  ) : (
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      Buyer & Seller
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.city}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    {currentUser.rating.toFixed(1)} ({currentUser.reviewCount})
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 self-end transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'کینسل کریں' : 'پروفائل تبدیل کریں'}</span>
            </button>
          </div>

          {/* Edit Form or View details */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">نام:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">شہر:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">بائیو / تعارف:</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    جاز کیش اکاؤنٹ (ادائیگی وصولی):
                  </label>
                  <input
                    type="text"
                    value={jazzcash}
                    onChange={(e) => setJazzcash(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ایزی پیسہ اکاؤنٹ:
                  </label>
                  <input
                    type="text"
                    value={easypaisa}
                    onChange={(e) => setEasypaisa(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition"
              >
                تبدیلیاں محفوظ کریں
              </button>
            </form>
          ) : (
            <div className="space-y-4 pt-3 border-t border-slate-100 text-xs sm:text-sm">
              <p className="text-slate-700 leading-relaxed">
                {currentUser.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl text-xs text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block">{t('ordersCompleted')}</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {currentUser.completedOrders}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">{t('reviewsCount')}</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {currentUser.reviewCount}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">ریٹنگ</span>
                  <span className="text-base font-bold text-amber-600 tabular-nums">
                    {currentUser.rating.toFixed(1)} ★
                  </span>
                </div>
              </div>

              {/* Payment Accounts */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-800" />
                  <span>آپ کے پیمنٹ وصولی اکاؤنٹس (Payouts Accounts):</span>
                </span>
                <div className="space-y-1 text-emerald-900">
                  <p>جازکیش: <strong>{currentUser.jazzcashAccount || 'درج نہیں کیا گیا'}</strong></p>
                  <p>ایزی پیسہ: <strong>{currentUser.easypaisaAccount || 'درج نہیں کیا گیا'}</strong></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
