import React, { useState, useEffect } from 'react';
import { Language, AppUser, ADMIN_USER, PAKISTANI_CITIES } from '../types/market';
import { t } from '../locales/translations';
import { X, Phone, Mail, User, Lock, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export type AuthMode = 'login' | 'register' | 'forgot' | 'verify';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: AppUser | null;
  onLoginSuccess: (user: AppUser) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  currentLanguage,
  onLanguageChange,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [city, setCity] = useState(PAKISTANI_CITIES[0]);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setFeedback(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (loginMethod === 'email') {
        if (!email.includes('@')) {
          setError("درست ای میل درج کریں");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("پاس ورڈ کم از کم 6 ہندسوں کا ہونا چاہیے");
          setLoading(false);
          return;
        }
        
        // Simulating admin check
        if (email.toLowerCase().includes('admin')) {
          onLoginSuccess(ADMIN_USER);
        } else {
          onLoginSuccess({
            id: `user_${Date.now()}`,
            firstName: email.split('@')[0],
            secondName: 'صارف',
            name: email.split('@')[0],
            gender: 'male',
            email,
            city: 'اسلام آباد',
            provider: 'email',
            role: 'user',
            avatar: email.charAt(0).toUpperCase()
          });
        }
      } else {
        if (phone.length < 10) {
          setError("درست موبائل نمبر درج کریں");
          setLoading(false);
          return;
        }
        setMode('verify');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (!firstName || !secondName) {
        setError("براہ کرم تمام معلومات درج کریں");
        setLoading(false);
        return;
      }
      onLoginSuccess({
        id: `user_${Date.now()}`,
        firstName,
        secondName,
        name: `${firstName} ${secondName}`,
        gender: 'male',
        email: email || undefined,
        phone: phone || undefined,
        city,
        provider: email ? 'email' : 'phone',
        role: 'user',
        avatar: firstName.charAt(0).toUpperCase()
      });
      setLoading(false);
    }, 1000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setFeedback("پاس ورڈ تبدیل کرنے کا لنک آپ کے ای میل پر بھیج دیا گیا ہے");
      setLoading(false);
    }, 1000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      id: `user_${Date.now()}`,
      firstName: 'صارف',
      secondName: 'خان',
      name: 'خان صارف',
      gender: 'male',
      phone,
      city: 'پشاور',
      provider: 'phone',
      role: 'user',
      avatar: 'K'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#1a241e] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-scale-up my-auto">
        {/* Header Section */}
        <div className="bg-[#0f5132] p-6 text-white text-center relative">
          <button onClick={onClose} className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-full"><X className="w-5 h-5" /></button>
          <div className="w-16 h-16 bg-[#f4c542] rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-lg">
            <img src="/icon.svg" alt="Logo" className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black font-nastaliq">
            {mode === 'login' ? 'لاگ اِن کریں' : 
             mode === 'register' ? 'نیا اکاؤنٹ بنائیں' : 
             mode === 'forgot' ? 'پاس ورڈ کی بحالی' : 'تصدیق کریں'}
          </h2>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold text-center border border-rose-100">{error}</div>}
          {feedback && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold text-center border border-emerald-100">{feedback}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex bg-slate-100 dark:bg-emerald-950/40 p-1 rounded-xl">
                <button type="button" onClick={() => setLoginMethod('phone')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${loginMethod === 'phone' ? 'bg-white text-[#0f5132] shadow-sm' : 'text-slate-500'}`}>موبائل نمبر</button>
                <button type="button" onClick={() => setLoginMethod('email')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${loginMethod === 'email' ? 'bg-white text-[#0f5132] shadow-sm' : 'text-slate-500'}`}>ای میل / آئی ڈی</button>
              </div>

              {loginMethod === 'phone' ? (
                <div className="relative">
                  <Phone className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="03XXXXXXXXX" className="w-full pr-10 pl-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0f5132]" />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@mail.com" className="w-full pr-10 pl-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0f5132]" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                    <input value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} placeholder="پاس ورڈ" className="w-full pr-10 pl-10 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0f5132]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-3 text-slate-400">{showPassword ? <EyeOff /> : <Eye />}</button>
                  </div>
                </>
              )}

              <button disabled={loading} className="w-full py-4 bg-[#0f5132] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition disabled:opacity-50">
                {loading ? 'انتظار کریں...' : 'آگے بڑھیں'}
              </button>

              <div className="text-center space-y-3 pt-2">
                <button type="button" onClick={() => setMode('forgot')} className="text-xs text-blue-600 hover:underline">پاس ورڈ بھول گئے؟</button>
                <div className="text-xs text-slate-500">اکاؤنٹ نہیں ہے؟ <button type="button" onClick={() => setMode('register')} className="text-[#0f5132] font-bold">رجسٹر کریں</button></div>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="پہلا نام" className="w-full p-3 bg-slate-50 rounded-xl" />
                <input value={secondName} onChange={e => setSecondName(e.target.value)} placeholder="دوسرا نام" className="w-full p-3 bg-slate-50 rounded-xl" />
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="ای میل (اختیاری)" className="w-full p-3 bg-slate-50 rounded-xl" />
              <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="موبائل نمبر" className="w-full p-3 bg-slate-50 rounded-xl" />
              <select value={city} onChange={e => setCity(e.target.value)} className="w-full p-3 bg-slate-50 rounded-xl">
                {PAKISTANI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button disabled={loading} className="w-full py-4 bg-[#0f5132] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition">
                {loading ? 'انتظار کریں...' : 'رجسٹر کریں'}
              </button>
              <div className="text-center text-xs text-slate-500">پہلے سے اکاؤنٹ ہے؟ <button type="button" onClick={() => setMode('login')} className="text-[#0f5132] font-bold">لاگ اِن</button></div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4">
              <p className="text-xs text-slate-500 text-center">اپنا ای میل درج کریں تاکہ ہم آپ کو پاس ورڈ کی بحالی کا لنک بھیج سکیں۔</p>
              <div className="relative">
                <Mail className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@mail.com" className="w-full pr-10 pl-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0f5132]" />
              </div>
              <button disabled={loading} className="w-full py-4 bg-[#0f5132] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition">
                {loading ? 'انتظار کریں...' : 'لنک بھیجیں'}
              </button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-xs text-slate-500 font-bold">واپس جائیں</button>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-xs text-slate-500 text-center">آپ کے نمبر {phone} پر بھیجا گیا 4 ہندسوں کا کوڈ درج کریں (7861)</p>
              <div className="flex justify-center gap-2">
                {[1,2,3,4].map(i => <input key={i} maxLength={1} className="w-12 h-14 bg-slate-100 rounded-xl text-center text-xl font-bold border-none focus:ring-2 focus:ring-[#0f5132]" />)}
              </div>
              <button className="w-full py-4 bg-[#0f5132] text-white rounded-2xl font-bold shadow-lg active:scale-95 transition">تصدیق کریں</button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-xs text-slate-500 font-bold">نمبر تبدیل کریں</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
