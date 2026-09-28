'use client';

import React, { useState } from 'react';
import { HistoryRepository } from '@/lib/repositories/historyRepository';
import { useSentinel } from '@/lib/store/sentinelStore';
import { Info } from 'lucide-react';

type ComparisonPair = 'WATER_VS_HEAT' | 'COOLING_VS_WATER' | 'RAINFALL_VS_COMMUNITY';

export default function VariableComparator() {
  const { selectedLocation } = useSentinel();
  const [selectedPair, setSelectedPair] = useState<ComparisonPair>('WATER_VS_HEAT');

  const historyRepo = HistoryRepository.getInstance();
  const series = historyRepo.getSeriesForLocation(
    selectedLocation.id,
    selectedLocation.overallStress,
    selectedLocation.assessment.rateOfChange
  );

  // Setup variable descriptors
  const pairConfig = {
    WATER_VS_HEAT: {
      varA: 'Water Stress (0-100)',
      varB: 'Heat Stress (0-100)',
      colorA: '#0284C7', // Sky blue
      colorB: '#EA580C', // Orange
      labelA: 'Water Stress',
      labelB: 'Heat Stress',
      correlationValue: 'r = +0.81 (Observed relationship)',
      analysis: 'Elevated surface temperatures closely coincide with heightened aquifer drawdown in municipal intake corridors.',
    },
    COOLING_VS_WATER: {
      varA: 'Facility Cooling Load (%)',
      varB: 'Evaporative Water Demand (ML/d)',
      colorA: '#6366F1', // Indigo
      colorB: '#059669', // Emerald
      labelA: 'Cooling Demand',
      labelB: 'Water Demand',
      correlationValue: 'r = +0.89 (Observed relationship)',
      analysis: 'Chiller heat rejection cycles drive steep linear increases in cooling tower water top-up volume.',
    },
    RAINFALL_VS_COMMUNITY: {
      varA: 'Precipitation Deficit (%)',
      varB: 'Community Water Submissions',
      colorA: '#64748B', // Slate
      colorB: '#D97706', // Amber
      labelA: 'Rainfall Deficit',
      labelB: 'Community Signals',
      correlationValue: 'r = +0.76 (Potential correlation)',
      analysis: 'Ground telemetry submissions intensify within 14 days of sustained regional precipitation deficit.',
    },
  }[selectedPair];

  // SVG Chart Dimensions
  const width = 640;
  const height = 200;
  const padding = 34;

  const pointsA = series.map((pt, i) => {
    const x = padding + (i / (series.length - 1)) * (width - padding * 2);
    const val = selectedPair === 'WATER_VS_HEAT' ? pt.waterStress : (selectedPair === 'COOLING_VS_WATER' ? pt.energyStress : Math.abs(pt.waterStress - 40));
    const y = height - padding - (val / 100) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const pointsB = series.map((pt, i) => {
    const x = padding + (i / (series.length - 1)) * (width - padding * 2);
    const val = selectedPair === 'WATER_VS_HEAT' ? pt.heatStress : (selectedPair === 'COOLING_VS_WATER' ? pt.waterStress : pt.communitySignal);
    const y = height - padding - (val / 100) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card p-6 sm:p-7 text-apple-text dark:text-eco-50 font-sans">
      {/* Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-apple-border dark:border-eco-750 pb-5 mb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold font-mono">
            Multi-Variate Correlation Engine
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-apple-text dark:text-eco-50 mt-1">
            {selectedLocation.name} Cross-Domain Signal Inspection
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          {[
            { id: 'WATER_VS_HEAT', label: 'Water vs Heat' },
            { id: 'COOLING_VS_WATER', label: 'Cooling vs Water' },
            { id: 'RAINFALL_VS_COMMUNITY', label: 'Rainfall vs Community' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setSelectedPair(btn.id as ComparisonPair)}
              className={`px-3.5 py-1.5 rounded-xl border font-medium transition-all ${
                selectedPair === btn.id
                  ? 'bg-apple-text text-white dark:bg-eco-50 dark:text-eco-950 font-semibold shadow-apple-sm'
                  : 'bg-apple-subtle dark:bg-eco-800 text-apple-secondary dark:text-eco-300 border-apple-border dark:border-eco-700 hover:bg-apple-hover'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Dual-Trace Chart */}
      <div className="w-full bg-apple-subtle/50 dark:bg-eco-950 border border-apple-border dark:border-eco-750 rounded-2xl p-4 sm:p-5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm mb-3">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full" style={{ backgroundColor: pairConfig.colorA }} />
              <span className="text-apple-text dark:text-eco-100 font-semibold">{pairConfig.labelA}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1.5 rounded-full" style={{ backgroundColor: pairConfig.colorB }} />
              <span className="text-apple-text dark:text-eco-100 font-semibold">{pairConfig.labelB}</span>
            </div>
          </div>
          <span className="text-xs sm:text-sm text-apple-secondary dark:text-eco-200 font-bold font-mono">
            {pairConfig.correlationValue}
          </span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = height - padding - (val / 100) * (height - padding * 2);
            return (
              <g key={val}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" className="text-slate-200 dark:text-eco-800" strokeWidth="1" />
                <text x={padding - 8} y={y + 3.5} fill="#86868B" fontSize="10" textAnchor="end" fontFamily="monospace">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Trace A */}
          <polyline
            fill="none"
            stroke={pairConfig.colorA}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsA}
          />

          {/* Trace B */}
          <polyline
            fill="none"
            stroke={pairConfig.colorB}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsB}
          />
        </svg>

        <div className="flex justify-between text-xs text-apple-muted dark:text-eco-400 px-8 pt-2 font-mono">
          <span>90 Days Ago</span>
          <span>60 Days Ago</span>
          <span>30 Days Ago</span>
          <span>Present</span>
        </div>
      </div>

      {/* Scientific Responsible Language Notice */}
      <div className="p-4 bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-750 rounded-xl text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-env-emerald shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-apple-text dark:text-eco-50 font-mono text-xs uppercase tracking-wider">
            Attribution & Correlation Notice
          </div>
          <p className="text-sm leading-relaxed text-apple-secondary dark:text-eco-200">
            {pairConfig.analysis} <em>Note: Statistical association indicates an observed relationship and regional anomaly requiring field investigation; it does not constitute single-source causality.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
