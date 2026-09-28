'use client';

import React from 'react';
import { Layers, RotateCw, MapPin, Building2, MessageSquare, ShieldAlert } from 'lucide-react';
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
    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-eco-900/90 border border-eco-700/80 backdrop-blur-md rounded shadow-lg text-xs">
      {/* Layer Toggles */}
      <button
        onClick={() => setShowClimateStress(!showClimateStress)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
          showClimateStress ? 'bg-eco-750 text-eco-50 font-medium' : 'text-eco-400 hover:text-eco-200'
        }`}
        title="Toggle Regional Climate Stress Layer"
      >
        <MapPin className="w-3.5 h-3.5 text-status-stressed" />
        <span>Climate</span>
      </button>

      <button
        onClick={() => setShowFacilities(!showFacilities)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
          showFacilities ? 'bg-eco-750 text-eco-50 font-medium' : 'text-eco-400 hover:text-eco-200'
        }`}
        title="Toggle Infrastructure Facilities (◎)"
      >
        <Building2 className="w-3.5 h-3.5 text-eco-300" />
        <span>Facilities</span>
      </button>

      <button
        onClick={() => setShowCommunitySignals(!showCommunitySignals)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
          showCommunitySignals ? 'bg-eco-750 text-eco-50 font-medium' : 'text-eco-400 hover:text-eco-200'
        }`}
        title="Toggle Community Observation Points"
      >
        <MessageSquare className="w-3.5 h-3.5 text-eco-300" />
        <span>Community</span>
      </button>

      <div className="w-[1px] h-4 bg-eco-700 mx-1" />

      {/* Filter by Status */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as EnvironmentalStatus | 'ALL')}
        className="bg-eco-800 text-eco-100 border border-eco-700 rounded px-2 py-0.5 text-xs outline-none focus:border-eco-500 cursor-pointer font-mono"
      >
        <option value="ALL">Status: All</option>
        <option value="CRITICAL">Critical Only</option>
        <option value="STRESSED">Stressed Only</option>
        <option value="WATCH">Watch Only</option>
        <option value="HEALTHY">Healthy Only</option>
      </select>

      <div className="w-[1px] h-4 bg-eco-700 mx-1" />

      {/* Recenter Button */}
      <button
        onClick={onResetFocus}
        className="flex items-center gap-1 px-2 py-1 rounded text-eco-300 hover:text-eco-50 hover:bg-eco-800 transition-colors"
        title="Recenter camera on East Africa primary basin"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span>Recenter</span>
      </button>
    </div>
  );
}
