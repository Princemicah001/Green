'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import TimeMachineReplay from '@/components/analytics/TimeMachineReplay';

type TimeRange = '7D' | '30D' | '90D' | '1Y';

export default function HistoryPage() {
  const { selectedLocation } = useSentinel();
  const [timeRange, setTimeRange] = useState<TimeRange>('90D');

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-apple-border dark:border-eco-750 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-apple-muted dark:text-eco-400 font-semibold">
            Temporal Multi-Sensor Trace
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 tracking-tight mt-1">
            Historical Intelligence & Time Machine
          </h1>
          <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-300 font-sans mt-1">
            Replay seasonal transitions and evaluate continuous deviation against multi-year baselines.
          </p>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-2xl shadow-apple-sm text-xs sm:text-sm font-medium">
          {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                timeRange === range
                  ? 'bg-apple-text text-white dark:bg-eco-50 dark:text-eco-950 font-semibold shadow-sm'
                  : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
              }`}
            >
              {range === '7D' ? '7 Days' : range === '30D' ? '30 Days' : range === '90D' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Intelligence Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card space-y-2">
          <div className="text-xs uppercase text-apple-muted dark:text-eco-400 font-mono font-semibold">Water Stress Index</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-apple-text dark:text-eco-50">{selectedLocation.signals.waterStress}</span>
            <span className="text-xs font-mono text-apple-muted dark:text-eco-400">Baseline: 48</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-apple-border/60 dark:border-eco-800 text-status-stressed font-semibold">
            <span>Deviation: +{selectedLocation.signals.waterStress - 48}</span>
            <span>Trend: Increasing ↑</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card space-y-2">
          <div className="text-xs uppercase text-apple-muted dark:text-eco-400 font-mono font-semibold">Heat Stress Index</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-apple-text dark:text-eco-50">{selectedLocation.signals.heatStress}</span>
            <span className="text-xs font-mono text-apple-muted dark:text-eco-400">Baseline: 52</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-apple-border/60 dark:border-eco-800 text-status-stressed font-semibold">
            <span>Deviation: +{selectedLocation.signals.heatStress - 52}</span>
            <span>Trend: Increasing ↑</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card space-y-2">
          <div className="text-xs uppercase text-apple-muted dark:text-eco-400 font-mono font-semibold">Energy Grid Load</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-apple-text dark:text-eco-50">{selectedLocation.signals.energyStress}</span>
            <span className="text-xs font-mono text-apple-muted dark:text-eco-400">Baseline: 45</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-apple-border/60 dark:border-eco-800 text-apple-secondary dark:text-eco-200 font-semibold">
            <span>Deviation: +{selectedLocation.signals.energyStress - 45}</span>
            <span>Trend: Moderate →</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card space-y-2">
          <div className="text-xs uppercase text-apple-muted dark:text-eco-400 font-mono font-semibold">Community Reports</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-apple-text dark:text-eco-50">{selectedLocation.signals.communityObservationsCount}</span>
            <span className="text-xs font-mono text-apple-muted dark:text-eco-400">Baseline: 30</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-apple-border/60 dark:border-eco-800 text-status-stressed font-semibold">
            <span>Surge: +{selectedLocation.signals.communityObservationsCount - 30}</span>
            <span>Rate: Spike ↑</span>
          </div>
        </div>
      </div>

      {/* Environmental Time Machine Replay Interactive Component */}
      <TimeMachineReplay />
    </div>
  );
}
