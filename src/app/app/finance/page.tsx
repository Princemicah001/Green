'use client';

import React from 'react';
import GreenFinanceLayer from '@/components/finance/GreenFinanceLayer';

export default function FinancePage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8">
      <div className="border-b border-apple-border dark:border-eco-750 pb-5">
        <div className="text-xs font-mono uppercase tracking-widest text-apple-muted dark:text-eco-400 font-semibold">
          Environmental performance you can show funders
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 tracking-tight mt-1">
          Green Finance & Funding Evidence
        </h1>
        <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-300 font-sans mt-1 max-w-3xl">
          Verified environmental records that help water authorities, cities and green projects qualify for
          sustainability funding, resilience bonds and climate credit.
        </p>
      </div>

      <GreenFinanceLayer />
    </div>
  );
}
