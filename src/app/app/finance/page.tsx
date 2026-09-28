'use client';

import React from 'react';
import GreenFinanceLayer from '@/components/finance/GreenFinanceLayer';
import { Landmark, ShieldCheck, FileCheck } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
      <div className="border-b border-eco-750 pb-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-eco-400">
          Climate Data, Awareness & Green Finance Hackathon Track
        </div>
        <h1 className="text-xl font-semibold text-eco-50 tracking-tight mt-0.5">
          Sustainable Finance & Environmental Evidence Plane
        </h1>
        <p className="text-xs text-eco-300 font-sans mt-0.5">
          Empirical verification layer providing immutable environmental data for green bond covenants, transition credits, and climate risk assessments.
        </p>
      </div>

      <GreenFinanceLayer />
    </div>
  );
}
