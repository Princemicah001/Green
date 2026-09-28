'use client';

import React from 'react';
import ClaimControlConsole from '@/components/controller/ClaimControlConsole';

export default function ControllerPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8">
      <div className="border-b border-apple-border dark:border-eco-750 pb-5">
        <div className="text-xs font-mono uppercase tracking-widest text-apple-muted dark:text-eco-400 font-semibold">
          Review Desk · Receive, monitor & verify citizen claims
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 tracking-tight mt-1">
          Claim Control Console
        </h1>
        <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-300 font-sans mt-1 max-w-3xl">
          Incoming reports land here for review. Check the evidence, cross-reference satellite and field data,
          then verify as true or reject. Verified claims unlock GreenPoints for the reporter.
        </p>
      </div>

      <ClaimControlConsole />
    </div>
  );
}
