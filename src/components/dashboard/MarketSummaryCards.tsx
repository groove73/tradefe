import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BarChart3, GripHorizontal } from "lucide-react"
import { MarketData } from "@/lib/api"

interface MarketSummaryCardsProps {
    data: MarketData[]
    title: string
}

export function MarketSummaryCards({ data, title }: MarketSummaryCardsProps) {
    if (!data || data.length === 0) return null

    // Helper to parse string numbers
    const parseNum = (str: string) => parseFloat(str?.replace(/,/g, '') || '0')

    // Find Top Gainer and Worst Loser
    const sortedByFluctuation = [...data].sort((a, b) => parseNum(b.fltRt) - parseNum(a.fltRt))
    const topGainer = sortedByFluctuation[0]
    const worstLoser = sortedByFluctuation[sortedByFluctuation.length - 1]

    // Market Trend Counts
    const upCount = data.filter(d => parseNum(d.fltRt) > 0).length
    const downCount = data.filter(d => parseNum(d.fltRt) < 0).length
    const steadyCount = data.filter(d => parseNum(d.fltRt) === 0).length

    // Average Fluctuation Rate
    const avgFluctuation = data.reduce((acc, curr) => acc + parseNum(curr.fltRt), 0) / data.length

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg shadow-indigo-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">{title} 지수 평균</span>
                </div>
                <div className="text-3xl font-black">
                    {avgFluctuation > 0 ? '+' : ''}{avgFluctuation.toFixed(2)}%
                </div>
                <div className="text-[10px] mt-2 opacity-60">전체 지수 평균 등락률</div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-rose-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-rose-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">최대 상승 지수</span>
                </div>
                <div className="text-lg font-black text-gray-900 truncate" title={topGainer?.idxNm}>
                    {topGainer?.idxNm || '-'}
                </div>
                <div className="text-2xl font-black text-rose-500 mt-1">
                    +{topGainer?.fltRt || '0'}%
                </div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <TrendingDown className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">최대 하락 지수</span>
                </div>
                <div className="text-lg font-black text-gray-900 truncate" title={worstLoser?.idxNm}>
                    {worstLoser?.idxNm || '-'}
                </div>
                <div className="text-2xl font-black text-blue-500 mt-1">
                    {worstLoser?.fltRt || '0'}%
                </div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <GripHorizontal className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">시장 흐름</span>
                </div>
                <div className="flex items-end justify-between mt-2">
                    <div className="text-center">
                        <div className="text-rose-500 font-black text-lg">{upCount}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">상승</div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-500 font-black text-lg">{steadyCount}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">보합</div>
                    </div>
                    <div className="text-center">
                        <div className="text-blue-500 font-black text-lg">{downCount}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">하락</div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
