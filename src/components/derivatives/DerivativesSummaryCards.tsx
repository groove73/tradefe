import { Card } from "@/components/ui/card"
import { TrendingUp, BarChart3, Activity, Layers } from "lucide-react"

interface DerivativesTradingInfo {
    basDd: string
    isuNm: string
    prodNm: string
    tddClsprc: string
    accTrdvol: string
    accTrdval: string
    cmpprevddPrc: string
    accOpnintQty: string
}

interface DerivativesSummaryCardsProps {
    data: DerivativesTradingInfo[]
    marketType: string
}

export function DerivativesSummaryCards({ data, marketType }: DerivativesSummaryCardsProps) {
    const totalVolume = data.reduce((acc, item) => acc + (Number(item.accTrdvol?.replace(/,/g, '')) || 0), 0)
    const totalValue = data.reduce((acc, item) => acc + (Number(item.accTrdval?.replace(/,/g, '')) || 0), 0)
    const totalOpenInterest = data.reduce((acc, item) => acc + (Number(item.accOpnintQty?.replace(/,/g, '')) || 0), 0)

    const topGainer = [...data].sort((a, b) => {
        const valA = parseFloat(a.cmpprevddPrc?.replace(/,/g, '') || '0')
        const valB = parseFloat(b.cmpprevddPrc?.replace(/,/g, '') || '0')
        return valB - valA
    })[0]

    const formatNumber = (num: number) => {
        if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + '조'
        if (num >= 100000000) return (num / 100000000).toFixed(2) + '억'
        if (num >= 10000) return (num / 10000).toFixed(1) + '만'
        return new Intl.NumberFormat('ko-KR').format(num)
    }

    const getMarketLabel = (type: string) => {
        switch (type) {
            case 'FUT_NORMAL': return '선물 (주식외)'
            case 'FUT_STK_KOSPI': return '주식선물 (유가)'
            case 'FUT_STK_KOSDAQ': return '주식선물 (코스닥)'
            case 'OPT_NORMAL': return '옵션 (주식외)'
            case 'OPT_STK_KOSPI': return '주식옵션 (유가)'
            case 'OPT_STK_KOSDAQ': return '주식옵션 (코스닥)'
            default: return '파생상품'
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-none shadow-lg shadow-purple-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">총 거래량</span>
                </div>
                <div className="text-2xl font-black">{formatNumber(totalVolume)}</div>
                <div className="text-[10px] mt-2 opacity-60 font-medium">당일 기준 합계</div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">총 거래대금</span>
                </div>
                <div className="text-2xl font-black text-gray-900">{formatNumber(totalValue)}</div>
                <div className="text-[10px] mt-2 text-gray-400 font-medium">KRW 기준</div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <Layers className="h-5 w-5 text-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">총 미결제약정</span>
                </div>
                <div className="text-2xl font-black text-gray-900">{formatNumber(totalOpenInterest)}</div>
                <div className="text-[10px] mt-2 text-gray-400 font-medium">계약 건수 합계</div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">최대 상승 종목</span>
                </div>
                <div className="text-lg font-bold text-gray-900 truncate">
                    {topGainer?.isuNm || '-'}
                </div>
                <div className="text-sm font-black text-indigo-600 mt-1">
                    {topGainer?.cmpprevddPrc || '0'} p
                </div>
            </Card>
        </div>
    )
}
