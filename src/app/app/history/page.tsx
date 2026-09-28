'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import TimeMachineReplay from '@/components/analytics/TimeMachineReplay';

type TimeRange = '7D' | '30D' | '90D' | '1Y';

export default function HistoryPage() {
  const { selectedLocation } = useSentinel();
  const [timeRange, setTimeRange] = useState<TimeRange>('90D');

  return (
    <div className="flex-1 p-5 md:p-7 max-w-7xl w-full mx-auto space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-eco-400 font-semibold">
            Temporal Multi-Sensor Trace
          </div>
          <h1 className="text-2xl font-bold text-eco-50 tracking-tight mt-1">
            Historical Intelligence & Environmental Time Machine
          </h1>
          <p className="text-sm text-eco-300 font-sans mt-1">
            Replay seasonal transitions and evaluate continuous deviation against multi-year baselines.
          </p>
        </div>

        {/* Time Period Selector (Requirement 15) */}
        <div className="flex items-center gap-2 p-1.5 bg-eco-900 border border-eco-700 rounded text-xs font-mono">
          {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded transition-colors ${
                timeRange === range
                  ? 'bg-eco-750 text-eco-50 font-bold border border-eco-600'
                  : 'text-eco-400 hover:text-eco-200'
              }`}
            >
              {range === '7D' ? '7 DAYS' : range === '30D' ? '30 DAYS' : range === '90D' ? '90 DAYS' : '1 YEAR'}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Intelligence Metrics (Requirement 15) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-mono">
        <div className="p-4 bg-eco-900 border border-eco-700 rounded space-y-1.5">
          <div className="text-xs uppercase text-eco-400 font-semibold">Water Stress Index</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-eco-50">{selectedLocation.signals.waterStress}</span>
            <span className="text-xs text-eco-400">Baseline: 48</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-eco-800 text-status-stressed font-bold">
            <span>Deviation: +{selectedLocation.signals.waterStress - 48}</span>
            <span>Trend: Increasing ↑</span>
          </div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded space-y-1.5">
          <div className="text-xs uppercase text-eco-400 font-semibold">Heat Stress Index</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-eco-50">{selectedLocation.signals.heatStress}</span>
            <span className="text-xs text-eco-400">Baseline: 52</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-eco-800 text-status-stressed font-bold">
            <span>Deviation: +{selectedLocation.signals.heatStress - 52}</span>
            <span>Trend: Increasing ↑</span>
          </div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded space-y-1.5">
          <div className="text-xs uppercase text-eco-400 font-semibold">Energy Demand Stress</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-eco-50">{selectedLocation.signals.energyStress}</span>
            <span className="text-xs text-eco-400">Baseline: 45</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-eco-800 text-eco-200 font-bold">
            <span>Deviation: +{selectedLocation.signals.energyStress - 45}</span>
            <span>Trend: Moderate →</span>
          </div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded space-y-1.5">
          <div className="text-xs uppercase text-eco-400 font-semibold">Community Observations</div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-eco-50">{selectedLocation.signals.communityObservationsCount}</span>
            <span className="text-xs text-eco-400">Baseline: 30</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-eco-800 text-status-stressed font-bold">
            <span>Surge: +{selectedLocation.signals.communityObservationsCount - 30}</span>
            <span>Rate: Spike ↑</span>
          </div>
        </div>
      </div>

      {/* Environmental Time Machine Replay Interactive Component (Requirement 16) */}
      <TimeMachineReplay />
    </div>
  );
}
