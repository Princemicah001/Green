'use client';

import React from 'react';
import Header from '@/components/navigation/Header';
import Sidebar from '@/components/navigation/Sidebar';
import { SentinelProvider } from '@/lib/store/sentinelStore';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SentinelProvider>
      <div className="min-h-screen bg-eco-950 text-eco-50 flex flex-col font-sans select-none overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Content Shell: Sidebar + Primary Workspace */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-eco-950 flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </SentinelProvider>
  );
}
