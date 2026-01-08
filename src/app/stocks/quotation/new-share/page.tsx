'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import { format, subDays, startOfToday } from 'date-fns';
import { fetchNewShareQuotation, FscNewShareCertificate } from '@/lib/stock-quotation';
import { NewShareCertificateTable } from '@/components/stocks/NewShareCertificateTable';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

function NewShareCertificateContent() {
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [dateStr, setDateStr] = useQueryState('date', parseAsString.withDefault(format(subDays(startOfToday(), 1), 'yyyyMMdd')));
    const [searchTerm, setSearchTerm] = useQueryState('search', parseAsString.withDefault(''));
    const [matchType, setMatchType] = useQueryState('match', parseAsString.withDefault('exact'));

    // Convert dateStr to Date object for the calendar
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));
        return new Date(year, month, day);
    });

    const [data, setData] = useState<FscNewShareCertificate[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 15;

    const loadData = useCallback(async (targetPage: number, targetDate: string, search: string, match: string) => {
        setLoading(true);
        try {
            const itmsNm = match === 'exact' ? search : undefined;
            const likeItmsNm = match === 'partial' ? search : undefined;
            const result = await fetchNewShareQuotation(targetDate, targetPage, itemsPerPage, itmsNm, likeItmsNm);
            setData(result.items);
            setTotalCount(result.totalCount);
        } catch (error) {
            console.error('Failed to load new share certificate data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData(page, dateStr, searchTerm, matchType);
    }, [page, dateStr, searchTerm, matchType, loadData]);

    const handleSearch = () => {
        const newDateStr = format(selectedDate, 'yyyyMMdd');
        setDateStr(newDateStr);
        setPage(1);
        loadData(1, newDateStr, searchTerm, matchType);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        loadData(newPage, dateStr, searchTerm, matchType);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <span className="text-rose-600 uppercase italic">신주인수권증서</span> Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium italic">KRX 에 상장된 신주인수권증서시세 상세 정보</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 px-3 border-r border-gray-100">
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            <button
                                onClick={() => setMatchType('exact')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                    matchType === 'exact' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                                )}
                            >
                                정확히 일치
                            </button>
                            <button
                                onClick={() => setMatchType('partial')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                    matchType === 'partial' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                                )}
                            >
                                포함
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="종목명 입력"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-3 pr-8 py-2 text-sm font-bold bg-transparent border-none focus:ring-0 placeholder:text-gray-300 w-40"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                                >
                                    <span className="text-xs">✕</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "justify-start text-left font-bold rounded-xl border-gray-200 h-10 px-4 w-[160px]",
                                    !selectedDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-rose-500" />
                                {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : <span>날짜 선택</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none" align="end">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                disabled={(date) => date > startOfToday()}
                                initialFocus
                                className="p-3"
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                        onClick={handleSearch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 h-10 shadow-md shadow-indigo-100 transition-all hover:scale-105"
                    >
                        <Search size={18} className="mr-2" />
                        조회
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-8 animate-pulse">
                    <div className="h-96 bg-gray-100 rounded-[1.5rem]" />
                </div>
            ) : (
                <NewShareCertificateTable
                    data={data}
                    totalCount={totalCount}
                    currentPage={page}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}

export default function NewShareCertificatePage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-12 px-4 max-w-7xl animate-pulse text-gray-400 font-bold">데이터를 불러오는 중...</div>}>
            <NewShareCertificateContent />
        </Suspense>
    );
}
