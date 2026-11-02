import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, UserCheck, Plus, Check, Phone, Mail, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface UserSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSwitcherModal: React.FC<UserSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, currentUser, switchUser, login, signup, t, language } = useApp();
  const [activeTab, setActiveTab] = useState<'switch' | 'new'>('switch');

  // New user form state
  const [name, setName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [city, setCity] = useState('Peshawar');
  const [accountType, setAccountType] = useState<'buyer_seller' | 'admin'>('buyer_seller');

  if (!isOpen) return null;

  const handleSelectUser = (user: User) => {
    switchUser(user.id);
    onClose();
  };

  const handleCreateOrLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;

    if (activeTab === 'new' && name) {
      signup({
        name,
        email: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
        phone: !phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
        city,
        role: accountType === 'admin' ? 'admin' : 'user',
        bio: 'Pakistani marketplace member.',
        skills: ['General Freelancer / Trader'],
        jazzcashAccount: phoneOrEmail.startsWith('03') ? phoneOrEmail : '0300-1122334'
      });
    } else {
      login(phoneOrEmail);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">
              {language === 'ur' ? 'صارف اکاؤنٹ تبدیل یا لاگ ان کریں' : language === 'ps' ? 'د کاروونکي حساب بدلول یا ننوتل' : 'Switch Role or Login'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === 'switch' ? 'bg-white text-emerald-900 border-b-2 border-emerald-700' : 'text-slate-500'
            }`}
          >
            {language === 'ur' ? 'پہلے سے موجود اکاؤنٹس (ٹیسٹنگ)' : language === 'ps' ? 'موجوده حسابونه (ټیسټ)' : 'Preset Test Accounts'}
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === 'new' ? 'bg-white text-emerald-900 border-b-2 border-emerald-700' : 'text-slate-500'
            }`}
          >
            {language === 'ur' ? 'نیا لاگ ان / سائن اپ' : language === 'ps' ? 'نوی ننوتل / ثبت' : 'Sign In / Register'}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'switch' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500 mb-2">
                {language === 'ur'
                  ? 'خریدار، سیلر اور ایڈمن کے درمیان باآسانی سوئچ کریں:'
                  : language === 'ps'
                  ? 'د پیرودونکي، پلورونکي او اډمین ترمنځ بدل شئ:'
                  : 'Instant 1-click role switching between Admin, Sellers, and Buyers:'}
              </p>

              {allUsers.map((user) => {
                const isSelected = currentUser?.id === user.id;
                const isAdmin = user.role === 'admin';

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">
                            {user.name}
                          </span>
                          {isAdmin ? (
                            <span className="text-[10px] bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.2 rounded">
                              Admin (Me)
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1.5 py-0.2 rounded">
                              Buyer & Seller
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {user.city} · {user.email || user.phone}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 ms-2">
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {language === 'ur' ? 'منتخب کریں' : language === 'ps' ? 'وټاکئ' : 'Switch'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCreateOrLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {language === 'ur' ? 'مکمل نام' : language === 'ps' ? 'بشپړ نوم' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: احمد خان / Ahmad Khan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {language === 'ur' ? 'موبائل نمبر یا ای میل' : language === 'ps' ? 'موبایل شمېره یا ایمیل' : 'Mobile Number or Email'}
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="0300-1234567 or user@gmail.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {language === 'ur' ? 'شہر منتخب کریں' : language === 'ps' ? 'ښار وټاکئ' : 'City'}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="Peshawar">Peshawar (پشاور)</option>
                  <option value="Quetta">Quetta (کوئٹہ)</option>
                  <option value="Swat">Swat (سوات)</option>
                  <option value="Mardan">Mardan (مردان)</option>
                  <option value="Karak">Karak (کرک)</option>
                  <option value="Islamabad">Islamabad (اسلام آباد)</option>
                  <option value="Lahore">Lahore (لاہور)</option>
                  <option value="Karachi">Karachi (کراچی)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {language === 'ur' ? 'اکاؤنٹ کا کردار' : language === 'ps' ? 'د حساب رول' : 'Account Role'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('buyer_seller')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-center transition ${
                      accountType === 'buyer_seller'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Buyer & Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('admin')}
                    className={`flex-1 py-2 px-3 rounded-lg border text-center transition ${
                      accountType === 'admin'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-900 transition shadow-sm mt-2"
              >
                {language === 'ur' ? 'جاری رکھیں اور لاگ ان رہیں' : language === 'ps' ? 'ننوتل او فعال ساتل' : 'Save & Keep Logged In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
