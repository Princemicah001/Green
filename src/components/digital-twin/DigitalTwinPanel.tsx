'use client';

import React from 'react';
import { LocationTwin } from '@/types';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
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
  const chartHeight = 44;
  const chartWidth = 260;
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
    <div className={`flex flex-col bg-eco-900/95 border border-eco-700/80 rounded backdrop-blur-md p-5 text-eco-50 select-text ${className}`}>
      {/* Location Header */}
      <div className="flex items-start justify-between border-b border-eco-750 pb-3 mb-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-eco-400 uppercase">
            {location.country} / {location.region}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-eco-50 mt-0.5">
            {location.name}
          </h2>
          <div className="text-[11px] font-mono text-eco-400 mt-0.5">
            {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-[10px] font-mono text-eco-400 uppercase tracking-wider mb-1">
            Status
          </div>
          <span className={`text-xs uppercase font-mono px-2 py-0.5 rounded border font-medium ${
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
      <div className="mb-4">
        <div className="text-[10px] font-mono tracking-wider text-eco-400 uppercase mb-1">
          Environmental Stress Index
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono tracking-tight text-eco-50">
            {location.overallStress}
          </span>
          <span className="text-sm font-mono text-eco-400">/ 100</span>
          
          <div className="ml-auto flex items-center gap-1 text-[11px] font-mono text-eco-300">
            {assessment.rateOfChange === 'INCREASING' && (
              <>
                <ArrowUpRight className="w-3.5 h-3.5 text-status-stressed" />
                <span className="text-status-stressed">Increasing</span>
              </>
            )}
            {assessment.rateOfChange === 'DECREASING' && (
              <>
                <ArrowDownRight className="w-3.5 h-3.5 text-status-healthy" />
                <span className="text-status-healthy">Decreasing</span>
              </>
            )}
            {assessment.rateOfChange === 'STABLE' && (
              <>
                <Minus className="w-3.5 h-3.5 text-eco-400" />
                <span className="text-eco-400">Stable</span>
              </>
            )}
          </div>
        </div>

        {/* Multi-component Progress Bar */}
        <div className="w-full h-1.5 bg-eco-800 rounded-full overflow-hidden mt-2 flex">
          <div 
            className="h-full bg-status-stressed transition-all duration-500" 
            style={{ width: `${location.overallStress}%` }} 
          />
        </div>
      </div>

      {/* Core Domain Breakdown */}
      <div className="grid grid-cols-2 gap-2 py-3 border-y border-eco-750 font-mono text-xs mb-4">
        <div className="flex items-center justify-between px-2 py-1.5 bg-eco-850 rounded">
          <span className="text-eco-400">Water</span>
          <span className="font-semibold text-eco-100">{signals.waterStress}</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1.5 bg-eco-850 rounded">
          <span className="text-eco-400">Energy</span>
          <span className="font-semibold text-eco-100">{signals.energyStress}</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1.5 bg-eco-850 rounded">
          <span className="text-eco-400">Heat</span>
          <span className="font-semibold text-eco-100">{signals.heatStress}</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1.5 bg-eco-850 rounded">
          <span className="text-eco-400">Community</span>
          <span className="font-semibold text-eco-100">{signals.communitySignal}</span>
        </div>
      </div>

      {/* 90-Day Trend Chart */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-eco-400 uppercase mb-2">
          <span>90-Day Stress Trajectory</span>
          <span className="text-eco-500 font-normal">Baseline: 48</span>
        </div>
        
        <div className="w-full bg-eco-850 border border-eco-750 rounded p-2 flex items-center justify-center">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-11 overflow-visible">
            {/* Baseline dashed indicator */}
            <line
              x1="0"
              y1={baselineY}
              x2={chartWidth}
              y2={baselineY}
              stroke="#383F46"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            {/* Trend line */}
            <polyline
              fill="none"
              stroke="#D9532F"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />
            {/* Final point marker */}
            <circle
              cx={chartWidth}
              cy={chartHeight - ((trend90d[trend90d.length - 1] - minVal) / range) * chartHeight}
              r="3"
              fill="#D9532F"
            />
          </svg>
        </div>
      </div>

      {/* Current Signals Table / Compact Rows */}
      <div className="mb-4">
        <div className="text-[10px] font-mono tracking-wider text-eco-400 uppercase mb-2">
          Current Regional Telemetry
        </div>
        
        <div className="divide-y divide-eco-750 text-xs">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-eco-300">Surface Temperature</span>
            <span className="font-mono text-eco-100 font-medium">{signals.temperatureC.toFixed(1)}°C</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-eco-300">Precipitation Deficit</span>
            <span className="font-mono text-eco-100 font-medium">{signals.rainfallDeviationPct > 0 ? '+' : ''}{signals.rainfallDeviationPct}%</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-eco-300">Water Stress Index</span>
            <span className="font-mono text-eco-100 font-medium">{signals.waterStress} / 100</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-eco-300">Facility Cooling Delta</span>
            <span className="font-mono text-eco-100 font-medium">{signals.coolingDemandDeltaPct > 0 ? '+' : ''}{signals.coolingDemandDeltaPct}%</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-eco-300">Community Observations</span>
            <span className="font-mono text-eco-100 font-medium">{signals.communityObservationsCount} verified</span>
          </div>
        </div>
      </div>

      {/* Primary Contributors */}
      <div className="mb-4 pt-2 border-t border-eco-750">
        <div className="text-[10px] font-mono tracking-wider text-eco-400 uppercase mb-1.5">
          Primary Contributors
        </div>
        <div className="flex flex-wrap gap-1.5">
          {assessment.primaryContributors.map(c => (
            <span key={c} className="text-[11px] px-2 py-0.5 bg-eco-800 text-eco-200 border border-eco-700 rounded font-mono">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-auto pt-3 border-t border-eco-750 flex items-center justify-between">
        <span className="text-[10px] font-mono text-eco-400">
          Confidence: {assessment.confidence}%
        </span>
        <Link
          href={`/app/climate?location=${location.id}`}
          className="text-xs text-eco-200 hover:text-eco-50 font-mono flex items-center gap-1 transition-colors"
        >
          <span>VIEW REGION INTELLIGENCE</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
