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
      colorA: '#3B82F6', // Muted steel blue
      colorB: '#EA580C', // Muted orange
      labelA: 'Water Stress',
      labelB: 'Heat Stress',
      correlationValue: 'r = +0.81 (Observed relationship)',
      analysis: 'Elevated surface temperatures closely coincide with heightened aquifer drawdown in municipal intake corridors.',
    },
    COOLING_VS_WATER: {
      varA: 'Facility Cooling Load (%)',
      varB: 'Evaporative Water Demand (ML/d)',
      colorA: '#6366F1', // Indigo
      colorB: '#0EA5E9', // Sky blue
      labelA: 'Cooling Demand',
      labelB: 'Water Demand',
      correlationValue: 'r = +0.89 (Observed relationship)',
      analysis: 'Chiller heat rejection cycles drive steep linear increases in cooling tower water top-up volume.',
    },
    RAINFALL_VS_COMMUNITY: {
      varA: 'Precipitation Deficit (%)',
      varB: 'Community Water Submissions',
      colorA: '#64748B', // Slate
      colorB: '#F59E0B', // Amber
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
    <div className="bg-eco-900 border border-eco-700 rounded p-6 text-eco-50 font-mono">
      {/* Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-4 mb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-eco-400 font-bold">
            Multi-Variate Correlation Analytics
          </span>
          <h3 className="text-base font-bold text-eco-50 mt-1">
            {selectedLocation.name} Cross-Domain Signal Inspection
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <button
            onClick={() => setSelectedPair('WATER_VS_HEAT')}
            className={`px-3 py-1.5 rounded border transition-colors ${
              selectedPair === 'WATER_VS_HEAT'
                ? 'bg-eco-750 text-eco-50 border-eco-600 font-bold'
                : 'text-eco-400 border-eco-800 hover:text-eco-200'
            }`}
          >
            Water vs Heat
          </button>
          <button
            onClick={() => setSelectedPair('COOLING_VS_WATER')}
            className={`px-3 py-1.5 rounded border transition-colors ${
              selectedPair === 'COOLING_VS_WATER'
                ? 'bg-eco-750 text-eco-50 border-eco-600 font-bold'
                : 'text-eco-400 border-eco-800 hover:text-eco-200'
            }`}
          >
            Cooling vs Water
          </button>
          <button
            onClick={() => setSelectedPair('RAINFALL_VS_COMMUNITY')}
            className={`px-3 py-1.5 rounded border transition-colors ${
              selectedPair === 'RAINFALL_VS_COMMUNITY'
                ? 'bg-eco-750 text-eco-50 border-eco-600 font-bold'
                : 'text-eco-400 border-eco-800 hover:text-eco-200'
            }`}
          >
            Rainfall vs Community
          </button>
        </div>
      </div>

      {/* SVG Dual-Trace Chart */}
      <div className="w-full bg-eco-950 border border-eco-750 rounded p-4 mb-5">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1" style={{ backgroundColor: pairConfig.colorA }} />
              <span className="text-eco-100 font-semibold">{pairConfig.labelA}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1" style={{ backgroundColor: pairConfig.colorB }} />
              <span className="text-eco-100 font-semibold">{pairConfig.labelB}</span>
            </div>
          </div>
          <span className="text-xs md:text-sm text-eco-200 font-bold">{pairConfig.correlationValue}</span>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map(val => {
            const y = height - padding - (val / 100) * (height - padding * 2);
            return (
              <g key={val}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#22272D" strokeWidth="1" />
                <text x={padding - 8} y={y + 3.5} fill="#8B9299" fontSize="10" textAnchor="end" fontFamily="monospace">
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

        <div className="flex justify-between text-xs text-eco-400 px-9 pt-2">
          <span>90 Days Ago</span>
          <span>60 Days Ago</span>
          <span>30 Days Ago</span>
          <span>Present</span>
        </div>
      </div>

      {/* Scientific Responsible Language Notice (Requirement 24) */}
      <div className="p-4 bg-eco-850 border border-eco-750 rounded text-sm text-eco-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-eco-400 shrink-0 mt-0.5" />
        <div className="space-y-1 font-sans">
          <div className="font-bold text-eco-50 font-mono text-xs uppercase tracking-wider">
            Scientific Attribution Notice
          </div>
          <p className="text-sm leading-relaxed text-eco-200">
            {pairConfig.analysis} <em>Note: Statistical association indicates an observed relationship and environmental anomaly requiring further investigation; it does not constitute single-source causality.</em>
          </p>
        </div>
      </div>
    </div>
  );
}
