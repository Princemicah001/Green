'use client';

import React from 'react';
import { RotateCw, MapPin, Building2, MessageSquare } from 'lucide-react';
import { EnvironmentalStatus } from '@/types';

interface GlobeControlsProps {
  showFacilities: boolean;
  setShowFacilities: (val: boolean) => void;
  showCommunitySignals: boolean;
  setShowCommunitySignals: (val: boolean) => void;
  showClimateStress: boolean;
  setShowClimateStress: (val: boolean) => void;
  filterStatus: EnvironmentalStatus | 'ALL';
  setFilterStatus: (val: EnvironmentalStatus | 'ALL') => void;
  onResetFocus: () => void;
}

export default function GlobeControls({
  showFacilities,
  setShowFacilities,
  showCommunitySignals,
  setShowCommunitySignals,
  showClimateStress,
  setShowClimateStress,
  filterStatus,
  setFilterStatus,
  onResetFocus,
}: GlobeControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-eco-900/90 border border-eco-700/80 backdrop-blur-md rounded shadow-lg text-xs md:text-sm">
      {/* Layer Toggles */}
      <button
        onClick={() => setShowClimateStress(!showClimateStress)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
          showClimateStress ? 'bg-eco-750 text-eco-50 font-semibold' : 'text-eco-300 hover:text-eco-100'
        }`}
        title="Toggle Regional Climate Stress Layer"
      >
        <MapPin className="w-4 h-4 text-status-stressed" />
        <span>Climate</span>
      </button>

      <button
        onClick={() => setShowFacilities(!showFacilities)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
          showFacilities ? 'bg-eco-750 text-eco-50 font-semibold' : 'text-eco-300 hover:text-eco-100'
        }`}
        title="Toggle Infrastructure Facilities (◎)"
      >
        <Building2 className="w-4 h-4 text-eco-300" />
        <span>Facilities</span>
      </button>

      <button
        onClick={() => setShowCommunitySignals(!showCommunitySignals)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors ${
          showCommunitySignals ? 'bg-eco-750 text-eco-50 font-semibold' : 'text-eco-300 hover:text-eco-100'
        }`}
        title="Toggle Community Observation Points"
      >
        <MessageSquare className="w-4 h-4 text-eco-300" />
        <span>Community</span>
      </button>

      <div className="w-[1px] h-5 bg-eco-700 mx-1" />

      {/* Filter by Status */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as EnvironmentalStatus | 'ALL')}
        className="bg-eco-800 text-eco-100 border border-eco-700 rounded px-2.5 py-1 text-xs font-mono outline-none focus:border-eco-500 cursor-pointer font-medium"
      >
        <option value="ALL">Status: All</option>
        <option value="CRITICAL">Critical Only</option>
        <option value="STRESSED">Stressed Only</option>
        <option value="WATCH">Watch Only</option>
        <option value="HEALTHY">Healthy Only</option>
      </select>

      <div className="w-[1px] h-5 bg-eco-700 mx-1" />

      {/* Recenter Button */}
      <button
        onClick={onResetFocus}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-eco-300 hover:text-eco-50 hover:bg-eco-800 transition-colors font-mono text-xs"
        title="Recenter camera on East Africa primary basin"
      >
        <RotateCw className="w-4 h-4" />
        <span>Recenter</span>
      </button>
    </div>
  );
}
