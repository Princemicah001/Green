'use client';

import React from 'react';
import GreenFinanceLayer from '@/components/finance/GreenFinanceLayer';

export default function FinancePage() {
  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
      <div className="border-b border-apple-border dark:border-eco-750 pb-5">
        <div className="text-xs font-mono uppercase tracking-widest text-apple-muted dark:text-eco-400 font-semibold">
          Climate Data, Awareness & Green Finance Hackathon Track
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 tracking-tight mt-1">
          Sustainable Finance & Environmental Evidence
        </h1>
        <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-300 font-sans mt-1">
          Empirical verification layer providing immutable environmental data for green bond covenants, transition credits, and climate risk assessments.
        </p>
      </div>

      <GreenFinanceLayer />
    </div>
  );
}
