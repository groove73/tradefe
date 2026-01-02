"use client"

import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface EtfTradingInfo {
    basDd: string
    isuCd: string
    isuNm: string
    tddClsprc: string
    cmpprevddPrc: string
    flucRt?: string
    nav?: string // ETF
    per1secuIndicVal?: string // ETN
    ulyNm?: string // ELW
    ulyPrc?: string // ELW
    flucRtUly?: string // ELW
    tddOpnprc: string
    tddHgprc: string
    tddLwprc: string
    accTrdvol: string
    accTrdval: string
    mktcap: string
    invstasstNetasstTotamt?: string
    indicValAmt?: string
    listShrs: string
}

interface EtfTradingInfoTableProps {
    data: EtfTradingInfo[]
    isLoading: boolean
    type: 'ETF' | 'ETN' | 'ELW'
}

export function EtfTradingInfoTable({ data, isLoading, type }: EtfTradingInfoTableProps) {
    const [sortKey, setSortKey] = useState<keyof EtfTradingInfo>('isuNm');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    const formatNumber = (value: string | undefined) => {
        if (value === undefined || value === null || value === '') return '-'
        return new Intl.NumberFormat('ko-KR').format(Number(value.replace(/,/g, '')))
    }

    const getPriceColor = (valStr: string | undefined) => {
        if (!valStr) return "text-gray-900"
        const val = parseFloat(valStr)
        if (val > 0) return "text-red-500"
        if (val < 0) return "text-blue-500"
        return "text-gray-900"
    }

    const handleSort = (key: keyof EtfTradingInfo) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof EtfTradingInfo }) => {
        if (sortKey !== columnKey) return <span className="text-gray-300 ml-1">⇅</span>;
        return <span className="text-indigo-600 ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
    };

    const sortedData = [...data].sort((a, b) => {
        const valA = a[sortKey] || '';
        const valB = b[sortKey] || '';

        const isNumeric = !isNaN(Number(valA.toString().replace(/,/g, ''))) && !isNaN(Number(valB.toString().replace(/,/g, '')));

        if (isNumeric) {
            const numA = Number(valA.toString().replace(/,/g, ''));
            const numB = Number(valB.toString().replace(/,/g, ''));
            return sortOrder === 'asc' ? numA - numB : numB - numA;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const getFlucRt = (item: EtfTradingInfo) => {
        if (item.flucRt) return item.flucRt;
        if (type === 'ELW') {
            const cls = parseFloat(item.tddClsprc.replace(/,/g, ''));
            const diff = parseFloat(item.cmpprevddPrc.replace(/,/g, ''));
            const prev = cls - diff;
            if (prev === 0) return '0.00';
            return ((diff / prev) * 100).toFixed(2);
        }
        return '0.00';
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                조회된 데이터가 없습니다.
            </div>
        )
    }

    const thirdSpecColumn = type === 'ETF' ? 'nav' : type === 'ETN' ? 'per1secuIndicVal' : 'ulyNm';
    const thirdSpecLabel = type === 'ETF' ? 'NAV' : type === 'ETN' ? '지표가치(IV)' : '기초자산';

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('isuNm')}>
                                <div className="flex items-center">종목명 <SortIcon columnKey="isuNm" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('tddClsprc')}>
                                <div className="flex items-center justify-end">종가 <SortIcon columnKey="tddClsprc" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('cmpprevddPrc')}>
                                <div className="flex items-center justify-end">대비 <SortIcon columnKey="cmpprevddPrc" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('flucRt')}>
                                <div className="flex items-center justify-end">등락률(%) <SortIcon columnKey="flucRt" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort(thirdSpecColumn as keyof EtfTradingInfo)}>
                                <div className="flex items-center justify-end">{thirdSpecLabel} <SortIcon columnKey={thirdSpecColumn as keyof EtfTradingInfo} /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('accTrdvol')}>
                                <div className="flex items-center justify-end">거래량 <SortIcon columnKey="accTrdvol" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('mktcap')}>
                                <div className="flex items-center justify-end">시가총액(억) <SortIcon columnKey="mktcap" /></div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item) => {
                            const flucRt = getFlucRt(item);
                            return (
                                <TableRow key={item.isuCd} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-bold">{item.isuNm}</span>
                                            <span className="text-xs text-gray-400 font-mono">{item.isuCd}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold font-mono">{formatNumber(item.tddClsprc)}</TableCell>
                                    <TableCell className={`text-right font-medium font-mono ${getPriceColor(flucRt)}`}>
                                        {item.cmpprevddPrc.startsWith('-') ? '▼' : item.cmpprevddPrc === '0' || item.cmpprevddPrc === '' ? '' : '▲'} {formatNumber(item.cmpprevddPrc.replace('-', ''))}
                                    </TableCell>
                                    <TableCell className={`text-right font-medium font-mono ${getPriceColor(flucRt)}`}>
                                        {flucRt}%
                                    </TableCell>
                                    <TableCell className="text-right text-gray-600 font-mono">
                                        {type === 'ETF' ? formatNumber(item.nav) :
                                            type === 'ETN' ? formatNumber(item.per1secuIndicVal) :
                                                <div className="flex flex-col items-end">
                                                    <span className="text-xs font-bold text-gray-900">{item.ulyNm}</span>
                                                    <span className={`text-[10px] ${getPriceColor(item.flucRtUly)}`}>
                                                        {item.ulyPrc} ({item.flucRtUly}%)
                                                    </span>
                                                </div>
                                        }
                                    </TableCell>
                                    <TableCell className="text-right text-gray-600 font-mono">{formatNumber(item.accTrdvol)}</TableCell>
                                    <TableCell className="text-right text-gray-600 font-mono">{formatNumber(Math.floor(Number(item.mktcap.replace(/,/g, '')) / 100000000).toString())}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 py-4">
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
    )
}
