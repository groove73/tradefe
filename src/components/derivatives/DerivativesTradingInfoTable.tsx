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

interface DerivativesTradingInfo {
    basDd: string
    prodNm: string
    mktNm: string
    isuCd: string
    isuNm: string
    tddClsprc: string
    cmpprevddPrc: string
    tddOpnprc: string
    tddHgprc: string
    tddLwprc: string
    accTrdvol: string
    accTrdval: string
    accOpnintQty: string
    spotPrc?: string
    setlPrc?: string
    rghtTpNm?: string
    impVolt?: string
}

interface DerivativesTradingInfoTableProps {
    data: DerivativesTradingInfo[]
    isLoading: boolean
    marketType: string
}

export function DerivativesTradingInfoTable({ data, isLoading, marketType }: DerivativesTradingInfoTableProps) {
    const [sortKey, setSortKey] = useState<keyof DerivativesTradingInfo>('isuNm');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    const formatNumber = (value: string | undefined) => {
        if (value === undefined || value === null || value === '' || value === '-') return '-'
        return new Intl.NumberFormat('ko-KR').format(Number(value.replace(/,/g, '')))
    }

    const getPriceColor = (valStr: string | undefined) => {
        if (!valStr || valStr === '-') return "text-gray-900"
        const val = parseFloat(valStr)
        if (val > 0) return "text-red-500"
        if (val < 0) return "text-blue-500"
        return "text-gray-900"
    }

    const handleSort = (key: keyof DerivativesTradingInfo) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof DerivativesTradingInfo }) => {
        if (sortKey !== columnKey) return <span className="text-gray-300 ml-1">⇅</span>;
        return <span className="text-indigo-600 ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
    };

    const sortedData = [...data].sort((a, b) => {
        const valA = a[sortKey] || '';
        const valB = b[sortKey] || '';

        const isNumeric = !isNaN(Number(valA.toString().replace(/,/g, '').replace('-', '0'))) &&
            !isNaN(Number(valB.toString().replace(/,/g, '').replace('-', '0')));

        if (isNumeric) {
            const numA = Number(valA.toString().replace(/,/g, '').replace('-', '0'));
            const numB = Number(valB.toString().replace(/,/g, '').replace('-', '0'));
            return sortOrder === 'asc' ? numA - numB : numB - numA;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    const isOption = marketType.startsWith('OPT');

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
            <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('isuNm')}>
                                <div className="flex items-center">종목명 <SortIcon columnKey="isuNm" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('tddClsprc')}>
                                <div className="flex items-center justify-end">종가 <SortIcon columnKey="tddClsprc" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('cmpprevddPrc')}>
                                <div className="flex items-center justify-end">대비 <SortIcon columnKey="cmpprevddPrc" /></div>
                            </TableHead>
                            {!isOption && (
                                <TableHead className="text-right font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('spotPrc')}>
                                    <div className="flex items-center justify-end">현물가 <SortIcon columnKey="spotPrc" /></div>
                                </TableHead>
                            )}
                            {isOption && (
                                <TableHead className="text-right font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('impVolt')}>
                                    <div className="flex items-center justify-end">내재변동성 <SortIcon columnKey="impVolt" /></div>
                                </TableHead>
                            )}
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('accTrdvol')}>
                                <div className="flex items-center justify-end">거래량 <SortIcon columnKey="accTrdvol" /></div>
                            </TableHead>
                            <TableHead className="text-right font-bold text-gray-900 cursor-pointer whitespace-nowrap" onClick={() => handleSort('accOpnintQty')}>
                                <div className="flex items-center justify-end">미결제약정 <SortIcon columnKey="accOpnintQty" /></div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map((item) => (
                            <TableRow key={`${item.isuCd}-${item.isuNm}`} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            {isOption && item.rghtTpNm && (
                                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded italic ${item.rghtTpNm === 'CALL' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                    {item.rghtTpNm}
                                                </span>
                                            )}
                                            <span className="text-gray-900 font-bold leading-tight truncate max-w-[200px]">{item.isuNm}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-400 font-mono px-1.5 py-0.5 bg-gray-50 rounded border border-gray-100">{item.isuCd}</span>
                                            <span className="text-[10px] text-gray-400">{item.mktNm}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-black font-mono text-gray-900">{formatNumber(item.tddClsprc)}</TableCell>
                                <TableCell className={`text-right font-bold font-mono ${getPriceColor(item.cmpprevddPrc)}`}>
                                    {item.cmpprevddPrc?.startsWith('-') ? '▼' : (item.cmpprevddPrc === '0' || item.cmpprevddPrc === '-') ? '' : '▲'} {formatNumber(item.cmpprevddPrc?.replace('-', ''))}
                                </TableCell>
                                {!isOption && (
                                    <TableCell className="text-right font-bold font-mono text-gray-400">{formatNumber(item.spotPrc)}</TableCell>
                                )}
                                {isOption && (
                                    <TableCell className="text-right font-bold font-mono text-amber-600">{item.impVolt || '-'}</TableCell>
                                )}
                                <TableCell className="text-right text-gray-600 font-bold font-mono text-xs">{formatNumber(item.accTrdvol)}</TableCell>
                                <TableCell className="text-right text-gray-400 font-bold font-mono text-xs">{formatNumber(item.accOpnintQty)}</TableCell>
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
                    <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] no-scrollbar">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 p-0 font-bold flex-shrink-0 ${currentPage === page ? 'bg-indigo-600' : 'text-gray-400'}`}
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
