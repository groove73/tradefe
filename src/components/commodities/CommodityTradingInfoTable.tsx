'use client';

import { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { CommodityTradingInfo } from '@/lib/commodities';

interface CommodityTradingInfoTableProps {
    data: CommodityTradingInfo[];
    marketType: string;
}

type SortConfig = {
    key: keyof CommodityTradingInfo;
    direction: 'asc' | 'desc';
} | null;

export function CommodityTradingInfoTable({ data, marketType }: CommodityTradingInfoTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const itemsPerPage = 15;

    const handleSort = (key: keyof CommodityTradingInfo) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key] || '';
            const bValue = b[sortConfig.key] || '';

            // Handle numeric values
            const aNum = parseFloat(String(aValue).replace(/,/g, ''));
            const bNum = parseFloat(String(bValue).replace(/,/g, ''));

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
            }

            // Fallback to string comparison
            return sortConfig.direction === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }, [data, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatValue = (value: string | undefined) => {
        if (!value || value === '-') return '-';
        const num = parseFloat(value.replace(/,/g, ''));
        if (isNaN(num)) return value;
        return num.toLocaleString();
    };

    const getPriceColor = (change: string | undefined) => {
        if (!change || change === '0' || change === '-') return 'text-gray-600';
        return change.includes('-') ? 'text-blue-600' : 'text-red-600';
    };

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            {marketType === 'OIL' ? (
                                <>
                                    <TableHead className="font-bold cursor-pointer" onClick={() => handleSort('oilNm')}>
                                        <div className="flex items-center gap-1">유종구분 <ArrowUpDown size={14} /></div>
                                    </TableHead>
                                    <TableHead className="font-bold text-right cursor-pointer" onClick={() => handleSort('wtAvgPrc')}>
                                        <div className="flex items-center justify-end gap-1">가중평균가(경쟁) <ArrowUpDown size={14} /></div>
                                    </TableHead>
                                    <TableHead className="font-bold text-right cursor-pointer" onClick={() => handleSort('wtDisAvgPrc')}>
                                        <div className="flex items-center justify-end gap-1">가중평균가(협의) <ArrowUpDown size={14} /></div>
                                    </TableHead>
                                </>
                            ) : (
                                <>
                                    <TableHead className="font-bold cursor-pointer" onClick={() => handleSort('isuNm')}>
                                        <div className="flex items-center gap-1">종목명 <ArrowUpDown size={14} /></div>
                                    </TableHead>
                                    <TableHead className="font-bold text-right cursor-pointer" onClick={() => handleSort('tddClsprc')}>
                                        <div className="flex items-center justify-end gap-1">종가 <ArrowUpDown size={14} /></div>
                                    </TableHead>
                                    <TableHead className="font-bold text-right cursor-pointer" onClick={() => handleSort('cmpprevddPrc')}>
                                        <div className="flex items-center justify-end gap-1">대비 <ArrowUpDown size={14} /></div>
                                    </TableHead>
                                    <TableHead className="font-bold text-right cursor-pointer" onClick={() => handleSort('flucRt')}>
                                        <div className="flex items-center justify-end gap-1">등락률 <ArrowUpDown size={14} /></div>
                                    </TableHead>
                                </>
                            )}
                            <TableHead className="font-bold text-right cursor-pointer" onClick={() => handleSort('accTrdvol')}>
                                <div className="flex items-center justify-end gap-1">거래량 <ArrowUpDown size={14} /></div>
                            </TableHead>
                            <TableHead className="font-bold text-right cursor-pointer" onClick={() => handleSort('accTrdval')}>
                                <div className="flex items-center justify-end gap-1">거래대금 <ArrowUpDown size={14} /></div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item, idx) => (
                                <TableRow key={`${item.isuCd || item.oilNm}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                                    {marketType === 'OIL' ? (
                                        <>
                                            <TableCell className="font-medium text-gray-900">{item.oilNm}</TableCell>
                                            <TableCell className="text-right font-mono">{formatValue(item.wtAvgPrc)}</TableCell>
                                            <TableCell className="text-right font-mono">{formatValue(item.wtDisAvgPrc)}</TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="font-medium text-gray-900">
                                                <div className="flex flex-col">
                                                    <span>{item.isuNm}</span>
                                                    <span className="text-[10px] text-gray-400 font-mono">{item.isuCd}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-bold">{formatValue(item.tddClsprc)}</TableCell>
                                            <TableCell className={`text-right font-mono ${getPriceColor(item.cmpprevddPrc)}`}>
                                                {item.cmpprevddPrc && !item.cmpprevddPrc.includes('-') && item.cmpprevddPrc !== '0' && item.cmpprevddPrc !== '-' ? `+${formatValue(item.cmpprevddPrc)}` : formatValue(item.cmpprevddPrc)}
                                            </TableCell>
                                            <TableCell className={`text-right font-mono ${getPriceColor(item.flucRt)}`}>
                                                {item.flucRt && !item.flucRt.includes('-') && item.flucRt !== '0' && item.flucRt !== '-' ? `+${item.flucRt}%` : `${item.flucRt}%`}
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell className="text-right font-mono text-gray-600">{formatValue(item.accTrdvol)}</TableCell>
                                    <TableCell className="text-right font-mono text-gray-600">{formatValue(item.accTrdval)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={marketType === 'OIL' ? 5 : 6} className="h-32 text-center text-gray-400">
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="rounded-xl border-gray-200"
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = i + 1;
                            if (totalPages > 5 && currentPage > 3) {
                                pageNum = Math.min(currentPage - 2 + i, totalPages - 4 + i);
                            }
                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-10 h-10 rounded-xl font-bold ${currentPage === pageNum ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "border-gray-200 text-gray-600"
                                        }`}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-xl border-gray-200"
                    >
                        <ChevronRight size={18} />
                    </Button>
                </div>
            )}
        </div>
    );
}
