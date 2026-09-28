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
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/90 dark:bg-eco-900/90 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-sm text-xs sm:text-sm">
      {/* Layer Toggles */}
      <button
        onClick={() => setShowClimateStress(!showClimateStress)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-medium ${
          showClimateStress 
            ? 'bg-env-amber/15 text-env-amber border border-env-amber/30 font-semibold shadow-sm' 
            : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
        }`}
        title="Toggle Regional Climate Stress Layer"
      >
        <MapPin className="w-3.5 h-3.5" />
        <span>Climate</span>
      </button>

      <button
        onClick={() => setShowFacilities(!showFacilities)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-medium ${
          showFacilities 
            ? 'bg-env-emerald/15 text-env-emerald border border-env-emerald/30 font-semibold shadow-sm' 
            : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
        }`}
        title="Toggle Infrastructure Facilities (◎)"
      >
        <Building2 className="w-3.5 h-3.5" />
        <span>Facilities</span>
      </button>

      <button
        onClick={() => setShowCommunitySignals(!showCommunitySignals)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-medium ${
          showCommunitySignals 
            ? 'bg-env-sky/15 text-env-sky border border-env-sky/30 font-semibold shadow-sm' 
            : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
        }`}
        title="Toggle Community Observation Points"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Community</span>
      </button>

      <div className="w-[1px] h-4 bg-apple-border dark:bg-eco-700 mx-0.5" />

      {/* Filter by Status */}
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as EnvironmentalStatus | 'ALL')}
        className="bg-apple-subtle dark:bg-eco-800 text-apple-text dark:text-eco-100 border border-apple-border dark:border-eco-700 rounded-xl px-2.5 py-1 text-xs font-sans outline-none focus:border-env-emerald cursor-pointer font-medium"
      >
        <option value="ALL">Status: All</option>
        <option value="CRITICAL">Critical Only</option>
        <option value="STRESSED">Stressed Only</option>
        <option value="WATCH">Watch Only</option>
        <option value="HEALTHY">Healthy Only</option>
      </select>

      <div className="w-[1px] h-4 bg-apple-border dark:bg-eco-700 mx-0.5" />

      {/* Recenter Button */}
      <button
        onClick={onResetFocus}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-50 hover:bg-apple-subtle dark:hover:bg-eco-800 transition-colors text-xs font-medium"
        title="Recenter camera on East Africa primary basin"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Recenter</span>
      </button>
    </div>
  );
}
