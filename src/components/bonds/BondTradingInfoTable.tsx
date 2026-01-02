import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface BondTradingInfo {
    basDd: string
    mktNm: string
    isuCd: string
    isuNm: string
    clsprc: string
    cmpprevddPrc: string
    clsprcYd: string
    opnprc: string
    opnprcYd: string
    accTrdvol: string
    accTrdval: string
    bndExpTpNm?: string
    govbndIsuTpNm?: string
}

interface BondTradingInfoTableProps {
    data: BondTradingInfo[]
    isLoading: boolean
    marketType: string
}

export function BondTradingInfoTable({ data, isLoading, marketType }: BondTradingInfoTableProps) {
    const [sortKey, setSortKey] = useState<keyof BondTradingInfo>('isuNm');
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

    const handleSort = (key: keyof BondTradingInfo) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof BondTradingInfo }) => {
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
                            {marketType === 'TREASURY' && (
                                <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('bndExpTpNm')}>
                                    <div className="flex items-center justify-end">만기년수 <SortIcon columnKey="bndExpTpNm" /></div>
                                </TableHead>
                            )}
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('clsprc')}>
                                <div className="flex items-center justify-end">종가 <SortIcon columnKey="clsprc" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('cmpprevddPrc')}>
                                <div className="flex items-center justify-end">대비 <SortIcon columnKey="cmpprevddPrc" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('clsprcYd')}>
                                <div className="flex items-center justify-end">수익률(%) <SortIcon columnKey="clsprcYd" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('accTrdvol')}>
                                <div className="flex items-center justify-end">거래량 <SortIcon columnKey="accTrdvol" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer" onClick={() => handleSort('accTrdval')}>
                                <div className="flex items-center justify-end">거래대금 <SortIcon columnKey="accTrdval" /></div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item) => (
                            <TableRow key={item.isuCd} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-bold leading-tight">{item.isuNm}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-400 font-mono px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{item.isuCd}</span>
                                            {item.govbndIsuTpNm && <span className="text-[10px] text-indigo-600 font-black bg-indigo-50 px-1.5 py-0.5 rounded italic">{item.govbndIsuTpNm}</span>}
                                        </div>
                                    </div>
                                </TableCell>
                                {marketType === 'TREASURY' && (
                                    <TableCell className="text-right font-bold text-gray-400">{item.bndExpTpNm}년</TableCell>
                                )}
                                <TableCell className="text-right font-black font-mono text-gray-900">{formatNumber(item.clsprc)}</TableCell>
                                <TableCell className={`text-right font-bold font-mono ${getPriceColor(item.cmpprevddPrc)}`}>
                                    {item.cmpprevddPrc.startsWith('-') ? '▼' : item.cmpprevddPrc === '0' ? '' : '▲'} {formatNumber(item.cmpprevddPrc.replace('-', ''))}
                                </TableCell>
                                <TableCell className={`text-right font-black font-mono ${getPriceColor(item.cmpprevddPrc)}`}>
                                    {item.clsprcYd}%
                                </TableCell>
                                <TableCell className="text-right text-gray-400 font-bold font-mono text-xs">{formatNumber(item.accTrdvol)}</TableCell>
                                <TableCell className="text-right text-gray-600 font-bold font-mono text-xs">{formatNumber(item.accTrdval)}</TableCell>
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 p-0 font-bold ${currentPage === page ? 'bg-indigo-600' : 'text-gray-400'}`}
                            >
                                {page}
                            </Button>
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
    )
}
