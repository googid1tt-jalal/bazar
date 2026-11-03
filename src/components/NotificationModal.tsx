import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Package, CheckCircle2, MessageCircle, AlertCircle, Trash2 } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { notifications, currentUser, markNotificationAsRead, clearNotifications, setActiveTab, t, language } = useApp();

  if (!isOpen) return null;

  const userNotifs = notifications.filter(n => n.userId === currentUser?.id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="w-4 h-4 text-emerald-600" />;
      case 'payment': return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">
              {language === 'ur' ? 'اطلاعات و نوٹیفیکیشنز' : language === 'ps' ? 'خبرتیاوې او نوټیفیکیشن' : 'Notifications'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {userNotifs.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-emerald-200 hover:text-white p-1 text-xs flex items-center gap-1"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-2">
          {userNotifs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
              {language === 'ur' ? 'کوئی نئی اطلاع موجود نہیں ہے' : language === 'ps' ? 'نوې خبرتیا نشته' : 'No notifications yet'}
            </div>
          ) : (
            userNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.linkTarget) {
                    setActiveTab(notif.linkTarget);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-white border-slate-200 opacity-80'
                    : 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-xs truncate">
                      {notif.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
