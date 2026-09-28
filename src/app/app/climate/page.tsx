'use client';

import React from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import VariableComparator from '@/components/analytics/VariableComparator';
import { CloudRain, Thermometer, Droplet, SunMedium, Flame, Info } from 'lucide-react';

export default function ClimatePage() {
  const { selectedLocation, triggerHeatSpike } = useSentinel();
  const { signals } = selectedLocation;

  return (
    <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-eco-400">
            Copernicus & ERA5 Reanalysis
          </div>
          <h1 className="text-xl font-semibold text-eco-50 tracking-tight mt-0.5">
            Climate & Hydrological Intelligence Plane
          </h1>
          <p className="text-xs text-eco-300 font-sans mt-0.5">
            Surface thermal radiance, precipitation anomalies, soil moisture deficit, and multi-sensor correlation analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerHeatSpike()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-eco-800 hover:bg-eco-750 text-status-stressed border border-eco-700 rounded text-xs font-mono transition-colors"
            title="Simulate heat wave anomaly spike in current region"
          >
            <Flame className="w-3.5 h-3.5 text-status-stressed" />
            <span>Simulate Heat Event</span>
          </button>
        </div>
      </div>

      {/* Primary Climate Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Surface Temperature</div>
          <div className="text-2xl font-bold text-eco-50 mt-1">{signals.temperatureC.toFixed(1)}°C</div>
          <div className="text-[10px] text-status-stressed mt-1">
            +{(signals.temperatureC - 27.5).toFixed(1)}°C 10-Yr Anomaly
          </div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Precipitation Deficit</div>
          <div className="text-2xl font-bold text-eco-50 mt-1">
            {signals.rainfallDeviationPct > 0 ? '+' : ''}{signals.rainfallDeviationPct}%
          </div>
          <div className="text-[10px] text-eco-400 mt-1">Below seasonal baseline</div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Hydrological Stress</div>
          <div className="text-2xl font-bold text-status-stressed mt-1">{signals.waterStress} / 100</div>
          <div className="text-[10px] text-eco-400 mt-1">Aquifer drawdown risk</div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Cooling Demand Surge</div>
          <div className="text-2xl font-bold text-eco-50 mt-1">
            +{signals.coolingDemandDeltaPct}%
          </div>
          <div className="text-[10px] text-eco-400 mt-1">Chilled loop thermal surge</div>
        </div>
      </div>

      {/* Multi-Variate Analytics & Responsible Correlation Component (Requirement 23 & 24) */}
      <VariableComparator />
    </div>
  );
}
