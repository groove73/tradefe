'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { format, subDays, startOfToday } from 'date-fns';
import { fetchCommodityTradingInfo, CommodityTradingInfo } from '@/lib/commodities';
import { CommoditySummaryCards } from '@/components/commodities/CommoditySummaryCards';
import { CommodityTradingInfoTable } from '@/components/commodities/CommodityTradingInfoTable';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Search, Package, Droplets, Coins, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

const marketTypes = [
    { id: 'GOLD', name: '금시장', icon: Coins, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'OIL', name: '석유시장', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'ETS', name: '배출권시장', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export default function CommoditiesPage() {
    const [marketType, setMarketType] = useQueryState('market', parseAsString.withDefault('GOLD'));
    const [date, setDate] = useState<Date>(subDays(startOfToday(), 1));
    const [data, setData] = useState<CommodityTradingInfo[]>([]);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const formattedDate = format(date, 'yyyyMMdd');
            const result = await fetchCommodityTradingInfo(marketType, formattedDate);
            setData(result);
        } catch (error) {
            console.error('Failed to load commodities data:', error);
        } finally {
            setLoading(false);
        }
    }, [marketType, date]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="container mx-auto py-12 px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <span className="text-indigo-600 uppercase italic">일반상품</span> Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium italic">석유, 금, 배출권 시장 일별매매데이터</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex bg-gray-50 p-1 rounded-xl mr-2">
                        {marketTypes.map((type) => {
                            const Icon = type.icon;
                            const isActive = marketType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setMarketType(type.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                        isActive
                                            ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-200"
                                            : "text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    <Icon size={16} className={cn(isActive ? type.color : "text-gray-400")} />
                                    {type.name}
                                </button>
                            );
                        })}
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "justify-start text-left font-bold rounded-xl border-gray-200 h-10 px-4",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                                {date ? format(date, 'yyyy-MM-dd') : <span>날짜 선택</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => newDate && setDate(newDate)}
                                disabled={(date) => date > startOfToday()}
                                initialFocus
                                className="p-3"
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                        onClick={loadData}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 h-10 shadow-md shadow-indigo-100 transition-all hover:scale-105"
                    >
                        <Search size={18} className="mr-2" />
                        조회
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-8 animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-100 rounded-[1.5rem]" />
                        ))}
                    </div>
                    <div className="h-96 bg-gray-100 rounded-[1.5rem]" />
                </div>
            ) : (
                <>
                    <CommoditySummaryCards data={data} marketType={marketType} />
                    <CommodityTradingInfoTable data={data} marketType={marketType} />
                </>
            )}
        </div>
    );
}
