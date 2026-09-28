'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSentinel } from '@/lib/store/sentinelStore';
import DigitalTwinPanel from '@/components/digital-twin/DigitalTwinPanel';
import GlobeControls from '@/components/globe/GlobeControls';
import AlertStream from '@/components/alerts/AlertStream';
import { EnvironmentalStatus } from '@/types';
import Link from 'next/link';

// Dynamic import of 3D globe to avoid SSR mismatch
const SentinelGlobe = dynamic(() => import('@/components/globe/SentinelGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-eco-950 text-eco-400 font-mono text-sm">
      Loading 3D Earth WebGL context...
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
    <div className="flex-1 flex flex-col p-5 md:p-7 gap-7 max-w-[1700px] w-full mx-auto">
      {/* Top Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-eco-400 font-semibold">
            Environmental Intelligence Plane
          </div>
          <h1 className="text-2xl font-bold text-eco-50 tracking-tight mt-1">
            Sentinel Global Command Overview
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

      {/* Main Workspace: 3D Globe is the HERO (Requirement 7 & 33) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
        
        {/* The 3D Earth Globe Canvas (Occupies majority of screen) */}
        <div className="xl:col-span-8 h-[560px] md:h-[640px] bg-eco-950 border border-eco-700 rounded relative overflow-hidden shadow-2xl">
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

        {/* Selected Location Environmental Digital Twin (Requirement 10) */}
        <div className="xl:col-span-4 w-full">
          <DigitalTwinPanel location={selectedLocation} />
        </div>
      </div>

      {/* Lower Section: Quick Regional Signals + Recent Events Stream (Requirement 33) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-2">
        {/* Quick Regional Signals Strip */}
        <div className="lg:col-span-5 bg-eco-900 border border-eco-700 rounded p-5 flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between border-b border-eco-750 pb-3 mb-4">
            <span className="text-xs uppercase text-eco-300 tracking-wider font-bold">
              {selectedLocation.name} Current Signals
            </span>
            <span className="text-xs text-eco-400">Baseline Target: 48</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-sm mb-4">
            <div className="p-3 bg-eco-850 border border-eco-750 rounded">
              <div className="text-xs text-eco-400 uppercase font-semibold">Water</div>
              <div className="text-2xl font-bold text-eco-50 mt-1">{selectedLocation.signals.waterStress}</div>
              <div className="text-[11px] text-eco-400 mt-1">Stress Index</div>
            </div>
            <div className="p-3 bg-eco-850 border border-eco-750 rounded">
              <div className="text-xs text-eco-400 uppercase font-semibold">Energy</div>
              <div className="text-2xl font-bold text-eco-50 mt-1">{selectedLocation.signals.energyStress}</div>
              <div className="text-[11px] text-eco-400 mt-1">Stress Index</div>
            </div>
            <div className="p-3 bg-eco-850 border border-eco-750 rounded">
              <div className="text-xs text-eco-400 uppercase font-semibold">Heat</div>
              <div className="text-2xl font-bold text-eco-50 mt-1">{selectedLocation.signals.heatStress}</div>
              <div className="text-[11px] text-eco-400 mt-1">Stress Index</div>
            </div>
            <div className="p-3 bg-eco-850 border border-eco-750 rounded">
              <div className="text-xs text-eco-400 uppercase font-semibold">Community</div>
              <div className="text-2xl font-bold text-eco-50 mt-1">{selectedLocation.signals.communitySignal}</div>
              <div className="text-[11px] text-eco-400 mt-1">Signal Index</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-eco-200 pt-3 border-t border-eco-750">
            <span>Surface Temp: <strong className="text-eco-50 font-semibold">{selectedLocation.signals.temperatureC}°C</strong></span>
            <Link href="/app/climate" className="text-eco-200 hover:text-eco-50 flex items-center gap-1.5 font-mono text-xs font-semibold">
              <span>Deep telemetry →</span>
            </Link>
          </div>
        </div>

        {/* Recent Events Event Stream (Requirement 22 & 33) */}
        <div className="lg:col-span-7">
          <AlertStream alerts={alerts.slice(0, 3)} showAcknowledge={false} />
        </div>
      </div>
    </div>
  );
}
