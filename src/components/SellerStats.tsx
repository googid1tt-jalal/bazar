import React, { useState, useMemo } from 'react';
import { OrderItem, BidItem } from '../types/market';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Percent,
  PackageCheck,
  CheckCircle2,
  Sparkles,
  Gavel,
  Check,
  Award
} from 'lucide-react';

interface SellerStatsProps {
  orders: OrderItem[];
  bids?: BidItem[];
  isAdminView?: boolean;
}

interface MonthlyDataPoint {
  month: string;
  monthUrdu: string;
  grossSales: number;
  commission: number;
  netEarnings: number;
  ordersCount: number;
  deliveredCount: number;
  successRate: number;
  bidsReceived: number;
  bidsAccepted: number;
  bidConversion: number;
}

export const SellerStats: React.FC<SellerStatsProps> = ({
  orders,
  bids = [],
  isAdminView = false
}) => {
  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('6m');
  const [activeChart, setActiveChart] = useState<'revenue' | 'delivery' | 'bidding'>('revenue');

  // Compute live aggregates from orders prop
  const liveStats = useMemo(() => {
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(
      (o) => o.shippingStatus === 'delivered' || o.codStatus === 'collected'
    );
    const failedOrReturned = orders.filter(
      (o) => o.shippingStatus === 'delivery_failed' || o.shippingStatus === 'cancelled' || o.returnRequest
    );

    const deliveredCount = deliveredOrders.length;
    const totalGross = deliveredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalCommission = Math.round(totalGross * 0.1);
    const netEarnings = totalGross - totalCommission;

    const successRate = totalOrders > 0
      ? Math.round((deliveredCount / Math.max(deliveredCount + failedOrReturned.length, 1)) * 100)
      : 95;

    // Bids aggregates
    const totalBidsCount = bids.length;
    const acceptedBidsCount = bids.filter((b) => b.status === 'accepted').length;
    const bidConversionRate = totalBidsCount > 0
      ? Math.round((acceptedBidsCount / totalBidsCount) * 100)
      : 75;

    return {
      totalOrders,
      deliveredCount,
      totalGross,
      totalCommission,
      netEarnings,
      failedOrReturnedCount: failedOrReturned.length,
      successRate: Math.min(Math.max(successRate, 60), 100),
      totalBidsCount,
      acceptedBidsCount,
      bidConversionRate
    };
  }, [orders, bids]);

  // Generate 6 months data combining historical baseline + current session's live data
  const monthlyData: MonthlyDataPoint[] = useMemo(() => {
    const historical: MonthlyDataPoint[] = [
      {
        month: 'Jun',
        monthUrdu: 'جون',
        grossSales: 42000,
        commission: 4200,
        netEarnings: 37800,
        ordersCount: 16,
        deliveredCount: 15,
        successRate: 93.7,
        bidsReceived: 9,
        bidsAccepted: 6,
        bidConversion: 66.7
      },
      {
        month: 'Jul',
        monthUrdu: 'جولائی',
        grossSales: 68500,
        commission: 6850,
        netEarnings: 61650,
        ordersCount: 24,
        deliveredCount: 22,
        successRate: 91.6,
        bidsReceived: 14,
        bidsAccepted: 10,
        bidConversion: 71.4
      },
      {
        month: 'Aug',
        monthUrdu: 'اگست',
        grossSales: 94000,
        commission: 9400,
        netEarnings: 84600,
        ordersCount: 32,
        deliveredCount: 30,
        successRate: 93.8,
        bidsReceived: 21,
        bidsAccepted: 16,
        bidConversion: 76.2
      },
      {
        month: 'Sep',
        monthUrdu: 'ستمبر',
        grossSales: 118000,
        commission: 11800,
        netEarnings: 106200,
        ordersCount: 41,
        deliveredCount: 39,
        successRate: 95.1,
        bidsReceived: 28,
        bidsAccepted: 22,
        bidConversion: 78.5
      },
      {
        month: 'Oct',
        monthUrdu: 'اکتوبر',
        grossSales: 145000,
        commission: 14500,
        netEarnings: 130500,
        ordersCount: 52,
        deliveredCount: 50,
        successRate: 96.2,
        bidsReceived: 35,
        bidsAccepted: 28,
        bidConversion: 80.0
      }
    ];

    // Current month (Nov 2026) with live order & bid amounts dynamically blended in
    const currentMonthLiveGross = 162000 + (liveStats.totalGross > 0 ? liveStats.totalGross : 10750);
    const currentMonthCommission = Math.round(currentMonthLiveGross * 0.1);
    const currentMonthNet = currentMonthLiveGross - currentMonthCommission;
    const currentMonthOrders = 58 + liveStats.totalOrders;
    const currentMonthDelivered = 55 + liveStats.deliveredCount;
    const currentMonthRate = Number(((currentMonthDelivered / currentMonthOrders) * 100).toFixed(1));

    const currentMonthBidsReceived = 38 + liveStats.totalBidsCount;
    const currentMonthBidsAccepted = 30 + liveStats.acceptedBidsCount;
    const currentMonthBidConversion = Number(((currentMonthBidsAccepted / currentMonthBidsReceived) * 100).toFixed(1));

    const currentMonth: MonthlyDataPoint = {
      month: 'Nov',
      monthUrdu: 'نومبر (حالیہ)',
      grossSales: currentMonthLiveGross,
      commission: currentMonthCommission,
      netEarnings: currentMonthNet,
      ordersCount: currentMonthOrders,
      deliveredCount: currentMonthDelivered,
      successRate: currentMonthRate,
      bidsReceived: currentMonthBidsReceived,
      bidsAccepted: currentMonthBidsAccepted,
      bidConversion: currentMonthBidConversion
    };

    if (timeRange === '6m') {
      return [...historical, currentMonth];
    }

    const earlierMonths: MonthlyDataPoint[] = [
      { month: 'Dec', monthUrdu: 'دسمبر', grossSales: 28000, commission: 2800, netEarnings: 25200, ordersCount: 11, deliveredCount: 10, successRate: 90.9, bidsReceived: 6, bidsAccepted: 4, bidConversion: 66.7 },
      { month: 'Jan', monthUrdu: 'جنوری', grossSales: 31000, commission: 3100, netEarnings: 27900, ordersCount: 12, deliveredCount: 11, successRate: 91.6, bidsReceived: 7, bidsAccepted: 5, bidConversion: 71.4 },
      { month: 'Feb', monthUrdu: 'فروری', grossSales: 34500, commission: 3450, netEarnings: 31050, ordersCount: 14, deliveredCount: 13, successRate: 92.8, bidsReceived: 8, bidsAccepted: 6, bidConversion: 75.0 },
      { month: 'Mar', monthUrdu: 'مارچ', grossSales: 39000, commission: 3900, netEarnings: 35100, ordersCount: 15, deliveredCount: 14, successRate: 93.3, bidsReceived: 8, bidsAccepted: 6, bidConversion: 75.0 },
      { month: 'Apr', monthUrdu: 'اپریل', grossSales: 36000, commission: 3600, netEarnings: 32400, ordersCount: 14, deliveredCount: 13, successRate: 92.8, bidsReceived: 7, bidsAccepted: 5, bidConversion: 71.4 },
      { month: 'May', monthUrdu: 'مئی', grossSales: 40000, commission: 4000, netEarnings: 36000, ordersCount: 15, deliveredCount: 14, successRate: 93.3, bidsReceived: 8, bidsAccepted: 6, bidConversion: 75.0 }
    ];

    return [...earlierMonths, ...historical, currentMonth];
  }, [liveStats, timeRange]);

  // Overall totals across the period
  const aggregateTotals = useMemo(() => {
    const gross = monthlyData.reduce((acc, m) => acc + m.grossSales, 0);
    const comm = monthlyData.reduce((acc, m) => acc + m.commission, 0);
    const net = gross - comm;
    const avgSuccess = (monthlyData.reduce((acc, m) => acc + m.successRate, 0) / monthlyData.length).toFixed(1);
    const totalOrders = monthlyData.reduce((acc, m) => acc + m.ordersCount, 0);
    const totalBids = monthlyData.reduce((acc, m) => acc + m.bidsReceived, 0);
    const totalAcceptedBids = monthlyData.reduce((acc, m) => acc + m.bidsAccepted, 0);
    const avgBidConversion = ((totalAcceptedBids / totalBids) * 100).toFixed(1);

    return { gross, comm, net, avgSuccess, totalOrders, totalBids, totalAcceptedBids, avgBidConversion };
  }, [monthlyData]);

  // Custom Currency Tooltip for Recharts
  const CustomRevenueTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MonthlyDataPoint;
      return (
        <div className="bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-950 p-3 rounded-xl shadow-xl text-xs space-y-1 text-slate-900 dark:text-white dir-rtl min-w-[190px]">
          <p className="font-extrabold text-[#0f5132] dark:text-[#f4c542] border-b border-slate-100 dark:border-emerald-900/60 pb-1 font-nastaliq">
            ماہ: {data.monthUrdu}
          </p>
          <div className="flex justify-between gap-3 pt-1">
            <span className="text-slate-500 dark:text-slate-400">کل سیلز:</span>
            <span className="font-bold tabular-nums">₨ {data.grossSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[#0f5132] dark:text-[#f4c542] font-semibold">خالص آمدن (90%):</span>
            <span className="font-bold text-[#0f5132] dark:text-[#f4c542] tabular-nums">₨ {data.netEarnings.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-amber-600 dark:text-amber-400">پلیٹ فارم کمیشن (10%):</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">₨ {data.commission.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomDeliveryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MonthlyDataPoint;
      return (
        <div className="bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-950 p-3 rounded-xl shadow-xl text-xs space-y-1 text-slate-900 dark:text-white dir-rtl">
          <p className="font-bold text-emerald-800 dark:text-[#f4c542] font-nastaliq">
            ماہ: {data.monthUrdu}
          </p>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">کامیاب ڈیلیوری شرح:</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{data.successRate}%</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">مکمل پارسلز:</span>
            <span className="font-bold">{data.deliveredCount} از {data.ordersCount}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBiddingTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MonthlyDataPoint;
      return (
        <div className="bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-950 p-3 rounded-xl shadow-xl text-xs space-y-1 text-slate-900 dark:text-white dir-rtl min-w-[190px]">
          <p className="font-bold text-amber-900 dark:text-[#f4c542] font-nastaliq border-b border-slate-100 dark:border-emerald-900/60 pb-1">
            ماہ: {data.monthUrdu}
          </p>
          <div className="flex justify-between gap-3 pt-1">
            <span className="text-slate-500">موصولہ بولیاں (Bids):</span>
            <span className="font-bold text-amber-800 dark:text-amber-400">{data.bidsReceived}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">قبول شدہ (Accepted):</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{data.bidsAccepted}</span>
          </div>
          <div className="flex justify-between gap-3 border-t border-slate-100 dark:border-emerald-900/60 pt-1">
            <span className="text-slate-500">کامیابی شرح (Conversion):</span>
            <span className="font-extrabold text-[#0f5132] dark:text-[#f4c542]">{data.bidConversion}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-4">
      {/* Top Header Card */}
      <div className="p-4 bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#0f5132] dark:text-[#f4c542] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-nastaliq">
                {isAdminView ? 'مارکیٹ سیلز و کمیشن تجزیہ (Platform Analytics)' : 'سیلز و آمدن کا ماہانہ تجزیہ (Seller Stats)'}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#0f5132] dark:text-[#f4c542] text-[10px] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Recharts لائیو</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ماہانہ فروخت، منہا کردہ کمیشن، بولیوں کی پیشکش اور ڈیلیوری کامیابی شرح
            </p>
          </div>
        </div>

        {/* View Range & Chart Type Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Range Selector */}
          <div className="flex bg-slate-100 dark:bg-[#121915] p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                timeRange === '6m'
                  ? 'bg-white dark:bg-[#1e2b24] text-[#0f5132] dark:text-[#f4c542] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              گزشتہ 6 ماہ
            </button>
            <button
              onClick={() => setTimeRange('12m')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                timeRange === '12m'
                  ? 'bg-white dark:bg-[#1e2b24] text-[#0f5132] dark:text-[#f4c542] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              پورے 12 ماہ
            </button>
          </div>

          {/* 3 Chart Type Toggles */}
          <div className="flex bg-slate-100 dark:bg-[#121915] p-1 rounded-xl text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveChart('revenue')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                activeChart === 'revenue'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              آمدن و کمیشن
            </button>

            <button
              onClick={() => setActiveChart('delivery')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                activeChart === 'delivery'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              ترسیلی شرح
            </button>

            <button
              onClick={() => setActiveChart('bidding')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeChart === 'bidding'
                  ? 'bg-[#0f5132] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Gavel className="w-3 h-3 text-[#f4c542]" />
              <span>بولیاں و نیلامی</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Total Gross Sales */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-[#1a241e] rounded-2xl border border-slate-200 dark:border-emerald-950 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] sm:text-xs font-semibold">
              {isAdminView ? 'پلیٹ فارم مجموعی سیلز' : 'کل سیلز رقم (Gross)'}
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-1 font-mono">
            ₨ {aggregateTotals.gross.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 block">
            ↑ 18.4% ماہانہ اضافہ
          </span>
        </div>

        {/* 2. Platform Commission Deducted (10%) */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-[#1a241e] rounded-2xl border border-slate-200 dark:border-emerald-950 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
            <span className="text-[11px] sm:text-xs font-semibold">
              منہا کمیشن (10% Fee)
            </span>
            <Percent className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-800 dark:text-[#f4c542] tabular-nums mt-1 font-mono">
            ₨ {aggregateTotals.comm.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
            سہولت کاری و کوریئر انشورنس
          </span>
        </div>

        {/* 3. Net Seller Earnings */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-[#1a241e] rounded-2xl border border-slate-200 dark:border-emerald-950 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-[#0f5132] dark:text-[#f4c542]">
            <span className="text-[11px] sm:text-xs font-semibold">
              {isAdminView ? 'سیلرز کو ادا شدہ (90%)' : 'سیلر خالص آمدن (Net)'}
            </span>
            <PackageCheck className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-[#0f5132] dark:text-[#f4c542] tabular-nums mt-1 font-mono">
            ₨ {aggregateTotals.net.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 block">
            جاز کیش / ایزی پیسہ کلئیر
          </span>
        </div>

        {/* 4. Delivery Success Rate / Bidding rate */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-[#1a241e] rounded-2xl border border-slate-200 dark:border-emerald-950 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300">
            <span className="text-[11px] sm:text-xs font-semibold">
              ترسیلی کامیابی شرح
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-900 dark:text-emerald-300 tabular-nums mt-1 font-mono">
            {aggregateTotals.avgSuccess}%
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
            بولی کامیابی: {aggregateTotals.avgBidConversion}%
          </span>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 shadow-xs space-y-4">
        {/* Chart Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-emerald-950 pb-3">
          <div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-nastaliq">
              {activeChart === 'revenue'
                ? 'ماہانہ سیلز بنام کمیشن اور خالص آمدن (PKR Monthly Breakdown)'
                : activeChart === 'delivery'
                ? 'ماہانہ ترسیل کامیابی تناسب (Delivery Success Rate Trend %)'
                : 'دستکاری بولیوں اور نیلامی تجزیہ (Bids Received vs Accepted Offers)'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {activeChart === 'revenue'
                ? 'سبز ستون کل سیلز، فیروزی خالص آمدن اور سنہری لکیر منہا کمیشن کو ظاہر کرتی ہے۔'
                : activeChart === 'delivery'
                ? 'ماہ بہ ماہ پارسلز کی بحفاظت اور بروقت ترسیل کا گراف۔'
                : 'خریداروں کی جانب سے دی جانے والی پیشکشیں اور منظور شدہ بولیوں کا تناسب۔'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {activeChart === 'revenue' ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#0f5132]" />
                  <span className="text-slate-700 dark:text-slate-300">کل سیلز</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#10b981]" />
                  <span className="text-slate-700 dark:text-slate-300">خالص آمدن</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#f4c542] rounded-full" />
                  <span className="text-slate-700 dark:text-slate-300">کمیشن (10%)</span>
                </div>
              </>
            ) : activeChart === 'delivery' ? (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#10b981]" />
                <span className="text-slate-700 dark:text-slate-300">کامیابی شرح (%)</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
                  <span className="text-slate-700 dark:text-slate-300">موصولہ بولیاں</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#0f5132]" />
                  <span className="text-slate-700 dark:text-slate-300">قبول شدہ پیشکشیں</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Visual Chart with LTR container for chronological timeline rendering */}
        <div className="h-64 sm:h-72 w-full pt-2" dir="ltr">
          {activeChart === 'revenue' ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="monthUrdu"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(val) => `₨${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
                  tickLine={false}
                />
                <Tooltip content={<CustomRevenueTooltip />} />
                <Bar
                  dataKey="grossSales"
                  name="کل سیلز"
                  fill="#0f5132"
                  radius={[6, 6, 0, 0]}
                  barSize={20}
                />
                <Bar
                  dataKey="netEarnings"
                  name="خالص آمدن"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={16}
                />
                <Line
                  type="monotone"
                  dataKey="commission"
                  name="کمیشن"
                  stroke="#f4c542"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f4c542' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : activeChart === 'delivery' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="monthUrdu"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[80, 100]}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                />
                <Tooltip content={<CustomDeliveryTooltip />} />
                <Area
                  type="monotone"
                  dataKey="successRate"
                  stroke="#0f5132"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSuccess)"
                  dot={{ r: 4, fill: '#0f5132' }}
                  activeDot={{ r: 6, fill: '#f4c542' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="monthUrdu"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomBiddingTooltip />} />
                <Bar
                  dataKey="bidsReceived"
                  name="موصولہ بولیاں"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
                <Bar
                  dataKey="bidsAccepted"
                  name="قبول شدہ"
                  fill="#0f5132"
                  radius={[6, 6, 0, 0]}
                  barSize={18}
                />
                <Line
                  type="monotone"
                  dataKey="bidConversion"
                  name="کامیابی شرح %"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Secondary Info: Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-emerald-950">
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold block">
                کامیاب پارسلز (Delivered COD)
              </span>
              <span className="text-base font-extrabold text-[#0f5132] dark:text-[#f4c542]">
                88% (مجموعی)
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold block">
                بولی کامیابی شرح (Bid Conversion)
              </span>
              <span className="text-base font-extrabold text-amber-800 dark:text-[#f4c542]">
                {aggregateTotals.avgBidConversion}% (منظور شدہ)
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold">
              🔨
            </div>
          </div>

          <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-rose-800 dark:text-rose-300 font-bold block">
                واپسی یا منسوخی (Disputes/Returns)
              </span>
              <span className="text-base font-extrabold text-rose-700 dark:text-rose-400">
                5% (قلیل ترین)
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 flex items-center justify-center font-bold">
              ↩
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
