'use client';

import React from 'react';
import TopNav from '@/components/navigation/TopNav';
import { SentinelProvider } from '@/lib/store/sentinelStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SentinelProvider>
      <div className="min-h-screen bg-apple-bg text-apple-text dark:bg-eco-950 dark:text-eco-50 flex flex-col font-sans select-none overflow-x-hidden">
        <TopNav />

        <main className="flex-1 flex flex-col bg-apple-bg dark:bg-eco-950 text-apple-text dark:text-eco-50">
          {children}
        </main>
      </div>
    </SentinelProvider>
  );
}
