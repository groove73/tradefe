'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchMarketData, MarketData } from '@/lib/api';
import { MarketChart } from '@/components/market-chart';
import { MarketSummaryCards } from '@/components/dashboard/MarketSummaryCards';
import { BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  // Default to yesterday's date in YYYY-MM-DD format for date picker
  const getYesterdayPickerString = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  const formatDateForApi = (dateStr: string) => {
    return dateStr.replace(/-/g, '');
  };

  const [dateInput, setDateInput] = useState(getYesterdayPickerString());
  const [lastQueriedDate, setLastQueriedDate] = useState(formatDateForApi(getYesterdayPickerString()));
  const [kospiData, setKospiData] = useState<MarketData[]>([]);
  const [krxData, setKrxData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (queryDate: string) => {
    setLoading(true);
    try {
      const [kospi, krx] = await Promise.all([
        fetchMarketData(queryDate, 'KOSPI'),
        fetchMarketData(queryDate, 'KRX')
      ]);
      setKospiData(kospi);
      setKrxData(krx);
      setLastQueriedDate(queryDate);
    } catch (error) {
      console.error('Failed to load market data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const yesterday = getYesterdayPickerString();
    loadData(formatDateForApi(yesterday));
  }, [loadData]);

  const handleSearch = () => {
    loadData(formatDateForApi(dateInput));
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-indigo-100 rounded-xl">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
          </span>
          <span className="text-indigo-600 uppercase italic">지수</span> Dashboard
        </h1>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <label htmlFor="baseDate" className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-2">
            기준일자
          </label>
          <input
            id="baseDate"
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold font-mono bg-gray-50"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-black transition-all shadow-md active:scale-95"
          >
            조회
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-8 font-medium bg-gray-100 w-fit px-4 py-2 rounded-full">
        기준일: <span className="text-indigo-600 font-black">{lastQueriedDate}</span>
      </p>

      <div className="grid grid-cols-1 gap-12">
        <section>
          {loading ? (
            <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-[2rem] border border-dashed border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">KOSPI 데이터를 불러오는 중...</p>
              </div>
            </div>
          ) : kospiData.length > 0 ? (
            <>
              <MarketSummaryCards data={kospiData} title="KOSPI" />
              <MarketChart
                data={kospiData}
                title="KOSPI 시리즈 등락률"
                color="#6366f1" // Indigo
              />
            </>
          ) : (
            <div className="w-full h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-200">
              <p className="text-gray-500 font-black text-xl mb-2">데이터가 없습니다</p>
              <p className="text-sm text-gray-400">평일 날짜를 입력해 주세요 (예: 20241227)</p>
            </div>
          )}
        </section>

        <section>
          {loading ? (
            <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-[2rem] border border-dashed border-gray-200">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">KRX 데이터를 불러오는 중...</p>
              </div>
            </div>
          ) : krxData.length > 0 ? (
            <>
              <MarketSummaryCards data={krxData} title="KRX" />
              <MarketChart
                data={krxData}
                title="KRX 시리즈 등락률"
                color="#0ea5e9" // Sky Blue
              />
            </>
          ) : (
            <div className="w-full h-[300px] flex flex-col items-center justify-center bg-gray-50 rounded-3xl border border-gray-200">
              <p className="text-gray-500 font-black text-xl mb-2">데이터가 없습니다</p>
              <p className="text-sm text-gray-400">평일 날짜를 입력해 주세요 (예: 20241227)</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
