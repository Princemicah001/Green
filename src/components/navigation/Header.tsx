'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSentinel } from '@/lib/store/sentinelStore';
import { Bell, Search, Play, RotateCcw, ChevronDown } from 'lucide-react';

export default function Header() {
  const { 
    selectedLocationId, 
    setSelectedLocationId, 
    locations, 
    alerts, 
    demoStep, 
    runNextDemoStep, 
    resetDemoScenario,
    systemStatus 
  } = useSentinel();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const scenarioStepLabels = [
    'Scenario: Ready (Nairobi Initial)',
    'Scenario: Step 1 (Community Surge)',
    'Scenario: Step 2 (Heat Spike / Critical)',
    'Scenario: Step 3 (Mitigated Response)',
  ];

  const filteredLocations = searchQuery.trim() 
    ? locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.country.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="h-16 border-b border-eco-700 bg-eco-950/95 backdrop-blur-md px-5 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Brand & Platform Identity */}
      <div className="flex items-center gap-6">
        <Link href="/app" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded border border-eco-600 bg-eco-850 flex items-center justify-center text-eco-100 group-hover:border-eco-400 transition-colors">
            <span className="text-sm font-mono font-bold leading-none">E</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider text-eco-50 uppercase font-mono">ECO-SHIELD</span>
              <span className="text-xs font-mono text-eco-400">/</span>
              <span className="text-sm text-eco-300 font-medium">Sentinel Network</span>
            </div>
            <span className="text-xs font-mono text-eco-400 tracking-wide">Environmental Intelligence</span>
          </div>
        </Link>

        {/* System Status Pill */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1 bg-eco-900 border border-eco-750 rounded text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-status-healthy animate-pulse" />
          <span className="text-eco-200 font-medium">SYSTEM OPERATIONAL</span>
          <span className="text-eco-600">|</span>
          <span className="text-eco-400">{systemStatus.environmentMode}</span>
        </div>
      </div>

      {/* Center / Guided Demonstration Scenario Controller (Section 45) */}
      <div className="hidden lg:flex items-center gap-2.5 bg-eco-900 border border-eco-700/80 rounded px-3.5 py-1.5 text-xs">
        <span className="text-xs font-mono text-eco-400 uppercase tracking-wider font-semibold">Demo Scenario:</span>
        <span className="font-mono text-eco-100 text-xs font-medium">
          {scenarioStepLabels[demoStep] || 'Completed'}
        </span>
        
        <button
          onClick={runNextDemoStep}
          className="ml-2 flex items-center gap-1.5 px-3 py-1 bg-eco-750 hover:bg-eco-700 text-eco-50 border border-eco-600 rounded font-mono text-xs font-semibold transition-colors"
          title="Advance to next step in the demonstration scenario"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{demoStep === 0 ? 'Start Scenario' : (demoStep >= 3 ? 'Reset Scenario' : 'Next Step')}</span>
        </button>

        {demoStep > 0 && (
          <button
            onClick={resetDemoScenario}
            className="p-1 text-eco-400 hover:text-eco-100 transition-colors"
            title="Reset scenario to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: Location Selector, Search, Alerts, Navigation */}
      <div className="flex items-center gap-3.5">
        {/* Quick Location Dropdown */}
        <div className="relative">
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="bg-eco-900 text-eco-100 border border-eco-700 rounded px-3 py-1.5 text-xs font-mono outline-none focus:border-eco-500 cursor-pointer appearance-none pr-8"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.status})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-eco-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block">
          <div className="flex items-center bg-eco-900 border border-eco-700 rounded px-3 py-1.5 text-xs text-eco-300 w-48 focus-within:w-64 focus-within:border-eco-500 transition-all">
            <Search className="w-4 h-4 mr-2 text-eco-400 shrink-0" />
            <input
              type="text"
              placeholder="Search basins, facilities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              className="bg-transparent border-none outline-none w-full text-eco-100 placeholder:text-eco-500 text-xs"
            />
          </div>

          {isSearchOpen && filteredLocations.length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-eco-900 border border-eco-700 rounded shadow-2xl py-1.5 z-50">
              <div className="text-xs font-mono text-eco-400 px-3.5 py-1 uppercase font-semibold">Locations</div>
              {filteredLocations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocationId(loc.id);
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-eco-800 text-xs flex items-center justify-between text-eco-100 font-mono"
                >
                  <span>{loc.name}, {loc.country}</span>
                  <span className="text-xs text-eco-400 font-semibold">{loc.overallStress}/100</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerts Link & Counter */}
        <Link
          href="/app/alerts"
          className="relative p-2 text-eco-300 hover:text-eco-50 hover:bg-eco-850 rounded transition-colors"
          title="Active Sentinel Alerts"
        >
          <Bell className="w-5 h-5" />
          {unacknowledgedAlerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-status-critical" />
          )}
        </Link>

        {/* Public Website Switcher */}
        <Link
          href="/"
          className="text-xs font-mono text-eco-400 hover:text-eco-200 px-2.5 py-1.5 rounded transition-colors hidden md:block"
        >
          Public Portal →
        </Link>
      </div>
    </header>
  );
}
