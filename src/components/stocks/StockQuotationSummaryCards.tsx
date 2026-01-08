import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BarChart3, List } from "lucide-react"
import { FscStockPrice } from "@/lib/stock-quotation"

interface StockQuotationSummaryCardsProps {
    data: FscStockPrice[]
    totalCount: number
}

export function StockQuotationSummaryCards({ data, totalCount }: StockQuotationSummaryCardsProps) {
    if (!data) return null

    // Helper to parse string numbers
    const parseNum = (str: string) => parseFloat(str?.replace(/,/g, '') || '0')

    // Find Top Gainer and Worst Loser in current page
    const sortedByFluctuation = [...data].sort((a, b) => parseNum(b.fltRt) - parseNum(a.fltRt))
    const topGainer = sortedByFluctuation[0]
    const worstLoser = sortedByFluctuation[sortedByFluctuation.length - 1]

    // Market Trend Counts in current page
    const upCount = data.filter(d => parseNum(d.fltRt) > 0).length
    const downCount = data.filter(d => parseNum(d.fltRt) < 0).length
    const steadyCount = data.filter(d => parseNum(d.fltRt) === 0).length

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg shadow-indigo-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <List className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">전체 종목 수</span>
                </div>
                <div className="text-3xl font-black">
                    {totalCount.toLocaleString()}
                </div>
                <div className="text-[10px] mt-2 opacity-60">FSC 연계 실시간 주식 시세</div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-rose-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-rose-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">상승 종목 (현재페이지)</span>
                </div>
                <div className="text-lg font-black text-gray-900 truncate" title={topGainer?.itmsNm}>
                    {topGainer?.itmsNm || '-'}
                </div>
                <div className="text-2xl font-black text-rose-500 mt-1">
                    {topGainer?.fltRt ? `+${topGainer.fltRt}%` : '0%'}
                </div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <TrendingDown className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">하락 종목 (현재페이지)</span>
                </div>
                <div className="text-lg font-black text-gray-900 truncate" title={worstLoser?.itmsNm}>
                    {worstLoser?.itmsNm || '-'}
                </div>
                <div className="text-2xl font-black text-blue-500 mt-1">
                    {worstLoser?.fltRt ? `${worstLoser.fltRt}%` : '0%'}
                </div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-gray-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">시장 흐름 (현재페이지)</span>
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
