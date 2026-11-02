import React from 'react';
import { ShippingNotification } from '../types/market';
import { Bell, X, CheckCheck, Truck, Package, RotateCcw } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: ShippingNotification[];
  onMarkAllAsRead: () => void;
  onSelectOrder: (orderId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectOrder
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950 overflow-hidden max-h-[85vh] flex flex-col animate-scale-up">
        {/* Header */}
        <div className="p-4 bg-[#0f5132] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#f4c542]" />
            <h3 className="font-bold text-base sm:text-lg font-nastaliq">
              ترسیل کی اطلاعات و نوٹیفیکیشنز
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 text-xs">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-emerald-950" />
              <p>کوئی نئی اطلاع موجود نہیں ہے۔</p>
            </div>
          ) : (
            <>
              <div className="flex justify-end pb-1">
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-[#0f5132] dark:text-[#f4c542] hover:underline font-bold"
                >
                  سب پڑھ لیں (Mark all read)
                </button>
              </div>

              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    onSelectOrder(n.orderId);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border transition cursor-pointer ${
                    n.read
                      ? 'bg-slate-50 dark:bg-[#141d18] border-slate-200 dark:border-emerald-950 opacity-80'
                      : 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-[#1c2621] text-[#0f5132] dark:text-[#f4c542] shrink-0 mt-0.5 shadow-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                        {n.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {n.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
