'use client';

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity, DollarSign, Award } from "lucide-react";
import { CommodityTradingInfo } from "@/lib/commodities";

interface CommoditySummaryCardsProps {
    data: CommodityTradingInfo[];
    marketType: string;
}

export function CommoditySummaryCards({ data, marketType }: CommoditySummaryCardsProps) {
    if (!data || data.length === 0) return null;

    const totalVolume = data.reduce((sum, item) => sum + (parseInt(item.accTrdvol.replace(/,/g, '')) || 0), 0);
    const totalValue = data.reduce((sum, item) => sum + (parseInt(item.accTrdval.replace(/,/g, '')) || 0), 0);

    const getTopGainer = () => {
        if (marketType === 'OIL') {
            return [...data].sort((a, b) => {
                const aVal = parseFloat(a.cmpprevddPrc?.replace(/,/g, '') || '0');
                const bVal = parseFloat(b.cmpprevddPrc?.replace(/,/g, '') || '0');
                return bVal - aVal;
            })[0];
        } else {
            return [...data].sort((a, b) => {
                const aVal = parseFloat(a.flucRt?.replace(/,/g, '') || '0');
                const bVal = parseFloat(b.flucRt?.replace(/,/g, '') || '0');
                return bVal - aVal;
            })[0];
        }
    };

    const topGainer = getTopGainer();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Activity size={48} />
                    </div>
                    <p className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-1">총 거래량</p>
                    <h3 className="text-3xl font-black">{totalVolume.toLocaleString()}</h3>
                    <p className="text-indigo-200 text-xs mt-2 font-medium">거래일자 기준 합계</p>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <DollarSign size={48} />
                    </div>
                    <p className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-1">총 거래대금</p>
                    <h3 className="text-3xl font-black">{totalValue.toLocaleString()}</h3>
                    <p className="text-emerald-200 text-xs mt-2 font-medium">단위: 원</p>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg bg-white border border-gray-100">
                <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 p-4 text-amber-500/20">
                        <Award size={48} />
                    </div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">최고 상승 종목</p>
                    <h3 className="text-2xl font-black text-gray-900 truncate">
                        {marketType === 'OIL' ? topGainer?.oilNm : topGainer?.isuNm}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-emerald-600 font-bold">
                            {marketType === 'OIL'
                                ? `+${parseFloat(topGainer?.cmpprevddPrc?.replace(/,/g, '') || '0').toLocaleString()}`
                                : `+${topGainer?.flucRt}%`}
                        </span>
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-lg bg-gray-900 text-white">
                <CardContent className="p-6 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <Activity size={40} />
                    </div>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">총 상장 종목</p>
                    <h3 className="text-3xl font-black">{data.length}</h3>
                    <p className="text-gray-500 text-xs mt-2 font-medium">실시간 유효 데이터 수</p>
                </CardContent>
            </Card>
        </div>
    );
}
