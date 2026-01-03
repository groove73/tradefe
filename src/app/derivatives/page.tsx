"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/DatePicker"
import { DerivativesTradingInfoTable } from "@/components/derivatives/DerivativesTradingInfoTable"
import { DerivativesSummaryCards } from "@/components/derivatives/DerivativesSummaryCards"

type MarketGroup = 'FUT' | 'OPT'
type MarketType = 'FUT_NORMAL' | 'FUT_STK_KOSPI' | 'FUT_STK_KOSDAQ' | 'OPT_NORMAL' | 'OPT_STK_KOSPI' | 'OPT_STK_KOSDAQ'

export default function DerivativesPage() {
    const [marketGroup, setMarketGroup] = useState<MarketGroup>('FUT')
    const [marketType, setMarketType] = useState<MarketType>('FUT_NORMAL')
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = () => {
        if (date) {
            fetchData(date, marketType)
        }
    }

    const fetchData = async (selectedDate: Date, type: MarketType) => {
        setIsLoading(true)
        try {
            const formattedDate = format(selectedDate, "yyyyMMdd")
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/derivatives/trading-info/${type}?basDd=${formattedDate}`)
            const result = await response.json()
            setData(result)
        } catch (error) {
            console.error(`Failed to fetch ${type} data:`, error)
            setData([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Reset market sub-type when switching group
        if (marketGroup === 'FUT' && !marketType.startsWith('FUT')) {
            setMarketType('FUT_NORMAL')
        } else if (marketGroup === 'OPT' && !marketType.startsWith('OPT')) {
            setMarketType('OPT_NORMAL')
        }
    }, [marketGroup])

    useEffect(() => {
        handleSearch()
    }, [marketType])

    const subMarkets = {
        FUT: [
            { id: 'FUT_NORMAL', label: '주식선물 외' },
            { id: 'FUT_STK_KOSPI', label: '주식선물 (유가)' },
            { id: 'FUT_STK_KOSDAQ', label: '주식선물 (코스닥)' }
        ],
        OPT: [
            { id: 'OPT_NORMAL', label: '주식옵션 외' },
            { id: 'OPT_STK_KOSPI', label: '주식옵션 (유가)' },
            { id: 'OPT_STK_KOSDAQ', label: '주식옵션 (코스닥)' }
        ]
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl">
            <header className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase italic flex items-center justify-center lg:justify-start gap-4">
                    <span className="text-indigo-600">파생상품</span> 일별매매정보
                </h1>
                <p className="text-gray-500 font-medium max-w-2xl">
                    선물 및 옵션 시장의 정규/야간 매매 데이터를 조회합니다. 미결제약정, 거래량 등 주요 지표를 시각화하여 제공합니다.
                </p>
            </header>

            <DerivativesSummaryCards data={data} marketType={marketType} />

            <section className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-gray-100 p-8">
                <div className="flex flex-col gap-8 mb-8 bg-gray-50/50 p-8 rounded-2xl border border-gray-100/50">
                    <div className="flex flex-col gap-6">
                        {/* Group Selection */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest w-16">구분</span>
                            <div className="flex bg-gray-200/50 p-1 rounded-xl border border-gray-200">
                                <button
                                    onClick={() => setMarketGroup('FUT')}
                                    className={`px-8 py-2 rounded-lg text-xs font-black transition-all ${marketGroup === 'FUT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    선물 (Futures)
                                </button>
                                <button
                                    onClick={() => setMarketGroup('OPT')}
                                    className={`px-8 py-2 rounded-lg text-xs font-black transition-all ${marketGroup === 'OPT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    옵션 (Options)
                                </button>
                            </div>
                        </div>

                        {/* Sub Market Selection */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest w-16">세부 시장</span>
                            <div className="flex flex-wrap gap-2">
                                {subMarkets[marketGroup].map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setMarketType(m.id as MarketType)}
                                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all border ${marketType === m.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-200'}`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-200/50">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest w-16">조회일자</span>
                            <div className="flex items-center gap-3">
                                <DatePicker date={date} setDate={setDate} />
                                <Button
                                    onClick={handleSearch}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 shadow-lg shadow-indigo-100"
                                >
                                    데이터 조회
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <DerivativesTradingInfoTable data={data} isLoading={isLoading} marketType={marketType} />
            </section>
        </div>
    )
}
