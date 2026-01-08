'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FscStockPrice } from '@/lib/stock-quotation';

interface StockQuotationTableProps {
    data: FscStockPrice[];
    totalCount: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function StockQuotationTable({
    data,
    totalCount,
    currentPage,
    itemsPerPage,
    onPageChange
}: StockQuotationTableProps) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);

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
                            <TableHead className="font-bold">종목명</TableHead>
                            <TableHead className="font-bold">시장구분</TableHead>
                            <TableHead className="font-bold text-right">종가</TableHead>
                            <TableHead className="font-bold text-right">대비</TableHead>
                            <TableHead className="font-bold text-right">등락률</TableHead>
                            <TableHead className="font-bold text-right">거래량</TableHead>
                            <TableHead className="font-bold text-right">거래대금</TableHead>
                            <TableHead className="font-bold text-right">시가총액</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, idx) => (
                                <TableRow key={`${item.srtCd}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="font-medium text-gray-900">
                                        <div className="flex flex-col">
                                            <span>{item.itmsNm}</span>
                                            <span className="text-[10px] text-gray-400 font-mono">{item.srtCd}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600 font-medium">{item.mrktCtg}</TableCell>
                                    <TableCell className="text-right font-mono font-bold">{formatValue(item.clpr)}</TableCell>
                                    <TableCell className={`text-right font-mono ${getPriceColor(item.vs)}`}>
                                        {item.vs && !item.vs.includes('-') && item.vs !== '0' && item.vs !== '-' ? `+${formatValue(item.vs)}` : formatValue(item.vs)}
                                    </TableCell>
                                    <TableCell className={`text-right font-mono ${getPriceColor(item.fltRt)}`}>
                                        {item.fltRt && !item.fltRt.includes('-') && item.fltRt !== '0' && item.fltRt !== '-' ? `+${item.fltRt}%` : `${item.fltRt}%`}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-gray-600">{formatValue(item.trqu)}</TableCell>
                                    <TableCell className="text-right font-mono text-gray-600">{formatValue(item.trPrc)}</TableCell>
                                    <TableCell className="text-right font-mono text-gray-600">{formatValue(item.mrktTotAmt)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-32 text-center text-gray-400">
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
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
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
                                    onClick={() => onPageChange(pageNum)}
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
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
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
