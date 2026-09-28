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
    <div className="w-full h-full flex items-center justify-center bg-eco-950 text-eco-400 font-mono text-sm">
      Mounting Sentinel 3D Spatial Canvas...
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
    <div className="relative w-full h-[calc(100vh-4rem)] bg-eco-950 flex flex-col overflow-hidden">
      {/* Overlay Header Controls */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2.5">
        <div className="p-4 bg-eco-900/95 border border-eco-700/80 backdrop-blur-md rounded shadow-xl font-mono text-sm max-w-sm">
          <div className="text-xs text-eco-400 uppercase tracking-wider font-semibold">Spatial Observation Engine</div>
          <div className="text-base font-bold text-eco-50 mt-1">Sentinel Geospatial Mesh</div>
          <div className="text-xs text-eco-300 mt-1 font-medium">
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
      <div className="absolute top-5 right-5 z-20 hidden md:flex items-center gap-2 p-2 bg-eco-900/95 border border-eco-700/80 backdrop-blur-md rounded shadow-xl font-mono text-xs">
        <span className="text-xs text-eco-400 px-2 uppercase font-bold">Fly To:</span>
        {locations.map(loc => (
          <button
            key={loc.id}
            onClick={() => setSelectedLocationId(loc.id)}
            className={`px-3 py-1.5 rounded transition-colors ${
              loc.id === selectedLocationId
                ? 'bg-eco-750 text-eco-50 font-bold border border-eco-600'
                : 'text-eco-300 hover:text-eco-100 hover:bg-eco-800 font-medium'
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
              className="absolute top-3.5 right-3.5 z-30 text-xs font-mono text-eco-300 hover:text-eco-50 bg-eco-800/90 px-2.5 py-1 rounded border border-eco-700 font-semibold"
            >
              Minimize
            </button>
            <DigitalTwinPanel location={selectedLocation} />
          </div>
        ) : (
          <button
            onClick={() => setIsTwinDrawerOpen(true)}
            className="px-5 py-2.5 bg-eco-900 border border-eco-700 text-eco-100 font-mono text-sm rounded shadow-2xl hover:bg-eco-850 transition-colors flex items-center gap-2.5 font-bold"
          >
            <Eye className="w-4 h-4" />
            <span>Open {selectedLocation.name} Twin</span>
          </button>
        )}
      </div>
    </div>
  );
}
