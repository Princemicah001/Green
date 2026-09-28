'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useSentinel } from '@/lib/store/sentinelStore';
import GlobeControls from '@/components/globe/GlobeControls';
import DigitalTwinPanel from '@/components/digital-twin/DigitalTwinPanel';
import { EnvironmentalStatus } from '@/types';
import { Eye } from 'lucide-react';

const SentinelGlobe = dynamic(() => import('@/components/globe/SentinelGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-400 font-sans text-sm">
      Initializing 3D Sentinel Earth...
    </div>
  ),
});

export default function GlobePage() {
  const { 
    locations, 
    facilities, 
    communityReports, 
    selectedLocationId, 
    selectedLocation, 
    setSelectedLocationId 
  } = useSentinel();

  const [showFacilities, setShowFacilities] = useState(true);
  const [showCommunitySignals, setShowCommunitySignals] = useState(true);
  const [showClimateStress, setShowClimateStress] = useState(true);
  const [filterStatus, setFilterStatus] = useState<EnvironmentalStatus | 'ALL'>('ALL');
  const [isTwinDrawerOpen, setIsTwinDrawerOpen] = useState(true);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex flex-col overflow-hidden font-sans">
      {/* Overlay Header Controls */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-3">
        <div className="p-4 sm:p-5 bg-white/90 dark:bg-eco-900/95 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-card text-apple-text dark:text-eco-50 max-w-sm">
          <div className="text-xs text-apple-muted dark:text-eco-400 uppercase tracking-wider font-semibold font-mono">Spatial Observation Engine</div>
          <div className="text-lg font-bold text-apple-text dark:text-eco-50 mt-1">Sentinel 3D Geospatial Mesh</div>
          <div className="text-xs sm:text-sm text-apple-secondary dark:text-eco-300 mt-1 font-medium">
            Monitoring {locations.length} basins • {facilities.length} critical infrastructure facilities
          </div>
        </div>

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

      {/* Fly-to Location Quick List Bar (Top Right) */}
      <div className="absolute top-5 right-5 z-20 hidden md:flex items-center gap-1.5 p-2 bg-white/90 dark:bg-eco-900/95 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-card text-xs">
        <span className="text-xs text-apple-muted dark:text-eco-400 px-2 font-mono uppercase font-bold">Fly To:</span>
        {locations.map(loc => (
          <button
            key={loc.id}
            onClick={() => setSelectedLocationId(loc.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              loc.id === selectedLocationId
                ? 'bg-env-emerald text-white font-semibold shadow-sm'
                : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Full Workspace 3D Globe */}
      <div className="w-full h-full">
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

      {/* Floating Collapsible Digital Twin Drawer (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-20 w-88 md:w-[420px] max-h-[85vh] overflow-y-auto">
        {isTwinDrawerOpen ? (
          <div className="relative">
            <button
              onClick={() => setIsTwinDrawerOpen(false)}
              className="absolute top-4 right-4 z-30 text-xs font-sans text-apple-muted hover:text-apple-text dark:text-eco-300 dark:hover:text-eco-50 bg-apple-subtle hover:bg-apple-hover dark:bg-eco-800/90 px-3 py-1 rounded-xl border border-apple-border dark:border-eco-700 font-semibold shadow-sm"
            >
              Minimize
            </button>
            <DigitalTwinPanel location={selectedLocation} />
          </div>
        ) : (
          <button
            onClick={() => setIsTwinDrawerOpen(true)}
            className="px-5 py-3 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 text-apple-text dark:text-eco-100 text-sm font-medium rounded-2xl shadow-apple-hover hover:scale-105 transition-all flex items-center gap-2.5"
          >
            <Eye className="w-4 h-4 text-env-emerald" />
            <span>Open {selectedLocation.name} Twin</span>
          </button>
        )}
      </div>
    </div>
  );
}
