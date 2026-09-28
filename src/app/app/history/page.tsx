'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import TimeMachineReplay from '@/components/analytics/TimeMachineReplay';
import { HistoryRepository } from '@/lib/repositories/historyRepository';
import { History, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

type TimeRange = '7D' | '30D' | '90D' | '1Y';

export default function HistoryPage() {
  const { selectedLocation } = useSentinel();
  const [timeRange, setTimeRange] = useState<TimeRange>('90D');

  const historyRepo = HistoryRepository.getInstance();
  const series = historyRepo.getSeriesForLocation(
    selectedLocation.id,
    selectedLocation.overallStress,
    selectedLocation.assessment.rateOfChange
  );

  return (
    <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-eco-400">
            Temporal Multi-Sensor Trace
          </div>
          <h1 className="text-xl font-semibold text-eco-50 tracking-tight mt-0.5">
            Historical Intelligence & Environmental Time Machine
          </h1>
          <p className="text-xs text-eco-300 font-sans mt-0.5">
            Replay seasonal transitions and evaluate continuous deviation against multi-year baselines.
          </p>
        </div>

        {/* Time Period Selector (Requirement 15) */}
        <div className="flex items-center gap-1.5 p-1 bg-eco-900 border border-eco-700 rounded text-xs font-mono">
          {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded transition-colors ${
                timeRange === range
                  ? 'bg-eco-750 text-eco-50 font-semibold border border-eco-600'
                  : 'text-eco-400 hover:text-eco-200'
              }`}
            >
              {range === '7D' ? '7 DAYS' : range === '30D' ? '30 DAYS' : range === '90D' ? '90 DAYS' : '1 YEAR'}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Intelligence Metrics (Requirement 15) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 bg-eco-900 border border-eco-700 rounded space-y-1">
          <div className="text-[10px] uppercase text-eco-400">Water Stress Index</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-eco-50">{selectedLocation.signals.waterStress}</span>
            <span className="text-xs text-eco-400">Baseline: 48</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-eco-800 text-status-stressed font-semibold">
            <span>Deviation: +{selectedLocation.signals.waterStress - 48}</span>
            <span>Trend: Increasing ↑</span>
          </div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded space-y-1">
          <div className="text-[10px] uppercase text-eco-400">Heat Stress Index</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-eco-50">{selectedLocation.signals.heatStress}</span>
            <span className="text-xs text-eco-400">Baseline: 52</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-eco-800 text-status-stressed font-semibold">
            <span>Deviation: +{selectedLocation.signals.heatStress - 52}</span>
            <span>Trend: Increasing ↑</span>
          </div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded space-y-1">
          <div className="text-[10px] uppercase text-eco-400">Energy Demand Stress</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-eco-50">{selectedLocation.signals.energyStress}</span>
            <span className="text-xs text-eco-400">Baseline: 45</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-eco-800 text-eco-300 font-semibold">
            <span>Deviation: +{selectedLocation.signals.energyStress - 45}</span>
            <span>Trend: Moderate →</span>
          </div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded space-y-1">
          <div className="text-[10px] uppercase text-eco-400">Community Observations</div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-eco-50">{selectedLocation.signals.communityObservationsCount}</span>
            <span className="text-xs text-eco-400">Baseline: 30</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-eco-800 text-status-stressed font-semibold">
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
