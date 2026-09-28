'use client';

import React from 'react';
import Image from 'next/image';
import { useSentinel } from '@/lib/store/sentinelStore';
import VariableComparator from '@/components/analytics/VariableComparator';
import { Flame, Satellite, Droplets, Thermometer, Waves } from 'lucide-react';

export default function ClimatePage() {
  const { selectedLocation, triggerHeatSpike } = useSentinel();
  const { signals } = selectedLocation;

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
      {/* Apple-Style Hero Banner with Satellite Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 shadow-apple-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-env-sky/10 border border-env-sky/20 text-env-sky text-xs font-semibold uppercase tracking-wider">
              <Satellite className="w-3.5 h-3.5" />
              <span>Copernicus Sentinel-2 & ERA5 Reanalysis</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-apple-text dark:text-eco-50">
              Climate & Hydrological Intelligence
            </h1>

            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-200 leading-relaxed font-sans">
              Continuous multi-spectral earth observation measuring surface heat radiance, vegetation index (NDVI), river basin deficit, and soil moisture shifts across critical regions.
            </p>

            {/* Quick Action & Status */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => triggerHeatSpike()}
                className="flex items-center gap-2 px-5 py-2.5 bg-env-amber hover:bg-amber-600 text-white font-medium text-sm sm:text-base rounded-2xl shadow-apple-sm transition-all active:scale-95"
                title="Simulate heat wave anomaly spike in current region"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Simulate Thermal Wave Anomaly</span>
              </button>

              <span className="px-3.5 py-1.5 rounded-full bg-apple-subtle dark:bg-eco-800 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700 text-xs sm:text-sm font-medium">
                Active Region: <strong className="font-semibold text-env-emerald">{selectedLocation.name}</strong>
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 h-64 lg:h-full min-h-[260px] relative overflow-hidden bg-slate-100 dark:bg-eco-950">
            <Image
              src="/images/satellite.jpg"
              alt="Orbital Environmental Sentinel Satellite Scanning River Basin"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 right-4 text-xs text-white/90 font-medium lg:hidden">
              Sentinel-2 multispectral vegetation & water reflectance
            </div>
          </div>
        </div>
      </div>

      {/* Primary Climate Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Surface Heat</span>
            <Thermometer className="w-4 h-4 text-env-amber" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 mt-2">
            {signals.temperatureC.toFixed(1)}°C
          </div>
          <div className="text-xs text-status-stressed mt-1 font-semibold">
            +{(signals.temperatureC - 27.5).toFixed(1)}°C above 10-yr mean
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Rainfall Anomaly</span>
            <Droplets className="w-4 h-4 text-env-sky" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 mt-2">
            {signals.rainfallDeviationPct > 0 ? '+' : ''}{signals.rainfallDeviationPct}%
          </div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Seasonal deficit</div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Hydro Stress</span>
            <Waves className="w-4 h-4 text-env-sky" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-status-stressed mt-2">
            {signals.waterStress} / 100
          </div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Aquifer depletion index</div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Cooling Surge</span>
            <Flame className="w-4 h-4 text-env-amber" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 mt-2">
            +{signals.coolingDemandDeltaPct}%
          </div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Chilled water demand surge</div>
        </div>
      </div>

      {/* Multi-Variate Analytics & Responsible Correlation Component */}
      <VariableComparator />
    </div>
  );
}
