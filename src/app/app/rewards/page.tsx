'use client';

import React from 'react';
import GreenRewardsMarketplace from '@/components/rewards/GreenRewardsMarketplace';

export default function RewardsPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8">
      <div className="border-b border-apple-border dark:border-eco-750 pb-5">
        <div className="text-xs font-mono uppercase tracking-widest text-apple-muted dark:text-eco-400 font-semibold">
          Earn by reporting · Spend on green living
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 tracking-tight mt-1">
          Green Rewards Marketplace
        </h1>
        <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-300 font-sans mt-1 max-w-3xl">
          Every verified report earns GreenPoints. Spend them here on solar products, lamps, water pumps,
          cook stoves and tree seedlings — delivered through local partners.
        </p>
      </div>

      <GreenRewardsMarketplace />
    </div>
  );
}
