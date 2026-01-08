import { StockData } from '@/lib/api';
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export interface StockTableProps {
    data: StockData[];
    isLoading?: boolean;
}

export function StockTable({ data, isLoading = false }: StockTableProps) {
    const [sortKey, setSortKey] = useState<keyof StockData>('isuNm');
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

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('isuNm')}>
                                <div className="flex items-center">종목명 <SortIcon columnKey="isuNm" /></div>
                            </TableHead>
                            <TableHead className="font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('isuCd')}>
                                <div className="flex items-center">종목코드 <SortIcon columnKey="isuCd" /></div>
                            </TableHead>
                            <TableHead className="font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('mktNm')}>
                                <div className="flex items-center">시장 <SortIcon columnKey="mktNm" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('tddClsprc')}>
                                <div className="flex items-center justify-end">종가 <SortIcon columnKey="tddClsprc" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('flucRt')}>
                                <div className="flex items-center justify-end">등락률 <SortIcon columnKey="flucRt" /></div>
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
                        {paginatedData.map((stock, i) => (
                            <TableRow key={`${stock.isuCd}-${i}`} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-bold">{stock.isuNm}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stock.sectTpNm}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono text-xs text-gray-500 font-bold">
                                    {stock.isuCd}
                                </TableCell>
                                <TableCell>
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-full ${stock.mktNm === 'KOSPI' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {stock.mktNm}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-black font-mono text-gray-900">
                                    {formatNumber(stock.tddClsprc)}
                                </TableCell>
                                <TableCell className={`text-right font-bold font-mono ${getPriceColor(stock.flucRt)}`}>
                                    <div className="flex items-center justify-end gap-1">
                                        {Number(stock.flucRt) > 0 ? '▲' : Number(stock.flucRt) < 0 ? '▼' : ''} {Math.abs(Number(stock.flucRt))}%
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-gray-400 font-bold font-mono text-xs">
                                    {formatNumber(stock.accTrdvol)}
                                </TableCell>
                                <TableCell className="text-right text-gray-600 font-bold font-mono text-xs">
                                    {formatNumber(Math.floor(Number(stock.mktcap.replace(/,/g, '')) / 100000000).toString())}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="font-bold text-gray-400 hover:text-indigo-600"
                    >
                        이전
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages)
                            .map((page, i, arr) => (
                                <div key={page} className="flex items-center">
                                    {i > 0 && arr[i - 1] !== page - 1 && (
                                        <span className="px-2 text-gray-400">...</span>
                                    )}
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 p-0 font-bold ${currentPage === page ? 'bg-indigo-600' : 'text-gray-400'}`}
                                    >
                                        {page}
                                    </Button>
                                </div>
                            ))}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="font-bold text-gray-400 hover:text-indigo-600"
                    >
                        다음
                    </Button>
                </div>
            )}
        </div>
    );
}
