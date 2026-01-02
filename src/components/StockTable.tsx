'use client';

import { StockData } from '@/lib/api';
import { useState } from 'react';

type StockTableProps = {
    data: StockData[];
};

export function StockTable({ data }: StockTableProps) {
    const [sortKey, setSortKey] = useState<keyof StockData>('isuNm');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const sortedData = [...data].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        const isNumeric = !isNaN(Number(valA.replace(/,/g, ''))) && !isNaN(Number(valB.replace(/,/g, '')));

        if (isNumeric) {
            const numA = Number(valA.replace(/,/g, ''));
            const numB = Number(valB.replace(/,/g, ''));
            return sortOrder === 'asc' ? numA - numB : numB - numA;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (key: keyof StockData) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof StockData }) => {
        if (sortKey !== columnKey) return <span className="text-gray-300 ml-1">⇅</span>;
        return <span className="text-indigo-600 ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="w-full bg-white rounded-[2rem] shadow-2xl border border-indigo-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 border-b border-gray-800">
                                {[
                                    { label: '종목명', key: 'isuNm' },
                                    { label: '종목코드', key: 'isuCd' },
                                    { label: '시장', key: 'mktNm' },
                                    { label: '종가', key: 'tddClsprc' },
                                    { label: '등락률', key: 'flucRt' },
                                    { label: '거래량', key: 'accTrdvol' },
                                    { label: '시가총액', key: 'mktcap' },
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-colors"
                                        onClick={() => handleSort(col.key as keyof StockData)}
                                    >
                                        <div className="flex items-center">
                                            {col.label}
                                            <SortIcon columnKey={col.key as keyof StockData} />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedData.map((stock, i) => (
                                <tr key={`${stock.isuCd}-${i}`} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{stock.isuNm}</span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stock.sectTpNm}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded text-gray-600">{stock.isuCd}</code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${stock.mktNm === 'KOSPI' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {stock.mktNm}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-gray-900 font-mono">
                                            {Number(stock.tddClsprc).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-sm font-black flex items-center gap-1 ${Number(stock.flucRt) > 0 ? 'text-rose-600' : Number(stock.flucRt) < 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {Number(stock.flucRt) > 0 ? '▲' : Number(stock.flucRt) < 0 ? '▼' : ''}
                                            {Math.abs(Number(stock.flucRt))}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-500 font-mono">
                                            {Number(stock.accTrdvol).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-gray-900">
                                            {Math.round(Number(stock.mktcap) / 100000000).toLocaleString()}억
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {data.length === 0 && (
                    <div className="p-20 text-center bg-gray-50/50">
                        <p className="text-gray-400 font-bold uppercase tracking-widest">데이터가 없습니다.</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pb-10">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
                            .map((page, i, arr) => (
                                <div key={page} className="flex items-center">
                                    {i > 0 && arr[i - 1] !== page - 1 && (
                                        <span className="px-2 text-gray-400">...</span>
                                    )}
                                    <button
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === page
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110'
                                            : 'bg-white border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 shadow-sm'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-500 disabled:hover:border-gray-200 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
