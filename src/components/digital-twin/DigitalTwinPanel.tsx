'use client';

import React from 'react';
import { LocationTwin } from '@/types';
import { ArrowUpRight, ArrowDownRight, Minus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface DigitalTwinPanelProps {
  location: LocationTwin;
  onViewRegionDetail?: () => void;
  className?: string;
}

export default function DigitalTwinPanel({
  location,
  onViewRegionDetail,
  className = '',
}: DigitalTwinPanelProps) {
  const { signals, assessment, trend90d } = location;

  // Compute SVG coordinates for the 90-day trend sparkline
  const chartHeight = 52;
  const chartWidth = 300;
  const minVal = 20;
  const maxVal = 95;
  const range = maxVal - minVal;

  const pointsString = trend90d
    .map((val, idx) => {
      const x = (idx / (trend90d.length - 1)) * chartWidth;
      const y = chartHeight - ((val - minVal) / range) * chartHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Baseline line Y
  const baselineY = chartHeight - ((48 - minVal) / range) * chartHeight;

  const statusBadge = 
    location.status === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical border-status-critical/30' :
    location.status === 'STRESSED' ? 'bg-status-stressed/10 text-status-stressed border-status-stressed/30' :
    location.status === 'WATCH' ? 'bg-status-watch/10 text-status-watch border-status-watch/30' :
    'bg-status-healthy/10 text-status-healthy border-status-healthy/30';

  return (
    <div className={`flex flex-col bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card p-6 sm:p-7 text-apple-text dark:text-eco-50 select-text transition-all ${className}`}>
      {/* Location Header */}
      <div className="flex items-start justify-between border-b border-apple-border dark:border-eco-750 pb-5 mb-5">
        <div>
          <div className="text-xs font-mono tracking-widest text-apple-muted dark:text-eco-400 uppercase font-semibold">
            {location.country} / {location.region}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-apple-text dark:text-eco-50 mt-1">
            {location.name}
          </h2>
          <div className="text-xs font-mono text-apple-muted dark:text-eco-400 mt-1 font-medium">
            {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-xs font-mono text-apple-muted dark:text-eco-400 uppercase tracking-wider mb-1 font-medium">
            Environmental Status
          </div>
          <span className={`text-xs uppercase font-mono px-3 py-1 rounded-full border font-bold ${statusBadge}`}>
            {location.status}
          </span>
        </div>
      </div>

      {/* Primary Stress Score Gauge */}
      <div className="mb-6">
        <div className="text-xs font-mono tracking-wider text-apple-muted dark:text-eco-400 uppercase mb-1.5 font-semibold">
          Environmental Stress Index
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-apple-text dark:text-eco-50">
            {location.overallStress}
          </span>
          <span className="text-base font-mono text-apple-muted dark:text-eco-400 font-semibold">/ 100</span>
          
          <div className="ml-auto flex items-center gap-1.5 text-xs font-mono font-medium">
            {assessment.rateOfChange === 'INCREASING' && (
              <span className="inline-flex items-center gap-1 text-status-stressed font-semibold">
                <ArrowUpRight className="w-4 h-4" />
                Increasing
              </span>
            )}
            {assessment.rateOfChange === 'DECREASING' && (
              <span className="inline-flex items-center gap-1 text-status-healthy font-semibold">
                <ArrowDownRight className="w-4 h-4" />
                Decreasing
              </span>
            )}
            {assessment.rateOfChange === 'STABLE' && (
              <span className="inline-flex items-center gap-1 text-apple-muted dark:text-eco-400">
                <Minus className="w-4 h-4" />
                Stable
              </span>
            )}
          </div>
        </div>

        {/* Multi-component Progress Bar */}
        <div className="w-full h-2.5 bg-apple-subtle dark:bg-eco-800 rounded-full overflow-hidden mt-3 flex">
          <div 
            className="h-full bg-env-emerald dark:bg-status-stressed transition-all duration-500 rounded-full" 
            style={{ width: `${location.overallStress}%` }} 
          />
        </div>
      </div>

      {/* Core Domain Breakdown */}
      <div className="grid grid-cols-2 gap-3 py-4 border-y border-apple-border dark:border-eco-750 font-sans mb-5">
        <div className="flex items-center justify-between p-3 bg-apple-subtle dark:bg-eco-850 rounded-2xl border border-apple-border/60 dark:border-eco-750">
          <span className="text-xs sm:text-sm text-apple-secondary dark:text-eco-300 font-medium">Water Deficit</span>
          <span className="font-bold text-apple-text dark:text-eco-50 text-base font-mono">{signals.waterStress}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-apple-subtle dark:bg-eco-850 rounded-2xl border border-apple-border/60 dark:border-eco-750">
          <span className="text-xs sm:text-sm text-apple-secondary dark:text-eco-300 font-medium">Energy Grid</span>
          <span className="font-bold text-apple-text dark:text-eco-50 text-base font-mono">{signals.energyStress}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-apple-subtle dark:bg-eco-850 rounded-2xl border border-apple-border/60 dark:border-eco-750">
          <span className="text-xs sm:text-sm text-apple-secondary dark:text-eco-300 font-medium">Thermal Heat</span>
          <span className="font-bold text-apple-text dark:text-eco-50 text-base font-mono">{signals.heatStress}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-apple-subtle dark:bg-eco-850 rounded-2xl border border-apple-border/60 dark:border-eco-750">
          <span className="text-xs sm:text-sm text-apple-secondary dark:text-eco-300 font-medium">Community</span>
          <span className="font-bold text-apple-text dark:text-eco-50 text-base font-mono">{signals.communitySignal}</span>
        </div>
      </div>

      {/* 90-Day Trend Chart */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-mono tracking-wider text-apple-muted dark:text-eco-400 uppercase mb-2 font-semibold">
          <span>90-Day Stress Trajectory</span>
          <span className="font-normal">Baseline: 48</span>
        </div>
        
        <div className="w-full bg-apple-subtle/60 dark:bg-eco-850 border border-apple-border dark:border-eco-750 rounded-2xl p-3 flex items-center justify-center">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-14 overflow-visible">
            {/* Baseline dashed indicator */}
            <line
              x1="0"
              y1={baselineY}
              x2={chartWidth}
              y2={baselineY}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              strokeWidth="1.5"
              className="opacity-50"
            />
            {/* Trend line */}
            <polyline
              fill="none"
              stroke="#EA580C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />
            {/* Final point marker */}
            <circle
              cx={chartWidth}
              cy={chartHeight - ((trend90d[trend90d.length - 1] - minVal) / range) * chartHeight}
              r="4.5"
              fill="#EA580C"
            />
          </svg>
        </div>
      </div>

      {/* Current Signals Table */}
      <div className="mb-5">
        <div className="text-xs font-mono tracking-wider text-apple-muted dark:text-eco-400 uppercase mb-2 font-semibold">
          Current Regional Telemetry
        </div>
        
        <div className="divide-y divide-apple-border dark:divide-eco-750 text-sm">
          <div className="flex items-center justify-between py-2.5">
            <span className="text-apple-secondary dark:text-eco-300">Surface Temperature</span>
            <span className="font-mono text-apple-text dark:text-eco-100 font-semibold">{signals.temperatureC.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-apple-secondary dark:text-eco-300">Precipitation Deficit</span>
            <span className="font-mono text-apple-text dark:text-eco-100 font-semibold">{signals.rainfallDeviationPct > 0 ? '+' : ''}{signals.rainfallDeviationPct}%</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-apple-secondary dark:text-eco-300">Water Stress Index</span>
            <span className="font-mono text-apple-text dark:text-eco-100 font-semibold">{signals.waterStress} / 100</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-apple-secondary dark:text-eco-300">Facility Cooling Delta</span>
            <span className="font-mono text-apple-text dark:text-eco-100 font-semibold">{signals.coolingDemandDeltaPct > 0 ? '+' : ''}{signals.coolingDemandDeltaPct}%</span>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-apple-secondary dark:text-eco-300">Community Observations</span>
            <span className="font-mono text-apple-text dark:text-eco-100 font-semibold">{signals.communityObservationsCount} verified</span>
          </div>
        </div>
      </div>

      {/* Primary Contributors */}
      <div className="mb-5 pt-3 border-t border-apple-border dark:border-eco-750">
        <div className="text-xs font-mono tracking-wider text-apple-muted dark:text-eco-400 uppercase mb-2 font-semibold">
          Primary Contributors
        </div>
        <div className="flex flex-wrap gap-2">
          {assessment.primaryContributors.map(c => (
            <span key={c} className="text-xs px-3 py-1 bg-apple-subtle dark:bg-eco-800 text-apple-secondary dark:text-eco-200 border border-apple-border dark:border-eco-700 rounded-full font-medium">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-auto pt-4 border-t border-apple-border dark:border-eco-750 flex items-center justify-between">
        <span className="text-xs font-mono text-apple-muted dark:text-eco-400">
          Confidence: {assessment.confidence}%
        </span>
        <Link
          href={`/app/climate?location=${location.id}`}
          className="text-xs sm:text-sm font-medium text-env-emerald hover:text-env-forest flex items-center gap-1 transition-colors"
        >
          <span>View Regional Climate Plane</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
