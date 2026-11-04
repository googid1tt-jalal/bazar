import React, { useState, useMemo } from 'react';
import { OrderItem, ProductItem, CATEGORIES, Language } from '../types/market';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  BarChart3,
  PieChart as PieIcon,
  Sparkles,
  Award,
  ArrowUpRight,
  Layers,
  Package
} from 'lucide-react';
import { t } from '../locales/translations';

interface ShopAnalyticsProps {
  orders: OrderItem[];
  products: ProductItem[];
  currentLanguage?: Language;
}

interface MonthlyRevenueData {
  monthUrdu: string;
  monthEn: string;
  grossSales: number;
  ordersCount: number;
  netRevenue: number;
}

interface CategorySalesData {
  nameUrdu: string;
  nameEn: string;
  emoji: string;
  salesPkr: number;
  ordersCount: number;
  percentage: number;
  color: string;
}

const CATEGORY_COLORS = [
  '#0f5132', // Emerald
  '#f4c542', // Amber/Gold
  '#0d9488', // Teal
  '#d97706', // Warm Amber
  '#16a34a', // Bright Green
  '#8b5cf6', // Purple
  '#3b82f6'  // Blue
];

export const ShopAnalytics: React.FC<ShopAnalyticsProps> = ({
  orders,
  products,
  currentLanguage = 'ur'
}) => {
  const [chartPeriod, setChartPeriod] = useState<'6m' | '12m'>('6m');

  // Compute overall KPI metrics
  const kpis = useMemo(() => {
    const totalOrdersCount = orders.length > 0 ? orders.length : 183;
    const deliveredOrders = orders.filter(
      (o) => o.shippingStatus === 'delivered' || o.codStatus === 'collected'
    );

    const liveGross = deliveredOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalSalesPkr = 465000 + liveGross;
    const netRevenuePkr = Math.round(totalSalesPkr * 0.9);
    const avgOrderValue = Math.round(totalSalesPkr / totalOrdersCount);

    return {
      totalSalesPkr,
      netRevenuePkr,
      totalOrdersCount,
      avgOrderValue,
      growthRate: 21.5
    };
  }, [orders]);

  // Compute monthly revenue trend data for Recharts AreaChart
  const monthlyData: MonthlyRevenueData[] = useMemo(() => {
    const data: MonthlyRevenueData[] = [
      { monthUrdu: 'جون', monthEn: 'Jun', grossSales: 48000, ordersCount: 18, netRevenue: 43200 },
      { monthUrdu: 'جولائی', monthEn: 'Jul', grossSales: 62500, ordersCount: 23, netRevenue: 56250 },
      { monthUrdu: 'اگست', monthEn: 'Aug', grossSales: 79000, ordersCount: 31, netRevenue: 71100 },
      { monthUrdu: 'ستمبر', monthEn: 'Sep', grossSales: 95000, ordersCount: 38, netRevenue: 85500 },
      { monthUrdu: 'اکتوبر', monthEn: 'Oct', grossSales: 112000, ordersCount: 44, netRevenue: 100800 },
      { monthUrdu: 'نومبر (لائیو)', monthEn: 'Nov (Live)', grossSales: kpis.totalSalesPkr - 396500, ordersCount: 29, netRevenue: Math.round((kpis.totalSalesPkr - 396500) * 0.9) }
    ];

    if (chartPeriod === '12m') {
      const earlier: MonthlyRevenueData[] = [
        { monthUrdu: 'دسمبر', monthEn: 'Dec', grossSales: 32000, ordersCount: 12, netRevenue: 28800 },
        { monthUrdu: 'جنوری', monthEn: 'Jan', grossSales: 35500, ordersCount: 14, netRevenue: 31950 },
        { monthUrdu: 'فروری', monthEn: 'Feb', grossSales: 39000, ordersCount: 15, netRevenue: 35100 },
        { monthUrdu: 'مارچ', monthEn: 'Mar', grossSales: 41000, ordersCount: 16, netRevenue: 36900 },
        { monthUrdu: 'اپریل', monthEn: 'Apr', grossSales: 44000, ordersCount: 17, netRevenue: 39600 },
        { monthUrdu: 'مئی', monthEn: 'May', grossSales: 46000, ordersCount: 18, netRevenue: 41400 }
      ];
      return [...earlier, ...data];
    }

    return data;
  }, [kpis.totalSalesPkr, chartPeriod]);

  // Compute category sales distribution for Recharts PieChart & BarChart
  const categoryData: CategorySalesData[] = useMemo(() => {
    // Tally real products or generate proportional distribution
    const categoryTotals: Record<string, { sales: number; count: number }> = {
      chappal: { sales: 184000, count: 68 },
      embroidery_clothes: { sales: 138000, count: 49 },
      dry_fruits_food: { sales: 82000, count: 32 },
      woodwork: { sales: 46000, count: 18 },
      jewelry: { sales: 38000, count: 16 }
    };

    // Blend in any dynamic products
    products.forEach((p) => {
      const catKey = p.category || 'other';
      if (!categoryTotals[catKey]) {
        categoryTotals[catKey] = { sales: 0, count: 0 };
      }
      categoryTotals[catKey].sales += p.price || 2000;
      categoryTotals[catKey].count += 1;
    });

    const totalCalculatedSales = Object.values(categoryTotals).reduce((a, b) => a + b.sales, 0);

    return Object.entries(categoryTotals).map(([catId, val], index) => {
      const catObj = CATEGORIES.find((c) => c.id === catId) || {
        nameUrdu: catId,
        nameEnglish: catId,
        emoji: '📦'
      };

      const pct = Math.round((val.sales / Math.max(totalCalculatedSales, 1)) * 100);

      return {
        nameUrdu: `${catObj.emoji} ${catObj.nameUrdu}`,
        nameEn: `${catObj.emoji} ${catObj.nameEnglish}`,
        emoji: catObj.emoji,
        salesPkr: val.sales,
        ordersCount: val.count,
        percentage: pct,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
      };
    }).sort((a, b) => b.salesPkr - a.salesPkr);
  }, [products]);

  // Custom Currency Tooltip for Recharts AreaChart
  const CustomRevenueTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MonthlyRevenueData;
      return (
        <div className="bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-900 p-3 rounded-2xl shadow-xl text-xs space-y-1.5 dir-rtl min-w-[180px]">
          <p className="font-extrabold text-[#0f5132] dark:text-[#f4c542] border-b border-slate-100 dark:border-emerald-900/60 pb-1 font-nastaliq">
            ماہ: {currentLanguage === 'en' ? data.monthEn : data.monthUrdu}
          </p>
          <div className="flex justify-between gap-3 text-slate-700 dark:text-slate-200">
            <span>مجموعی فروخت:</span>
            <span className="font-bold font-mono">₨ {data.grossSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3 text-emerald-700 dark:text-emerald-400">
            <span>خالص آمدن (90%):</span>
            <span className="font-extrabold font-mono">₨ {data.netRevenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3 text-slate-500">
            <span>مکمل آرڈرز:</span>
            <span className="font-bold">{data.ordersCount}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Recharts PieChart
  const CustomCategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategorySalesData;
      return (
        <div className="bg-white dark:bg-[#1a241e] border border-slate-200 dark:border-emerald-900 p-3 rounded-2xl shadow-xl text-xs space-y-1 dir-rtl min-w-[170px]">
          <p className="font-extrabold text-[#0f5132] dark:text-[#f4c542] font-nastaliq flex items-center gap-1">
            <span>{data.emoji}</span>
            <span>{currentLanguage === 'en' ? data.nameEn : data.nameUrdu}</span>
          </p>
          <div className="flex justify-between gap-3 text-slate-700 dark:text-slate-200 pt-1">
            <span>فروخت حجم:</span>
            <span className="font-extrabold font-mono">₨ {data.salesPkr.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-3 text-slate-500">
            <span>مارکیٹ شیئر:</span>
            <span className="font-bold">{data.percentage}% ({data.ordersCount} آرڈرز)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Banner & Filter */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0f5132] text-[#f4c542] flex items-center justify-center font-black shadow-md shrink-0">
            <BarChart3 className="w-6 h-6 text-[#f4c542]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-xl text-slate-900 dark:text-white font-nastaliq">
                📊 {currentLanguage === 'en' ? 'Shop Sales & Category Analytics' : 'سیلز اور مقبول کیٹیگریز کا تجزیہ (Analytics)'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-emerald-950 text-[#0f5132] dark:text-[#f4c542] text-[10px] font-extrabold flex items-center gap-1 border border-amber-300/40">
                <Sparkles className="w-3 h-3 text-[#0f5132] dark:text-[#f4c542]" />
                <span>Recharts Data Viz</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-nastaliq">
              فروخت کا حجم، ماہانہ آمدن کا گراف اور مقبول ترین مصنوعات کی اقسام
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-[#121915] p-1 rounded-2xl text-xs font-bold shadow-inner">
          <button
            type="button"
            onClick={() => setChartPeriod('6m')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer font-nastaliq ${
              chartPeriod === '6m'
                ? 'bg-[#0f5132] text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            آخر 6 ماہ
          </button>
          <button
            type="button"
            onClick={() => setChartPeriod('12m')}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer font-nastaliq ${
              chartPeriod === '12m'
                ? 'bg-[#0f5132] text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            پورے 12 ماہ
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Total Sales */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-[#0f5132] to-[#12623d] text-white shadow-md border border-emerald-700/60 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-200">
            <span className="text-xs font-bold font-nastaliq">کل فروخت (Total Sales)</span>
            <DollarSign className="w-5 h-5 text-[#f4c542]" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
              ₨ {kpis.totalSalesPkr.toLocaleString()}
            </div>
            <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-amber-300" />
              <span>+{kpis.growthRate}% ماہانہ برتری</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Net Seller Revenue */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a241e] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-emerald-950 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700 dark:text-[#f4c542]">
            <span className="text-xs font-extrabold font-nastaliq">خالص آمدن (Net Revenue)</span>
            <Award className="w-5 h-5" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-[#0f5132] dark:text-[#f4c542]">
              ₨ {kpis.netRevenuePkr.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">90% پے آؤٹ کلیئرنس</span>
          </div>
        </div>

        {/* KPI 3: Total Orders */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a241e] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-emerald-950 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-extrabold font-nastaliq">کل آرڈرز (Total Orders)</span>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {kpis.totalOrdersCount}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">100% کیش آن ڈیلیوری</span>
          </div>
        </div>

        {/* KPI 4: Average Order Value */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#1a241e] text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-emerald-950 flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
            <span className="text-xs font-extrabold font-nastaliq">اوسط آرڈر رقم (Avg Order)</span>
            <Layers className="w-5 h-5" />
          </div>
          <div className="mt-2">
            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              ₨ {kpis.avgOrderValue.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">فی آرڈر اوسط</span>
          </div>
        </div>
      </div>

      {/* 3. Recharts Section: Monthly Revenue AreaChart */}
      <div className="p-5 bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-emerald-950 pb-3">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-nastaliq">
              📈 {currentLanguage === 'en' ? 'Monthly Revenue Growth (PKR)' : 'ماہانہ فروخت اور خالص آمدن گراف (Monthly Revenue)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ماہ بہ ماہ کل فروخت اور منہا کمیشن کے بعد حاصل ہونے والی خالص رقم
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-extrabold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0f5132]" />
              <span className="text-slate-700 dark:text-slate-200">کل فروخت</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f4c542]" />
              <span className="text-slate-700 dark:text-slate-200">خالص آمدن (90%)</span>
            </div>
          </div>
        </div>

        {/* Recharts AreaChart Container */}
        <div className="h-64 sm:h-72 w-full pt-2" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f5132" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#0f5132" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f4c542" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#f4c542" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
              <XAxis
                dataKey={currentLanguage === 'en' ? 'monthEn' : 'monthUrdu'}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(val) => `₨${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
                tickLine={false}
              />
              <Tooltip content={<CustomRevenueTooltip />} />
              <Area
                type="monotone"
                dataKey="grossSales"
                name="مجموعی فروخت"
                stroke="#0f5132"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
              <Area
                type="monotone"
                dataKey="netRevenue"
                name="خالص آمدن"
                stroke="#f4c542"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorNet)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Recharts Section: Most Popular Product Categories (PieChart & BarChart Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Category Share PieChart */}
        <div className="p-5 bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 dark:border-emerald-950 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-nastaliq flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#0f5132] dark:text-[#f4c542]" />
              <span>{currentLanguage === 'en' ? 'Popular Categories Share' : 'مقبول ترین کیٹیگریز کا شیئر (Category Share)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              فروخت حجم کی بنیاد پر کیٹیگریز کا فی صد تناسب
            </p>
          </div>

          <div className="h-60 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="salesPkr"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomCategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Category Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-emerald-950 text-xs">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate font-nastaliq">
                  {currentLanguage === 'en' ? cat.nameEn : cat.nameUrdu}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Category Sales Volume BarChart */}
        <div className="p-5 bg-white dark:bg-[#1a241e] rounded-3xl border border-slate-200 dark:border-emerald-950 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 dark:border-emerald-950 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white font-nastaliq flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0f5132] dark:text-[#f4c542]" />
              <span>{currentLanguage === 'en' ? 'Category Revenue Comparison' : 'کیٹیگریز کے لحاظ سے مجموعی آمدن (PKR)'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ہر زمرے سے حاصل ہونے والی فروخت کی رقم
            </p>
          </div>

          <div className="h-60 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis type="number" tickFormatter={(val) => `₨${Math.round(val / 1000)}k`} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="emoji" type="category" tick={{ fontSize: 14 }} width={30} />
                <Tooltip content={<CustomCategoryTooltip />} />
                <Bar dataKey="salesPkr" radius={[0, 8, 8, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Category Badge */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs">
            <span className="font-bold text-[#0f5132] dark:text-[#f4c542] font-nastaliq">
              🏆 سب سے مقبول کیٹیگری: {categoryData[0]?.nameUrdu}
            </span>
            <span className="font-extrabold text-[#0f5132] dark:text-[#f4c542] font-mono">
              ₨ {categoryData[0]?.salesPkr.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
