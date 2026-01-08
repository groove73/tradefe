'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = { name: string; href: string };
type NavGroup = { name: string; items: NavItem[] };
type NavConfig = (NavItem | NavGroup)[];

const navItems: NavConfig = [
    { name: '지수', href: '/' },
    { name: '주식', href: '/stocks' },
    {
        name: '금융위원회_주식시세정보',
        items: [
            { name: '주식 시세 상세', href: '/stocks/quotation' },
            { name: '신주인수권증서시세 상세', href: '/stocks/quotation/new-share' },
            { name: '수익증권시세 상세', href: '/stocks/quotation/beneficiary' },
            { name: '신주인수권증권시세', href: '/stocks/quotation/subscription-right' },
        ]
    },
    { name: '증권상품', href: '/products' },
    { name: '채권', href: '/bonds' },
    { name: '파생상품', href: '/derivatives' },
    { name: '일반상품', href: '/commodities' },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">TRADE PRO</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                if ('items' in item) {
                                    const isChildActive = item.items.some(subItem => pathname === subItem.href);
                                    return (
                                        <div key={item.name} className="relative group">
                                            <button
                                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1 ${isChildActive
                                                    ? 'bg-indigo-100 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {item.name}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50 group-hover:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100">
                                                {item.items.map((subItem) => {
                                                    const isActive = pathname === subItem.href;
                                                    return (
                                                        <Link
                                                            key={subItem.href}
                                                            href={subItem.href}
                                                            className={`block px-5 py-2.5 text-sm font-bold transition-colors ${isActive
                                                                ? 'text-indigo-600 bg-indigo-50/50'
                                                                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }

                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
