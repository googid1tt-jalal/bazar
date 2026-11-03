import React, { useState } from 'react';
import { Language, AppUser, ADMIN_USER, PAKISTANI_CITIES } from '../types/market';
import { t } from '../locales/translations';
import { X, Phone, Mail, User, Lock, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: AppUser | null;
  onLoginSuccess: (user: AppUser) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'facebook' | 'email'>('phone');

  // Phone login state
  const [phone, setPhone] = useState('03001234567');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('7861');

  // Email login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration state
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState(PAKISTANI_CITIES[0]);
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Quick Facebook Login simulation
  const handleFacebookLogin = () => {
    const fbUser: AppUser = {
      id: `fb_user_${Date.now()}`,
      firstName: currentLanguage === 'ps' ? 'احمد' : currentLanguage === 'en' ? 'Ahmad' : 'احمد',
      secondName: currentLanguage === 'ps' ? 'شیر' : currentLanguage === 'en' ? 'Sher' : 'شیر',
      name: currentLanguage === 'ps' ? 'احمد شیر خان' : currentLanguage === 'en' ? 'Ahmad Sher Khan' : 'احمد شیر خان',
      gender: 'male',
      city: 'پشاور (Peshawar)',
      provider: 'facebook',
      role: 'user',
      avatar: 'AS'
    };
    onLoginSuccess(fbUser);
    setFeedback(currentLanguage === 'ps' ? 'فیسبوک له لارې ننوتل بریالی شو!' : currentLanguage === 'en' ? 'Logged in with Facebook!' : 'فیس بک سے لاگ ان کامیاب!');
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1000);
  };

  // Phone Login Submit
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSent(true);
    setFeedback(
      currentLanguage === 'ps'
        ? `ستاسو شمېرې ${phone} ته د تایید کوډ واستول شو (کوډ: 7861)`
        : currentLanguage === 'en'
        ? `Verification code sent to ${phone} (Code: 7861)`
        : `آپ کے نمبر ${phone} پر تصدیقی کوڈ بھیج دیا گیا ہے (کوڈ: 7861)`
    );
  };

  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AppUser = {
      id: `user_${Date.now()}`,
      firstName: currentLanguage === 'ps' ? 'خان' : currentLanguage === 'en' ? 'Khan' : 'خان',
      secondName: currentLanguage === 'ps' ? 'زمان' : currentLanguage === 'en' ? 'Zaman' : 'زمان',
      name: currentLanguage === 'ps' ? 'خان زمان' : currentLanguage === 'en' ? 'Khan Zaman' : 'خان زمان',
      gender: 'male',
      phone,
      city: 'پشاور (Peshawar)',
      provider: 'phone',
      role: 'user',
      avatar: 'KZ'
    };
    onLoginSuccess(newUser);
    onClose();
  };

  // Email Login Submit
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    // Check if logging in as admin Jalal Habib
    if (loginEmail.toLowerCase().includes('admin') || loginEmail.toLowerCase().includes('jalal') || loginEmail.toLowerCase().includes('habib')) {
      onLoginSuccess(ADMIN_USER);
      onClose();
      return;
    }

    const newUser: AppUser = {
      id: `user_${Date.now()}`,
      firstName: loginEmail.split('@')[0],
      secondName: 'صارف',
      name: loginEmail.split('@')[0],
      gender: 'male',
      email: loginEmail,
      city: 'اسلام آباد (Islamabad)',
      provider: 'email',
      role: 'user',
      avatar: loginEmail.charAt(0).toUpperCase()
    };
    onLoginSuccess(newUser);
    onClose();
  };

  // Register Form Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !secondName.trim()) {
      alert(currentLanguage === 'en' ? 'Please enter first name and second name' : 'براہ کرم پہلا اور دوسرا نام درج کریں');
      return;
    }

    const fullName = `${firstName.trim()} ${secondName.trim()}`;
    const initials = `${firstName.trim().charAt(0)}${secondName.trim().charAt(0)}`.toUpperCase();

    const newUser: AppUser = {
      id: `user_${Date.now()}`,
      firstName: firstName.trim(),
      secondName: secondName.trim(),
      name: fullName,
      gender,
      phone: regPhone || undefined,
      email: regEmail || undefined,
      city: regCity,
      role: 'user',
      provider: regPhone ? 'phone' : 'email',
      avatar: initials
    };

    onLoginSuccess(newUser);
    setFeedback(currentLanguage === 'en' ? 'Account created successfully!' : 'نیا اکاؤنٹ کامیابی سے بن گیا!');
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1000);
  };

  const isRtl = currentLanguage !== 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950 overflow-hidden my-auto animate-scale-up">
        
        {/* Top Header Banner with Green & Gold */}
        <div className="bg-[#0f5132] text-white p-4 relative">
          <button
            onClick={onClose}
            className="absolute top-3.5 left-3.5 sm:left-4 p-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prominent Language Switcher */}
          <div className="flex flex-col items-center justify-center space-y-2 pt-1">
            <span className="text-[11px] text-emerald-200 font-bold tracking-wide">
              {currentLanguage === 'ps' ? '🌐 خپله ژبه وټاکئ:' : currentLanguage === 'en' ? '🌐 Select Language:' : '🌐 اپنی زبان منتخب کریں:'}
            </span>
            <div className="inline-flex bg-emerald-950/80 p-1 rounded-2xl border border-emerald-800/90 shadow-xs">
              <button
                type="button"
                onClick={() => onLanguageChange('ur')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  currentLanguage === 'ur'
                    ? 'bg-[#f4c542] text-[#0f5132] shadow-sm scale-102'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                اردو (Urdu)
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('ps')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  currentLanguage === 'ps'
                    ? 'bg-[#f4c542] text-[#0f5132] shadow-sm scale-102'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                پښتو (Pashto)
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                  currentLanguage === 'en'
                    ? 'bg-[#f4c542] text-[#0f5132] shadow-sm scale-102'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-900/50'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="text-center mt-3">
            <h2 className="text-xl font-black font-nastaliq text-white">
              🧶 {t('authModalTitle', currentLanguage)}
            </h2>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              {t('authModalSubtitle', currentLanguage)}
            </p>
          </div>
        </div>

        {/* User Card if already Logged In */}
        {currentUser ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0f5132] text-[#f4c542] font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                {currentUser.avatar || currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base truncate">
                    {currentUser.name}
                  </h4>
                  {currentUser.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-400 text-[#0f5132] text-[10px] font-black flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>ایڈمن</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentUser.phone || currentUser.email || 'موبائل صارف'} • 📍 {currentUser.city || 'پاکستان'}
                </p>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                  {currentLanguage === 'ps'
                    ? `جنسیت: ${currentUser.gender === 'male' ? 'سړی' : currentUser.gender === 'female' ? 'ښځه' : 'بل'}`
                    : currentLanguage === 'en'
                    ? `Gender: ${currentUser.gender}`
                    : `صنف: ${currentUser.gender === 'male' ? 'مرد' : currentUser.gender === 'female' ? 'خاتون' : 'دیگر'}`}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onLoginSuccess(ADMIN_USER);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-[#f4c542] font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {currentLanguage === 'ps'
                    ? 'د جلال حبیب (اډمین) په توګه ننوتل'
                    : currentLanguage === 'en'
                    ? 'Switch to Jalal Habib (Admin)'
                    : 'جلال حبیب (ایڈمن) کے طور پر کام کریں'}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs transition cursor-pointer"
              >
                {t('logout', currentLanguage)}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            {/* Feedback alert */}
            {feedback && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-[#0f5132] dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            {/* Mode Toggle: Sign In vs Register */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-[#121915] rounded-2xl mb-5 border border-slate-200 dark:border-emerald-950">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-[#1f2b23] text-[#0f5132] dark:text-[#f4c542] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t('tabLogin', currentLanguage)}
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-[#1f2b23] text-[#0f5132] dark:text-[#f4c542] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t('tabRegister', currentLanguage)}
              </button>
            </div>

            {/* ===================== LOGIN MODE ===================== */}
            {mode === 'login' ? (
              <div className="space-y-4">
                {/* 3 Login Method Selector */}
                <div className="flex gap-2 border-b border-slate-200 dark:border-emerald-950 pb-3">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('phone')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      loginMethod === 'phone'
                        ? 'bg-[#0f5132] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#121915] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{currentLanguage === 'ps' ? 'شمېره' : currentLanguage === 'en' ? 'Phone' : 'موبائل'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('facebook')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      loginMethod === 'facebook'
                        ? 'bg-[#1877F2] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#121915] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="font-black text-sm">f</span>
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoginMethod('email')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      loginMethod === 'email'
                        ? 'bg-[#0f5132] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-[#121915] text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{currentLanguage === 'ps' ? 'ایمیل' : currentLanguage === 'en' ? 'Email' : 'ای میل'}</span>
                  </button>
                </div>

                {/* Method 1: Phone Login */}
                {loginMethod === 'phone' && (
                  <div>
                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {t('loginViaPhone', currentLanguage)}
                          </label>
                          <div className="flex gap-2" dir="ltr">
                            <span className="px-3 py-2 bg-slate-100 dark:bg-[#121915] text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs border border-slate-200 dark:border-emerald-950 flex items-center">
                              🇵🇰 +92
                            </span>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="0300 1234567"
                              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                              required
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {currentLanguage === 'ps'
                              ? 'ستاسو شمېرې ته به یو وختي رمز (OTP) واستول شي'
                              : currentLanguage === 'en'
                              ? 'A 4-digit verification code will be sent to your phone'
                              : 'آپ کے موبائل پر 4 ہندسوں کا تصدیقی کوڈ بھیجا جائے گا'}
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-[#f4c542] hover:bg-[#e5b634] text-[#0f5132] font-black text-xs sm:text-sm transition shadow-xs cursor-pointer"
                        >
                          {t('sendOtp', currentLanguage)}
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyPhone} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {currentLanguage === 'ps' ? 'د تایید کوډ (OTP) ولیکئ:' : currentLanguage === 'en' ? 'Enter 4-digit code:' : 'تصدیقی کوڈ درج کریں:'}
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-black text-xs sm:text-sm transition shadow-xs cursor-pointer"
                        >
                          {t('verifyAndLogin', currentLanguage)}
                        </button>

                        <button
                          type="button"
                          onClick={() => setOtpSent(false)}
                          className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          {currentLanguage === 'ps' ? 'شمېره بدله کړئ' : currentLanguage === 'en' ? 'Change Phone Number' : 'دوسرا نمبر لکھیں'}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* Method 2: Facebook Login */}
                {loginMethod === 'facebook' && (
                  <div className="space-y-4 py-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 text-center">
                      {currentLanguage === 'ps'
                        ? 'پر یو کلیک سره د خپل فیسبوک حساب له لارې هنر بازار سره وصل شئ.'
                        : currentLanguage === 'en'
                        ? 'Quickly connect with your Facebook account in one click.'
                        : 'صرف ایک کلک کے ساتھ اپنے فیس بک اکاؤنٹ کے ذریعے ہنر بازار میں لاگ ان ہوں۔'}
                    </p>

                    <button
                      type="button"
                      onClick={handleFacebookLogin}
                      className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>{t('facebookBtn', currentLanguage)}</span>
                    </button>
                  </div>
                )}

                {/* Method 3: Email Login */}
                {loginMethod === 'email' && (
                  <form onSubmit={handleEmailLogin} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('emailInputLabel', currentLanguage)}
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t('passwordInputLabel', currentLanguage)}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-black text-xs sm:text-sm transition shadow-xs cursor-pointer"
                    >
                      {t('login', currentLanguage)}
                    </button>
                  </form>
                )}

                {/* Quick Admin Jalal Habib switch shortcut */}
                <div className="pt-3 border-t border-slate-100 dark:border-emerald-950/60">
                  <button
                    type="button"
                    onClick={() => {
                      onLoginSuccess(ADMIN_USER);
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>
                      {currentLanguage === 'ps'
                        ? 'د جلال حبیب (اډمین) په توګه سمدستي ننوتل'
                        : currentLanguage === 'en'
                        ? 'Quick Login as Jalal Habib (Admin)'
                        : 'بطور جلال حبیب (ایڈمن) فوری لاگ ان'}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* ===================== REGISTRATION MODE ===================== */
              <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                {/* 1. First Name & Second Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('firstNameLabel', currentLanguage)} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={currentLanguage === 'ps' ? 'مثال: احمد' : currentLanguage === 'en' ? 'e.g. Ahmad' : 'مثلاً: احمد'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t('secondNameLabel', currentLanguage)} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={secondName}
                      onChange={(e) => setSecondName(e.target.value)}
                      placeholder={currentLanguage === 'ps' ? 'مثال: خان / افریدی' : currentLanguage === 'en' ? 'e.g. Khan / Afridi' : 'مثلاً: خان / زمان'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                      required
                    />
                  </div>
                </div>

                {/* 2. Gender Selection (مرد، خاتون، دیگر) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t('genderLabel', currentLanguage)} <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`py-2 px-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                        gender === 'male'
                          ? 'bg-[#0f5132] text-white border-[#0f5132] shadow-xs'
                          : 'bg-slate-50 dark:bg-[#121915] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-950'
                      }`}
                    >
                      <span>👨</span>
                      <span>{t('genderMale', currentLanguage)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`py-2 px-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                        gender === 'female'
                          ? 'bg-[#0f5132] text-white border-[#0f5132] shadow-xs'
                          : 'bg-slate-50 dark:bg-[#121915] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-950'
                      }`}
                    >
                      <span>👩</span>
                      <span>{t('genderFemale', currentLanguage)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender('other')}
                      className={`py-2 px-2 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1 transition cursor-pointer ${
                        gender === 'other'
                          ? 'bg-[#0f5132] text-white border-[#0f5132] shadow-xs'
                          : 'bg-slate-50 dark:bg-[#121915] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-emerald-950'
                      }`}
                    >
                      <span>🧑</span>
                      <span>{t('genderOther', currentLanguage)}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('loginViaPhone', currentLanguage)}
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                  />
                </div>

                {/* 4. City Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('cityLabel', currentLanguage)}
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542] cursor-pointer"
                  >
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c} className="bg-white dark:bg-[#1a241e] text-slate-900 dark:text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('passwordInputLabel', currentLanguage)} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121915] border border-slate-200 dark:border-emerald-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542]"
                    required
                  />
                </div>

                {/* Submit Register */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-black text-xs sm:text-sm transition shadow-sm cursor-pointer mt-2"
                >
                  {t('createAccountBtn', currentLanguage)}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
