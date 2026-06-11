import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { DemoDataControls } from '@/components/DemoDataControls';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkinLoop',
  description: 'Evidence-based skincare routine experiment MVP shell',
};

const navItems = [
  { href: '/', label: '홈' },
  { href: '/survey', label: '설문' },
  { href: '/products', label: '제품 등록' },
  { href: '/analysis', label: '루틴 분석' },
  { href: '/recommendation', label: '루틴 추천' },
  { href: '/logs', label: '주간 기록' },
  { href: '/dashboard', label: '대시보드' },
  { href: '/admin', label: '브랜드 인사이트' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/" className="text-xl font-black tracking-normal text-loop-ink">
                  SkinLoop
                </Link>
                <div className="flex flex-col gap-2 sm:items-end">
                  <p className="text-sm font-semibold text-slate-500">
                    루틴 실험 기록 · 제품 핏 참고 · 진단 아님
                  </p>
                  <DemoDataControls compact />
                </div>
              </div>
              <nav className="flex gap-2 overflow-x-auto pb-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-loop-leaf hover:bg-white hover:text-loop-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
