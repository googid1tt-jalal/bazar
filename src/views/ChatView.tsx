import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Image, MessageSquare, User, ArrowLeft, ArrowRight, CheckCheck, Sparkles } from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    currentUser,
    allUsers,
    chatMessages,
    sendChatMessage,
    selectedChatUserId,
    setSelectedChatUserId,
    listings,
    t,
    language,
    isRTL
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available conversation partners
  const otherUsers = allUsers.filter((u) => u.id !== currentUser?.id);
  const activeRecipientId = selectedChatUserId || otherUsers[0]?.id;
  const recipient = allUsers.find((u) => u.id === activeRecipientId);

  // Filter messages for current pair
  const conversationMessages = chatMessages.filter(
    (m) =>
      (m.senderId === currentUser?.id && m.recipientId === activeRecipientId) ||
      (m.senderId === activeRecipientId && m.recipientId === currentUser?.id)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeRecipientId) return;

    sendChatMessage(activeRecipientId, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    if (!activeRecipientId) return;
    sendChatMessage(activeRecipientId, text);
  };

  const quickRepliesList = [
    { text: t('qrGreeting'), label: 'سلام / احوال' },
    { text: t('qrPrice'), label: 'رعایت / تخفیف' },
    { text: t('qrTimeline'), label: 'ترسیل کی تاریخ' }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[75vh]">
        {/* Left / Contact List Sidebar (4 cols) */}
        <div className={`md:col-span-4 border-e border-slate-200 flex flex-col ${selectedChatUserId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 nastaliq-heading">
              {t('messages')}
            </h2>
            <span className="text-[11px] text-slate-500">
              {language === 'ur' ? 'خریدار اور سیلر کے درمیان باہمی رابطہ' : language === 'ps' ? 'د پیرودونکي او پلورونکي ترمنځ خبرې' : 'Direct Messages'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {otherUsers.map((user) => {
              const isSelected = user.id === activeRecipientId;
              const lastMsg = chatMessages
                .filter(
                  (m) =>
                    (m.senderId === currentUser?.id && m.recipientId === user.id) ||
                    (m.senderId === user.id && m.recipientId === currentUser?.id)
                )
                .slice(-1)[0];

              return (
                <button
                  key={user.id}
                  onClick={() => setSelectedChatUserId(user.id)}
                  className={`w-full p-3.5 flex items-center gap-3 text-start transition cursor-pointer ${
                    isSelected ? 'bg-emerald-50/70 border-s-4 border-emerald-800' : 'hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 text-xs truncate">
                        {user.name}
                      </h4>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : user.city}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right / Active Chat Pane (8 cols) */}
        <div className={`md:col-span-8 flex flex-col ${!selectedChatUserId ? 'hidden md:flex' : 'flex'}`}>
          {recipient ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setSelectedChatUserId(null)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                  </button>
                  <img
                    src={recipient.avatar}
                    alt={recipient.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {recipient.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {recipient.city} · {recipient.skills[0] || 'Member'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                  {language === 'ur' ? 'محفوظ چیٹ' : language === 'ps' ? 'خوندي چټ' : 'Escrow Safe'}
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
                {conversationMessages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                    <p>
                      {language === 'ur'
                        ? `${recipient.name} کو پہلا پیغام بھیجیں۔`
                        : language === 'ps'
                        ? `${recipient.name} ته لومړی پیغام واستوئ.`
                        : `Start a conversation with ${recipient.name}.`}
                    </p>
                  </div>
                ) : (
                  conversationMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-2xl text-xs sm:text-sm shadow-xs ${
                            isMe
                              ? 'bg-emerald-800 text-white rounded-br-xs font-nastaliq'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs font-nastaliq'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${
                              isMe ? 'text-emerald-200' : 'text-slate-400'
                            }`}
                          >
                            <span>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies Strip */}
              <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[10px] text-slate-400 shrink-0">
                  {t('quickReplies')}
                </span>
                {quickRepliesList.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(qr.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-[11px] whitespace-nowrap transition border border-slate-200"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('typeMessage')}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-200 text-white transition shadow-xs cursor-pointer shrink-0"
                >
                  <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-slate-400 text-xs">
              گفتگو شروع کرنے کے لیے کسی سیلر یا خریدار کا انتخاب کریں۔
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
