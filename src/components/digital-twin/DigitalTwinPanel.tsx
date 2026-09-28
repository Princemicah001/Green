'use client';

import React from 'react';
import { LocationTwin } from '@/types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
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

  return (
    <div className={`flex flex-col bg-eco-900/95 border border-eco-700/80 rounded backdrop-blur-md p-6 text-eco-50 select-text ${className}`}>
      {/* Location Header */}
      <div className="flex items-start justify-between border-b border-eco-750 pb-4 mb-4">
        <div>
          <div className="text-xs font-mono tracking-widest text-eco-400 uppercase font-semibold">
            {location.country} / {location.region}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-eco-50 mt-1">
            {location.name}
          </h2>
          <div className="text-xs font-mono text-eco-400 mt-1">
            {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-xs font-mono text-eco-400 uppercase tracking-wider mb-1 font-medium">
            Status
          </div>
          <span className={`text-sm uppercase font-mono px-3 py-1 rounded border font-bold ${
            location.status === 'CRITICAL' ? 'text-status-critical-text border-status-critical-border bg-status-critical-subtle' :
            location.status === 'STRESSED' ? 'text-status-stressed-text border-status-stressed-border bg-status-stressed-subtle' :
            location.status === 'WATCH' ? 'text-status-watch-text border-status-watch-border bg-status-watch-subtle' :
            'text-status-healthy-text border-status-healthy-border bg-status-healthy-subtle'
          }`}>
            {location.status}
          </span>
        </div>
      </div>

      {/* Primary Stress Score Gauge */}
      <div className="mb-5">
        <div className="text-xs font-mono tracking-wider text-eco-400 uppercase mb-1.5 font-semibold">
          Environmental Stress Index
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-4xl font-bold font-mono tracking-tight text-eco-50">
            {location.overallStress}
          </span>
          <span className="text-base font-mono text-eco-400 font-semibold">/ 100</span>
          
          <div className="ml-auto flex items-center gap-1.5 text-xs font-mono text-eco-300 font-medium">
            {assessment.rateOfChange === 'INCREASING' && (
              <>
                <ArrowUpRight className="w-4 h-4 text-status-stressed" />
                <span className="text-status-stressed font-semibold">Increasing</span>
              </>
            )}
            {assessment.rateOfChange === 'DECREASING' && (
              <>
                <ArrowDownRight className="w-4 h-4 text-status-healthy" />
                <span className="text-status-healthy font-semibold">Decreasing</span>
              </>
            )}
            {assessment.rateOfChange === 'STABLE' && (
              <>
                <Minus className="w-4 h-4 text-eco-400" />
                <span className="text-eco-400">Stable</span>
              </>
            )}
          </div>
        </div>

        {/* Multi-component Progress Bar */}
        <div className="w-full h-2 bg-eco-800 rounded-full overflow-hidden mt-2.5 flex">
          <div 
            className="h-full bg-status-stressed transition-all duration-500" 
            style={{ width: `${location.overallStress}%` }} 
          />
        </div>
      </div>

      {/* Core Domain Breakdown */}
      <div className="grid grid-cols-2 gap-2.5 py-4 border-y border-eco-750 font-mono text-sm mb-5">
        <div className="flex items-center justify-between px-3 py-2 bg-eco-850 rounded">
          <span className="text-eco-300 font-medium">Water</span>
          <span className="font-bold text-eco-50 text-base">{signals.waterStress}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-eco-850 rounded">
          <span className="text-eco-300 font-medium">Energy</span>
          <span className="font-bold text-eco-50 text-base">{signals.energyStress}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-eco-850 rounded">
          <span className="text-eco-300 font-medium">Heat</span>
          <span className="font-bold text-eco-50 text-base">{signals.heatStress}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-eco-850 rounded">
          <span className="text-eco-300 font-medium">Community</span>
          <span className="font-bold text-eco-50 text-base">{signals.communitySignal}</span>
        </div>
      </div>

      {/* 90-Day Trend Chart */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-mono tracking-wider text-eco-400 uppercase mb-2 font-semibold">
          <span>90-Day Stress Trajectory</span>
          <span className="text-eco-400 font-normal">Baseline: 48</span>
        </div>
        
        <div className="w-full bg-eco-850 border border-eco-750 rounded p-2.5 flex items-center justify-center">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-14 overflow-visible">
            {/* Baseline dashed indicator */}
            <line
              x1="0"
              y1={baselineY}
              x2={chartWidth}
              y2={baselineY}
              stroke="#383F46"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            {/* Trend line */}
            <polyline
              fill="none"
              stroke="#D9532F"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />
            {/* Final point marker */}
            <circle
              cx={chartWidth}
              cy={chartHeight - ((trend90d[trend90d.length - 1] - minVal) / range) * chartHeight}
              r="4"
              fill="#D9532F"
            />
          </svg>
        </div>
      </div>

      {/* Current Signals Table / Compact Rows */}
      <div className="mb-5">
        <div className="text-xs font-mono tracking-wider text-eco-400 uppercase mb-2 font-semibold">
          Current Regional Telemetry
        </div>
        
        <div className="divide-y divide-eco-750 text-sm">
          <div className="flex items-center justify-between py-2">
            <span className="text-eco-300">Surface Temperature</span>
            <span className="font-mono text-eco-100 font-semibold">{signals.temperatureC.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-eco-300">Precipitation Deficit</span>
            <span className="font-mono text-eco-100 font-semibold">{signals.rainfallDeviationPct > 0 ? '+' : ''}{signals.rainfallDeviationPct}%</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-eco-300">Water Stress Index</span>
            <span className="font-mono text-eco-100 font-semibold">{signals.waterStress} / 100</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-eco-300">Facility Cooling Delta</span>
            <span className="font-mono text-eco-100 font-semibold">{signals.coolingDemandDeltaPct > 0 ? '+' : ''}{signals.coolingDemandDeltaPct}%</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-eco-300">Community Observations</span>
            <span className="font-mono text-eco-100 font-semibold">{signals.communityObservationsCount} verified</span>
          </div>
        </div>
      </div>

      {/* Primary Contributors */}
      <div className="mb-5 pt-3 border-t border-eco-750">
        <div className="text-xs font-mono tracking-wider text-eco-400 uppercase mb-2 font-semibold">
          Primary Contributors
        </div>
        <div className="flex flex-wrap gap-2">
          {assessment.primaryContributors.map(c => (
            <span key={c} className="text-xs px-2.5 py-1 bg-eco-800 text-eco-200 border border-eco-700 rounded font-mono font-medium">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-auto pt-4 border-t border-eco-750 flex items-center justify-between">
        <span className="text-xs font-mono text-eco-400">
          Confidence: {assessment.confidence}%
        </span>
        <Link
          href={`/app/climate?location=${location.id}`}
          className="text-xs font-mono text-eco-200 hover:text-eco-50 flex items-center gap-1.5 transition-colors font-semibold"
        >
          <span>VIEW REGION INTELLIGENCE</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
