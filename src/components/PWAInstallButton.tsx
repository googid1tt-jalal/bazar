import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0f5132] bg-[#f4c542] hover:bg-[#e5b634] rounded-xl shadow-xs transition-all active:scale-95 shrink-0 font-nastaliq cursor-pointer"
        title="Add to Home Screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="whitespace-nowrap">ایپ انسٹال کریں</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-[#0f5132] bg-[#f4c542] hover:bg-[#e5b634] rounded-xl shadow-xs transition-all shrink-0 font-nastaliq cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">انسٹال (iOS)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1a241e] p-5 shadow-2xl border border-slate-200 dark:border-emerald-950 font-nastaliq">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-950">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0f5132] flex items-center justify-center text-white">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    آئی فون / آئی پیڈ پر انسٹال کریں
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#f4c542] text-[#0f5132] font-extrabold flex items-center justify-center shrink-0">1</span>
                  <p>
                    سفاری براؤزر کے نیچے موجود شیئر (Share) بٹن پر ٹیپ کریں۔
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#f4c542] text-[#0f5132] font-extrabold flex items-center justify-center shrink-0">2</span>
                  <p>
                    نیچے اسکرول کریں اور "Add to Home Screen" منتخب کریں۔
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#f4c542] text-[#0f5132] font-extrabold flex items-center justify-center shrink-0">3</span>
                  <p>
                    اوپر دائیں جانب "Add" پر کلک کریں۔ ایپ بغیر انٹرنیٹ براؤزر کے چلے گی!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#0f5132] text-white font-bold text-xs hover:bg-emerald-900 transition"
              >
                سمجھ آ گئی
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
