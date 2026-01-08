'use client';

import { useState, useEffect } from 'react';
import { fetchStockData, StockData } from '@/lib/api';
import { StockTable } from '@/components/StockTable';
import { StockSummaryCards } from '@/components/stocks/StockSummaryCards';
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

    // Initial data load effect
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
        // Automatically fetch data when market changes if we have a valid date
        if (date && date.length === 10) {
            loadData(date, type);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl">
            <header className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase italic flex items-center justify-center lg:justify-start gap-4">
                    <span className="text-indigo-600">주식</span> 일별매매정보
                </h1>
                <p className="text-gray-500 font-medium max-w-2xl">
                    KOSPI, KOSDAQ, KONEX 시장의 일자별 매매 데이터를 조회합니다. 등락률 상위 종목과 상세 거래 내역을 확인하세요.
                </p>
            </header>

            <StockSummaryCards data={stockData} marketType={marketType} />

            <section className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                    <div className="flex flex-col gap-4">
                        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner w-fit">
                            {[
                                { id: 'KOSPI', label: 'KOSPI' },
                                { id: 'KOSDAQ', label: 'KOSDAQ' },
                                { id: 'KONEX', label: 'KONEX' }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => handleMarketChange(m.id)}
                                    className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${marketType === m.id ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                기준일자 조회
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="date"
                                    value={date || ''}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono shadow-sm"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-md shadow-lg shadow-indigo-100 transition-all active:scale-95 text-sm"
                                >
                                    조회
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <StockTable data={stockData} isLoading={loading} />
            </section>
        </div>
    );
}

export default function StocksPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-12 px-4 max-w-7xl animate-pulse">Loading...</div>}>
            <StocksContent />
        </Suspense>
    );
}
