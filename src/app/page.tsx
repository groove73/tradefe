'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchMarketData, MarketData } from '@/lib/api';
import { MarketChart } from '@/components/market-chart';

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
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          <span className="text-indigo-600 uppercase italic">지수</span> Dashboard
        </h1>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="baseDate" className="text-sm font-medium text-gray-600 ml-2">
            기준일자:
          </label>
          <input
            id="baseDate"
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-mono"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            조회
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6 font-medium">
        기준일: <span className="text-indigo-600 font-bold">{lastQueriedDate}</span>
      </p>

      <div className="grid grid-cols-1 gap-10">
        <section>
          {loading ? (
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 animate-pulse">KOSPI 데이터를 불러오는 중...</p>
            </div>
          ) : kospiData.length > 0 ? (
            <MarketChart
              data={kospiData}
              title="KOSPI 시리즈 일별시세정보"
              color="#6366f1" // Indigo
            />
          ) : (
            <div className="w-full h-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500 font-medium">KOSPI 데이터가 없습니다.</p>
              <p className="text-xs text-gray-400 mt-1">평일 날짜를 입력해 주세요 (예: 20241227)</p>
            </div>
          )}
        </section>

        <section>
          {loading ? (
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500 animate-pulse">KRX 데이터를 불러오는 중...</p>
            </div>
          ) : krxData.length > 0 ? (
            <MarketChart
              data={krxData}
              title="KRX 시리즈 일별시세정보"
              color="#0ea5e9" // Sky Blue
            />
          ) : (
            <div className="w-full h-[200px] flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500 font-medium">KRX 데이터가 없습니다.</p>
              <p className="text-xs text-gray-400 mt-1">평일 날짜를 입력해 주세요 (예: 20241227)</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
