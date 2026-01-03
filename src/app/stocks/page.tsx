'use client';

import { useState, useEffect } from 'react';
import { fetchStockData, StockData } from '@/lib/api';
import { StockTable } from '@/components/StockTable';
import { useQueryState, parseAsString } from 'nuqs';

import { Suspense } from 'react';

function StocksContent() {
    const getYesterdayDateString = () => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
    };

    const formatDateForApi = (dateStr: string) => {
        return dateStr.replace(/-/g, '');
    };

    const [date, setDate] = useQueryState('date', parseAsString.withDefault(getYesterdayDateString()));
    const [marketType, setMarketType] = useQueryState('market', parseAsString.withDefault('KOSDAQ'));
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    useEffect(() => {
        if (date) {
            loadData(date, marketType);
        }
    }, []);

    const loadData = async (searchDate: string, type: string) => {
        setLoading(true);
        const apiDate = formatDateForApi(searchDate);
        const data = await fetchStockData(apiDate, type);
        setStockData(data);
        setLoading(false);
        setHasSearched(true);
    };

    const handleSearch = () => {
        if (date && date.length === 10) {
            loadData(date, marketType);
        } else {
            alert('날짜를 올바르게 선택해주세요.');
        }
    };

    const handleMarketChange = (type: string) => {
        setMarketType(type);
        // If we've already searched, automatically re-fetch for the new market
        if (hasSearched && date && date.length === 10) {
            loadData(date, type);
        }
    };

    const getTitle = () => {
        switch (marketType) {
            case 'KOSPI': return '유가증권';
            case 'KONEX': return '코넥스';
            default: return '코스닥';
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    {getTitle()} 일별매매정보
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
                        {[
                            { id: 'KOSPI', label: 'KOSPI' },
                            { id: 'KOSDAQ', label: 'KOSDAQ' },
                            { id: 'KONEX', label: 'KONEX' }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => handleMarketChange(m.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${marketType === m.id ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                        <label htmlFor="stockDate" className="text-sm font-medium text-gray-600 ml-2">
                            조회일자
                        </label>
                        <input
                            id="stockDate"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md text-sm font-black transition-all shadow-md active:scale-95"
                        >
                            {loading ? '검색 중...' : '조회'}
                        </button>
                    </div>
                </div>
            </div>

            <section>
                {loading ? (
                    <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">데이터를 불러오는 중입니다</p>
                        </div>
                    </div>
                ) : (
                    <StockTable data={stockData} />
                )}
            </section>
        </div>
    );
}

export default function StocksPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-12 px-4 max-w-6xl animate-pulse">Loading...</div>}>
            <StocksContent />
        </Suspense>
    );
}
