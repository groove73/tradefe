"use client"

import { useState, useEffect } from "react"
import { format, subDays } from "date-fns"
import { DatePicker } from "@/components/ui/DatePicker"
import { Button } from "@/components/ui/button"
import { EtfTradingInfoTable } from "@/components/products/EtfTradingInfoTable"
import { ProductSummaryCards } from "@/components/products/ProductSummaryCards"

export default function ProductsPage() {
    const [productType, setProductType] = useState<'ETF' | 'ETN' | 'ELW'>('ETF')
    const [date, setDate] = useState<Date | undefined>(subDays(new Date(), 1))
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = () => {
        if (date) {
            fetchData(date, productType)
        }
    }

    const fetchData = async (selectedDate: Date, type: 'ETF' | 'ETN' | 'ELW') => {
        setIsLoading(true)
        try {
            const formattedDate = format(selectedDate, "yyyyMMdd")
            const endpoint = type.toLowerCase()
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/${endpoint}/trading-info?basDd=${formattedDate}`)
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
    }, [productType])

    return (
        <div className="container mx-auto py-12 px-4 max-w-7xl">
            <header className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase italic flex items-center justify-center lg:justify-start gap-4">
                    <span className="text-indigo-600">{productType}</span> 일별매매정보
                </h1>
                <p className="text-gray-500 font-medium max-w-2xl">
                    {productType === 'ELW' ? '주식워런트증권(ELW)' : `상장지수상품(${productType})`}의 일자별 매매 데이터를 조회합니다. 기준일자를 선택하여 상세 거래 내역을 확인하세요.
                </p>
            </header>

            <ProductSummaryCards data={data} productType={productType} />

            <section className="bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-gray-100 p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                    <div className="flex flex-col gap-4">
                        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner w-fit">
                            {[
                                { id: 'ETF', label: 'ETF' },
                                { id: 'ETN', label: 'ETN' },
                                { id: 'ELW', label: 'ELW' }
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setProductType(p.id as 'ETF' | 'ETN' | 'ELW')}
                                    className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${productType === p.id ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {p.label}
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

                <EtfTradingInfoTable data={data} isLoading={isLoading} type={productType} />
            </section>
        </div>
    )
}
