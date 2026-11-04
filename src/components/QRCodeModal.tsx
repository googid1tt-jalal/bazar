import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ProductItem, Language } from '../types/market';
import { getProductTitle, getProductCity, buildWhatsAppOrderUrl, formatToPakistaniWhatsapp } from '../utils/helpers';
import { t } from '../locales/translations';
import { X, QrCode, Download, Share2, Copy, Check, MessageCircle, MapPin, Truck } from 'lucide-react';

interface QRCodeModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  product,
  isOpen,
  onClose,
  currentLanguage
}) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !product) return null;

  const productTitle = getProductTitle(product, currentLanguage);
  const productCity = getProductCity(product, currentLanguage);
  const shippingFee = product.shippingFee ?? 200;

  // Generate unique product share URL
  const baseUrl = window.location.origin + window.location.pathname;
  const productShareUrl = `${baseUrl}?product=${product.id}`;

  // WhatsApp pre-filled text
  const waPhone = formatToPakistaniWhatsapp(product.whatsapp);
  const shareText =
    currentLanguage === 'ps'
      ? `🧶 په هنر بازار کې دا لاسي ښکلی توکی وګورئ:\n📦 "${productTitle}"\n💰 بیه: ₨ ${product.price.toLocaleString()} روپۍ (${productCity})\n🚚 رسول: ${shippingFee === 0 ? 'وړیا' : `₨ ${shippingFee}`}\nد اخیستلو یا خبرو لپاره دا لینک ووهئ:`
      : currentLanguage === 'en'
      ? `🧶 Check out this handcrafted item on Hunar Bazaar Marketplace:\n📦 "${productTitle}"\n💰 Price: PKR ${product.price.toLocaleString()} (${productCity})\n🚚 Shipping: ${shippingFee === 0 ? 'Free' : `PKR ${shippingFee}`}\nView item & order via WhatsApp:`
      : `🧶 ہنر بازار پر یہ روایتی دستکاری دیکھیں:\n📦 "${productTitle}"\n💰 قیمت: ₨ ${product.price.toLocaleString()} روپے (${productCity})\n🚚 ترسیل فیس: ${shippingFee === 0 ? 'مفت ترسیل' : `${shippingFee} روپے`}\nبراہِ راست آرڈر کریں:`;

  const fullWhatsAppShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${productShareUrl}`)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n${productShareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    window.open(fullWhatsAppShareLink, '_blank');
  };

  // Convert SVG QR element to PNG for download
  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 360, 360);

        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `hunar-bazaar-${product.id}-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white dark:bg-[#1a241e] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-950 overflow-hidden my-auto animate-scale-up">
        
        {/* Header */}
        <div className="p-4 bg-[#0f5132] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#f4c542]" />
            <h3 className="font-extrabold text-sm sm:text-base font-nastaliq">
              {currentLanguage === 'ps'
                ? 'د توکي QR کوډ او واټساپ شریکول'
                : currentLanguage === 'en'
                ? 'Product Listing QR Code & WhatsApp Share'
                : 'آئٹم QR کوڈ و واٹس ایپ شیئر'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poster Card Container */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Printable Card Preview */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50 via-white to-amber-50/50 dark:from-[#121915] dark:via-[#19241e] dark:to-[#121915] border border-emerald-200 dark:border-emerald-900/80 shadow-xs flex flex-col items-center text-center space-y-3">
            
            {/* Platform Branding */}
            <div className="flex items-center gap-1.5 bg-[#0f5132] text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">
              <span>🧶</span>
              <span className="font-nastaliq">ہنر بازار • Hunar Bazaar</span>
            </div>

            {/* Product Image & Info */}
            <div className="flex items-center gap-3 w-full bg-white dark:bg-[#121915] p-2.5 rounded-xl border border-slate-200/80 dark:border-emerald-950 text-start">
              {product.photoUrl ? (
                <img
                  src={product.photoUrl}
                  alt={productTitle}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-emerald-900"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-[#f6f4ee] dark:bg-[#1a241e] flex items-center justify-center text-2xl shrink-0 border border-slate-200 dark:border-emerald-900">
                  🧶
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                  {productTitle}
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#0f5132] dark:text-[#f4c542] tabular-nums">
                    ₨ {product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{productCity}</span>
                  </span>
                </div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>{shippingFee === 0 ? 'مفت ترسیل (Free Delivery)' : `ترسیل: ₨ ${shippingFee}`}</span>
                </div>
              </div>
            </div>

            {/* Scannable SVG QR Code */}
            <div ref={qrRef} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md inline-block">
              <QRCodeSVG
                value={productShareUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#0f5132"
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Instruction Helper Text */}
            <p className="text-[11px] text-slate-600 dark:text-slate-300 px-2 font-medium">
              {currentLanguage === 'ps'
                ? 'د کیمرې یا واټساپ لخوا دا QR کوډ وکاږئ ترڅو سمدستي اعلان وګورئ او فرمایش ورکړئ.'
                : currentLanguage === 'en'
                ? 'Scan this QR code with any camera or WhatsApp to open listing and order directly.'
                : 'اس QR کوڈ کو موبائل کیمرے یا واٹس ایپ سے اسکین کریں اور فوری آرڈر کیٹلاگ دیکھیں۔'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            
            {/* 1. Share on WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>
                {currentLanguage === 'ps'
                  ? 'په واټساپ کې اعلان شریکول'
                  : currentLanguage === 'en'
                  ? 'Share Listing on WhatsApp'
                  : 'واٹس ایپ پر اشتہار شیئر کریں'}
              </span>
            </button>

            {/* 2. Download QR Image Poster */}
            <button
              onClick={handleDownloadQR}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0f5132] hover:bg-emerald-900 text-white font-bold text-xs transition flex items-center justify-center gap-2 border border-emerald-800 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#f4c542]" />
              <span>
                {currentLanguage === 'ps'
                  ? 'د QR کوډ عکس ښکته کول (PNG Download)'
                  : currentLanguage === 'en'
                  ? 'Download QR Code Image'
                  : 'QR کوڈ تصویر ڈاؤن لوڈ کریں (PNG)'}
              </span>
            </button>

            {/* 3. Copy Share Link */}
            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-[#121915] hover:bg-slate-200 dark:hover:bg-[#1c2720] text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-emerald-950 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                    {currentLanguage === 'ps' ? 'لینک کاپي شو!' : currentLanguage === 'en' ? 'Link Copied!' : 'لنک کاپی ہو گیا!'}
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>
                    {currentLanguage === 'ps' ? 'د توکي لینک کاپي کول' : currentLanguage === 'en' ? 'Copy Product Direct Link' : 'اشتہار کا مستقیم لنک کاپی کریں'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
