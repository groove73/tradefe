'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: '지수', href: '/' },
    { name: '주식', href: '/stocks' },
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
