import { Card } from "@/components/ui/card"
import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react"

interface BondTradingInfo {
    basDd: string
    isuNm: string
    clsprc: string
    accTrdvol: string
    accTrdval: string
    cmpprevddPrc: string
}

interface BondSummaryCardsProps {
    data: BondTradingInfo[]
    marketType: string
}

export function BondSummaryCards({ data, marketType }: BondSummaryCardsProps) {
    const totalVolume = data.reduce((acc, item) => acc + (Number(item.accTrdvol?.replace(/,/g, '')) || 0), 0)
    const totalValue = data.reduce((acc, item) => acc + (Number(item.accTrdval?.replace(/,/g, '')) || 0), 0)
    const topGainer = [...data].sort((a, b) => {
        const valA = parseFloat(a.cmpprevddPrc?.replace(/,/g, '') || '0')
        const valB = parseFloat(b.cmpprevddPrc?.replace(/,/g, '') || '0')
        return valB - valA
    })[0]

    const formatNumber = (num: number) => {
        if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + '조'
        if (num >= 100000000) return (num / 100000000).toFixed(2) + '억'
        return new Intl.NumberFormat('ko-KR').format(num)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-lg shadow-indigo-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">총 거래량</span>
                </div>
                <div className="text-2xl font-black">{formatNumber(totalVolume)}</div>
                <div className="text-[10px] mt-2 opacity-60">당일 기준 합계</div>
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
                        <BarChart3 className="h-5 w-5 text-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">최대 상승 종목</span>
                </div>
                <div className="text-lg font-bold text-gray-900 truncate">
                    {topGainer?.isuNm || '-'}
                </div>
                <div className="text-sm font-black text-amber-500 mt-1">
                    +{topGainer?.cmpprevddPrc || '0'}
                </div>
            </Card>

            <Card className="p-6 bg-white border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <PieChart className="h-5 w-5 text-indigo-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">시장 구분</span>
                </div>
                <div className="text-xl font-black text-gray-900">
                    {marketType === 'TREASURY' ? '국채전문' : marketType === 'GENERAL' ? '일반채권' : '소액채권'}
                </div>
                <div className="text-[10px] mt-2 text-gray-400 font-medium">{data.length}개 종목 활성</div>
            </Card>
        </div>
    )
}
