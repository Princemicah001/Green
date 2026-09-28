'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSentinel } from '@/lib/store/sentinelStore';
import DigitalTwinPanel from '@/components/digital-twin/DigitalTwinPanel';
import GlobeControls from '@/components/globe/GlobeControls';
import AlertStream from '@/components/alerts/AlertStream';
import { EnvironmentalStatus } from '@/types';
import { Globe2, Bell, Shield, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// Dynamic import of 3D globe to avoid SSR mismatch
const SentinelGlobe = dynamic(() => import('@/components/globe/SentinelGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-eco-950 text-eco-500 font-mono text-xs">
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
    <div className="flex-1 flex flex-col p-4 md:p-6 gap-6 max-w-[1700px] w-full mx-auto">
      {/* Top Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-eco-750 pb-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-eco-400">
            Environmental Intelligence Plane
          </div>
          <h1 className="text-xl font-semibold text-eco-50 tracking-tight mt-0.5">
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
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* The 3D Earth Globe Canvas (Occupies majority of screen) */}
        <div className="xl:col-span-8 h-[540px] md:h-[620px] bg-eco-950 border border-eco-700 rounded relative overflow-hidden shadow-2xl">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Quick Regional Signals Strip */}
        <div className="lg:col-span-5 bg-eco-900 border border-eco-700 rounded p-4 flex flex-col justify-between font-mono">
          <div className="flex items-center justify-between border-b border-eco-750 pb-2 mb-3">
            <span className="text-[10px] uppercase text-eco-400 tracking-wider">
              {selectedLocation.name} Current Signals
            </span>
            <span className="text-[10px] text-eco-400">Baseline Target: 48</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mb-3">
            <div className="p-2.5 bg-eco-850 border border-eco-750 rounded">
              <div className="text-[10px] text-eco-400 uppercase">Water</div>
              <div className="text-xl font-bold text-eco-100 mt-1">{selectedLocation.signals.waterStress}</div>
              <div className="text-[9px] text-eco-400 mt-0.5">Stress Index</div>
            </div>
            <div className="p-2.5 bg-eco-850 border border-eco-750 rounded">
              <div className="text-[10px] text-eco-400 uppercase">Energy</div>
              <div className="text-xl font-bold text-eco-100 mt-1">{selectedLocation.signals.energyStress}</div>
              <div className="text-[9px] text-eco-400 mt-0.5">Stress Index</div>
            </div>
            <div className="p-2.5 bg-eco-850 border border-eco-750 rounded">
              <div className="text-[10px] text-eco-400 uppercase">Heat</div>
              <div className="text-xl font-bold text-eco-100 mt-1">{selectedLocation.signals.heatStress}</div>
              <div className="text-[9px] text-eco-400 mt-0.5">Stress Index</div>
            </div>
            <div className="p-2.5 bg-eco-850 border border-eco-750 rounded">
              <div className="text-[10px] text-eco-400 uppercase">Community</div>
              <div className="text-xl font-bold text-eco-100 mt-1">{selectedLocation.signals.communitySignal}</div>
              <div className="text-[9px] text-eco-400 mt-0.5">Signal Index</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-eco-300 pt-2 border-t border-eco-750">
            <span>Surface Temp: {selectedLocation.signals.temperatureC}°C</span>
            <Link href="/app/climate" className="text-eco-200 hover:text-eco-50 flex items-center gap-1 font-mono text-[11px]">
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
