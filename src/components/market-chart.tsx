import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { MarketData } from '@/lib/api';

interface MarketChartProps {
    data: MarketData[];
    title: string;
    color?: string;
}

export function MarketChart({ data, title, color = '#4f46e5' }: MarketChartProps) {
    const [selectedData, setSelectedData] = useState<any>(null);

    const chartData = data.map(item => {
        const fltRt = parseFloat(item.fltRt?.replace(/,/g, '') || '0');
        return {
            ...item,
            fltRt, // Use fluctuation rate for the bar chart height
            price: item.clpr,
            date: item.basDt || 'N/A',
        };
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="w-full h-[500px] p-8 bg-white rounded-3xl shadow-2xl shadow-gray-100/50 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase">
                        {title}
                    </h2>
                    <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Fluctuation Rate (%)
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="80%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="idxNm"
                            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                            unit="%"
                        />
                        <Tooltip
                            cursor={{ fill: '#f9fafb' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload;
                                    const isUp = item.fltRt >= 0;
                                    return (
                                        <div className="bg-white/95 backdrop-blur-xl p-5 border border-indigo-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/5 min-w-[200px]">
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">{item.date}</p>
                                                <div className={`w-2 h-2 rounded-full ${isUp ? 'bg-rose-500' : 'bg-blue-500'}`} />
                                            </div>
                                            <p className="text-base font-black text-gray-900 mb-4 tracking-tight leading-tight">{item.idxNm}</p>
                                            <div className="space-y-2.5">
                                                <div className="flex justify-between items-center bg-gray-50/80 p-2.5 rounded-xl border border-gray-100/50">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Close Price</span>
                                                    <span className="text-sm font-black text-gray-900">{item.price}</span>
                                                </div>
                                                <div className={`flex justify-between items-center p-2.5 rounded-xl border ${isUp ? 'bg-rose-50/50 border-rose-100' : 'bg-blue-50/50 border-blue-100'}`}>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fluctuation</span>
                                                    <span className={`text-sm font-black ${isUp ? 'text-rose-600' : 'text-blue-600'}`}>
                                                        {isUp ? '▲' : '▼'} {Math.abs(item.fltRt)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="fltRt"
                            radius={[4, 4, 0, 0]}
                            onClick={(data: any) => {
                                if (data) setSelectedData(data);
                            }}
                            cursor="pointer"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fltRt >= 0 ? '#f43f5e' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {selectedData && (
                <div className="bg-white overflow-hidden rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-indigo-100/50 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                                    <BarChart3 className="h-6 w-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight uppercase italic italic">Index Insight</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] leading-none">Detailed Metrics</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedData(null)}
                                className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-all hover:rotate-90 backdrop-blur-md border border-white/10"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Category Name', value: selectedData.idxNm, color: 'text-indigo-600', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Closing Price', value: selectedData.price, color: 'text-gray-900', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                            {
                                label: 'Fluctuation Rate',
                                value: `${selectedData.fltRt}% ${selectedData.fltRt >= 0 ? '▲' : '▼'}`,
                                color: selectedData.fltRt >= 0 ? 'text-rose-500' : 'text-blue-500',
                                icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                            },
                            { label: 'Date', value: selectedData.date, color: 'text-gray-500', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' }
                        ].map((stat, i) => (
                            <div key={i} className="group relative bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-white transition-all duration-300">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <p className={`text-xl font-black ${stat.color} tracking-tight`}>{stat.value}</p>
                                    <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
