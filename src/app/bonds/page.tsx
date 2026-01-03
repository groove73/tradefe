"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/DatePicker"
import { BondTradingInfoTable } from "@/components/bonds/BondTradingInfoTable"
import { BondSummaryCards } from "@/components/bonds/BondSummaryCards"

type MarketType = 'TREASURY' | 'GENERAL' | 'SMALL'

export default function BondsPage() {
    const [marketType, setMarketType] = useState<MarketType>('TREASURY')
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/bond/trading-info/${type}?basDd=${formattedDate}`)
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
        handleSearch()
    }, [marketType])

    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl">
            <header className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase italic flex items-center justify-center lg:justify-start gap-4">
                    <span className="text-indigo-600">채권</span> 일별매매정보
                </h1>
                <p className="text-gray-500 font-medium max-w-2xl">
                    국채전문, 일반채권, 소액채권 시장의 일자별 매매 데이터를 조회합니다. 인포그래픽 요약과 상세 거래 내역을 한눈에 파악하세요.
                </p>
            </header>

            <BondSummaryCards data={data} marketType={marketType} />

            <section className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                    <div className="flex flex-col gap-4">
                        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner w-fit">
                            {[
                                { id: 'TREASURY', label: '국채전문' },
                                { id: 'GENERAL', label: '일반채권' },
                                { id: 'SMALL', label: '소액채권' }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMarketType(m.id as MarketType)}
                                    className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${marketType === m.id ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                기준일자 조회
                            </label>
                            <div className="flex items-center gap-3">
                                <DatePicker date={date} setDate={setDate} />
                                <Button
                                    onClick={handleSearch}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-lg shadow-indigo-100"
                                >
                                    조회
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <BondTradingInfoTable data={data} isLoading={isLoading} marketType={marketType} />
            </section>
        </div>
    )
}
