import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, User } from '../types';
import { X, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

interface ReportModalProps {
  target: { type: 'listing' | 'user'; id: string; name: string } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ target, isOpen, onClose }) => {
  const { t, language, submitReport } = useApp();
  const [reason, setReason] = useState('scam_fraud');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(target.type, target.id, target.name, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDetails('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-rose-800 text-white">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-200" />
            <h3 className="font-bold text-sm sm:text-base">
              {t('reportTitle')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-rose-700 text-rose-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {submitted ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">
                {language === 'ur' ? 'شکایت موصول ہو گئی ہے' : language === 'ps' ? 'شکایت ثبت شو' : 'Report Submitted'}
              </h4>
              <p className="text-xs text-slate-600">
                {language === 'ur'
                  ? 'ایڈمن ٹیم 24 گھنٹے کے اندر اس کا جائزہ لے کر کارروائی کرے گی۔'
                  : language === 'ps'
                  ? 'اډمین به ژر تر ژره دا وګوري او اقدام به وکړي.'
                  : 'Platform administrators will review this report within 24 hours.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                <span className="font-semibold">{target.name}</span>
                <span className="block text-[11px] text-rose-700 mt-0.5">
                  ID: {target.id}
                </span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t('reportReason')}
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                >
                  <option value="scam_fraud">
                    {language === 'ur' ? 'دھوکہ دہی یا مشکوک پیشکش' : language === 'ps' ? 'فریب یا جعلکاري' : 'Fraud or Scam Attempt'}
                  </option>
                  <option value="off_platform_payment">
                    {language === 'ur' ? 'ایسکرو سے باہر ذاتی ادائیگی کا مطالبہ' : language === 'ps' ? 'له سیسټم دباندې د پیسو غوښتنه' : 'Demanding Off-Platform Payment'}
                  </option>
                  <option value="fake_items">
                    {language === 'ur' ? 'جعلی، چوری شدہ یا غلط معلومات' : language === 'ps' ? 'جعلي یا نامناسب مالومات' : 'Counterfeit or Misleading Goods'}
                  </option>
                  <option value="inappropriate_language">
                    {language === 'ur' ? 'نازیبا زبان یا بدتمیزی' : language === 'ps' ? 'بد اخلاقي یا بدې خبرې' : 'Abusive Language or Harassment'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t('reportDetails')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    language === 'ur'
                      ? 'براہ کرم واضح کریں کہ کیا غلط تھا...'
                      : language === 'ps'
                      ? 'مهرباني وکړئ د ستونزې په هکله واضح ولیکئ...'
                      : 'Provide specific details for the moderation team...'
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold transition shadow-xs"
              >
                {t('submitReport')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
