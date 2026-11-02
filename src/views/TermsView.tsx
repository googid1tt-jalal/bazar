import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, FileText, CheckCircle, Scale, AlertCircle } from 'lucide-react';

export const TermsView: React.FC = () => {
  const { t, language } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>قوانین و تحفظ خریدار</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 nastaliq-heading">
            {t('termsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ہنر بازار (Hunar Bazaar) کے ذریعے خرید و فروخت، ایسکرو ادائیگیاں، اور رازداری کی مکمل پالیسی۔
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>1. خریدار کا تحفظ اور ایسکرو سسٹم (Buyer Escrow Protection)</span>
            </h3>
            <p>
              ہنر بازار پر تمام آرڈرز کی رقوم پلیٹ فارم کے تصدیق شدہ ایسکرو اکاؤنٹ میں بطور امانت جمع ہوتی ہیں۔ جب کوئی خریدار جاز کیش، ایزی پیسہ یا بینک ٹرانسفر کے ذریعے ادائیگی کرتا ہے تو ایڈمن اس کی تصدیق کرتا ہے۔ رقم سیلر کو اس وقت تک منتقل نہیں کی جاتی جب تک خریدار ترسیل موصول ہونے کی تصدیق نہ کر دے۔ اگر سیلر کام فراہم نہ کرے تو خریدار کی 100 فیصد رقم واپس کر دی جاتی ہے۔
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>2. پلیٹ فارم کمیشن پالیسی (10% Platform Fee)</span>
            </h3>
            <p>
              مارکیٹ پلیس کے سرور اخراجات، ایسکرو تحفظ، اور سپورٹ فراہم کرنے کے لیے ہنر بازار ہر کامیاب آرڈر پر صرف 10 فیصد فیس وصول کرتا ہے۔ باقی 90 فیصد رقم بغیر کسی اضافی کٹوتی کے سیلر کے جازکیش یا ایزی پیسہ پر ریلیز کی جاتی ہے۔
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>3. ممنوعہ اشیاء اور فراڈ پر پابندی (Prohibited Items & Anti-Fraud)</span>
            </h3>
            <p>
              پلیٹ فارم کے باہر ذاتی اکاؤنٹ میں رقم مانگنا سخت منع ہے اور ایسا کرنے والے کا اکاؤنٹ مستقل طور پر بلاک کر دیا جائے گا۔ چوری شدہ، جعلی، غیر اخلاقی یا غیر قانونی سامان و سروسز پر فوری پابندی ہے۔
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="font-bold text-base text-emerald-950 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>4. رازداری کی پالیسی (Privacy & Data Protection)</span>
            </h3>
            <p>
              آپ کا موبائل نمبر اور ذاتی معلومات محفوظ رکھی جاتی ہیں اور کسی غیر متعلقہ فریق کو فراہم نہیں کی جاتیں۔ پلیٹ فارم لوکل سیکیورٹی پروٹوکولز کے تحت کام کرتا ہے۔
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
