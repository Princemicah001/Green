'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSentinel } from '@/lib/store/sentinelStore';
import DigitalTwinPanel from '@/components/digital-twin/DigitalTwinPanel';
import GlobeControls from '@/components/globe/GlobeControls';
import AlertStream from '@/components/alerts/AlertStream';
import { EnvironmentalStatus } from '@/types';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Dynamic import of 3D globe to avoid SSR mismatch
const SentinelGlobe = dynamic(() => import('@/components/globe/SentinelGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-950 text-slate-400 font-sans text-sm">
      Initializing 3D Sentinel Earth...
    </div>
  ),
});

export default function OverviewPage() {
  const { 
    locations, 
    facilities, 
    communityReports, 
    alerts, 
    selectedLocationId, 
    selectedLocation, 
    setSelectedLocationId 
  } = useSentinel();

  const [showFacilities, setShowFacilities] = useState(true);
  const [showCommunitySignals, setShowCommunitySignals] = useState(true);
  const [showClimateStress, setShowClimateStress] = useState(true);
  const [filterStatus, setFilterStatus] = useState<EnvironmentalStatus | 'ALL'>('ALL');

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 gap-7 max-w-[1700px] w-full mx-auto">
      {/* Top Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-apple-border dark:border-eco-750 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-apple-muted dark:text-eco-400 font-semibold">
            Environmental Intelligence Plane
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 tracking-tight mt-1">
            Global Sentinel Command
          </h1>
        </div>

        {/* Floating Globe Controls Bar */}
        <GlobeControls
          showFacilities={showFacilities}
          setShowFacilities={setShowFacilities}
          showCommunitySignals={showCommunitySignals}
          setShowCommunitySignals={setShowCommunitySignals}
          showClimateStress={showClimateStress}
          setShowClimateStress={setShowClimateStress}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          onResetFocus={() => setSelectedLocationId('nairobi')}
        />
      </div>

      {/* Main Workspace: 3D Globe is the HERO */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
        {/* The 3D Earth Globe Canvas */}
        <div className="xl:col-span-8 h-[540px] md:h-[640px] bg-slate-950 border border-apple-border dark:border-eco-700 rounded-3xl relative overflow-hidden shadow-apple-card">
          <SentinelGlobe
            locations={locations}
            facilities={facilities}
            communityReports={communityReports}
            selectedLocationId={selectedLocationId}
            onSelectLocation={setSelectedLocationId}
            showFacilities={showFacilities}
            showCommunitySignals={showCommunitySignals}
            showClimateStress={showClimateStress}
            filterStatus={filterStatus}
          />
        </div>

        {/* Selected Location Environmental Digital Twin */}
        <div className="xl:col-span-4 w-full">
          <DigitalTwinPanel location={selectedLocation} />
        </div>
      </div>

      {/* Lower Section: Quick Regional Signals + Recent Events Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-2">
        {/* Quick Regional Signals Strip */}
        <div className="lg:col-span-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-apple-border dark:border-eco-750 pb-3 mb-4">
            <span className="text-xs font-mono uppercase text-apple-secondary dark:text-eco-300 tracking-wider font-bold">
              {selectedLocation.name} Live Signals
            </span>
            <span className="text-xs text-apple-muted dark:text-eco-400">Baseline Target: 48</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm mb-4 font-sans">
            <div className="p-3 bg-apple-subtle dark:bg-eco-850 border border-apple-border/60 dark:border-eco-750 rounded-xl">
              <div className="text-xs text-apple-muted dark:text-eco-400 uppercase font-semibold">Water</div>
              <div className="text-2xl font-bold font-mono text-apple-text dark:text-eco-50 mt-1">{selectedLocation.signals.waterStress}</div>
              <div className="text-[11px] text-apple-secondary dark:text-eco-400 mt-1">Stress Index</div>
            </div>
            <div className="p-3 bg-apple-subtle dark:bg-eco-850 border border-apple-border/60 dark:border-eco-750 rounded-xl">
              <div className="text-xs text-apple-muted dark:text-eco-400 uppercase font-semibold">Energy</div>
              <div className="text-2xl font-bold font-mono text-apple-text dark:text-eco-50 mt-1">{selectedLocation.signals.energyStress}</div>
              <div className="text-[11px] text-apple-secondary dark:text-eco-400 mt-1">Stress Index</div>
            </div>
            <div className="p-3 bg-apple-subtle dark:bg-eco-850 border border-apple-border/60 dark:border-eco-750 rounded-xl">
              <div className="text-xs text-apple-muted dark:text-eco-400 uppercase font-semibold">Heat</div>
              <div className="text-2xl font-bold font-mono text-apple-text dark:text-eco-50 mt-1">{selectedLocation.signals.heatStress}</div>
              <div className="text-[11px] text-apple-secondary dark:text-eco-400 mt-1">Stress Index</div>
            </div>
            <div className="p-3 bg-apple-subtle dark:bg-eco-850 border border-apple-border/60 dark:border-eco-750 rounded-xl">
              <div className="text-xs text-apple-muted dark:text-eco-400 uppercase font-semibold">Community</div>
              <div className="text-2xl font-bold font-mono text-apple-text dark:text-eco-50 mt-1">{selectedLocation.signals.communitySignal}</div>
              <div className="text-[11px] text-apple-secondary dark:text-eco-400 mt-1">Signal Index</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-apple-secondary dark:text-eco-200 pt-3 border-t border-apple-border dark:border-eco-750">
            <span>Surface Temp: <strong className="text-apple-text dark:text-eco-50 font-semibold">{selectedLocation.signals.temperatureC}°C</strong></span>
            <Link href="/app/climate" className="text-env-emerald hover:text-env-forest flex items-center gap-1 text-sm font-medium transition-colors">
              <span>Deep telemetry</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent Events Stream */}
        <div className="lg:col-span-7">
          <AlertStream alerts={alerts.slice(0, 3)} showAcknowledge={false} />
        </div>
      </div>
    </div>
  );
}
