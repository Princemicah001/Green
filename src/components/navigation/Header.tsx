'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSentinel } from '@/lib/store/sentinelStore';
import { 
  Bell, 
  Search, 
  Play, 
  RotateCcw, 
  ChevronDown, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ExternalLink 
} from 'lucide-react';

export default function Header() {
  const { 
    selectedLocationId, 
    setSelectedLocationId, 
    locations, 
    alerts, 
    demoStep, 
    runNextDemoStep, 
    resetDemoScenario,
    systemStatus,
    theme,
    toggleTheme,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useSentinel();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const scenarioStepLabels = [
    'Ready: Nairobi Initial',
    'Step 1: Community Surge',
    'Step 2: Heat Spike (Critical)',
    'Step 3: Mitigated Response',
  ];

  const filteredLocations = searchQuery.trim() 
    ? locations.filter(l => 
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="h-16 border-b border-apple-border dark:border-eco-700 bg-white/90 dark:bg-eco-950/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between select-none z-30 sticky top-0 transition-colors">
      {/* Brand & Mobile Menu Toggle */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-850 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Link */}
        <Link href="/app" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-env-emerald/10 dark:bg-env-emerald/20 border border-env-emerald/30 flex items-center justify-center text-env-emerald group-hover:scale-105 transition-all">
            <span className="text-sm font-mono font-bold leading-none">E</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-apple-text dark:text-eco-50 uppercase font-sans">ECO-SHIELD</span>
              <span className="text-xs font-mono text-apple-muted dark:text-eco-400">/</span>
              <span className="text-sm text-apple-secondary dark:text-eco-300 font-medium hidden sm:inline">Sentinel Network</span>
            </div>
            <span className="text-xs font-mono text-apple-muted dark:text-eco-400 tracking-wide hidden sm:block">Environmental Intelligence</span>
          </div>
        </Link>

        {/* Operational Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-750 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-env-emerald animate-pulse" />
          <span className="text-apple-text dark:text-eco-200 font-medium">SYSTEM OPERATIONAL</span>
          <span className="text-apple-border dark:text-eco-600">|</span>
          <span className="text-apple-secondary dark:text-eco-400 font-sans">{systemStatus.environmentMode}</span>
        </div>
      </div>

      {/* Center: Guided Scenario Controller (Interactive Demo Bar) */}
      <div className="hidden lg:flex items-center gap-3 bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-full px-4 py-1.5 shadow-apple-sm">
        <span className="text-xs font-mono text-apple-secondary dark:text-eco-400 uppercase tracking-wider font-semibold">Demo Scenario:</span>
        <span className="font-sans text-apple-text dark:text-eco-100 text-xs font-semibold">
          {scenarioStepLabels[demoStep] || 'Scenario Completed'}
        </span>
        
        <button
          onClick={runNextDemoStep}
          className="ml-2 flex items-center gap-1.5 px-3 py-1 bg-env-emerald hover:bg-env-forest text-white rounded-full font-sans text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="Advance to next step in the demonstration scenario"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{demoStep === 0 ? 'Start Scenario' : (demoStep >= 3 ? 'Reset Scenario' : 'Next Step')}</span>
        </button>

        {demoStep > 0 && (
          <button
            onClick={resetDemoScenario}
            className="p-1 text-apple-muted dark:text-eco-400 hover:text-apple-text dark:hover:text-eco-100 transition-colors"
            title="Reset scenario to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: Location Selector, Search, Theme Toggle, Alerts, Public Link */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Location Selector */}
        <div className="relative">
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="bg-apple-subtle dark:bg-eco-900 text-apple-text dark:text-eco-100 border border-apple-border dark:border-eco-700 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium outline-none focus:border-env-emerald cursor-pointer appearance-none pr-8 transition-colors"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id} className="bg-white dark:bg-eco-900 text-apple-text dark:text-eco-100">
                {loc.name} ({loc.status})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-apple-muted dark:text-eco-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block">
          <div className="flex items-center bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-xl px-3 py-1.5 text-xs text-apple-secondary dark:text-eco-300 w-40 lg:w-56 focus-within:w-64 focus-within:border-env-emerald transition-all shadow-apple-sm">
            <Search className="w-4 h-4 mr-2 text-apple-muted dark:text-eco-400 shrink-0" />
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
              className="bg-transparent border-none outline-none w-full text-apple-text dark:text-eco-100 placeholder:text-apple-muted dark:placeholder:text-eco-500 text-xs sm:text-sm"
            />
          </div>

          {isSearchOpen && filteredLocations.length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-2xl shadow-apple-card py-2 z-50">
              <div className="text-xs font-mono text-apple-muted dark:text-eco-400 px-4 py-1 uppercase font-semibold">Basins & Regions</div>
              {filteredLocations.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocationId(loc.id);
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-apple-subtle dark:hover:bg-eco-800 text-sm flex items-center justify-between text-apple-text dark:text-eco-100 font-sans"
                >
                  <span className="font-medium">{loc.name}, {loc.country}</span>
                  <span className="text-xs font-mono text-apple-muted dark:text-eco-400 font-semibold">{loc.overallStress}/100</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Apple Style Light / Dark Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-100 bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-xl transition-all shadow-apple-sm"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-apple-secondary hover:text-apple-text" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300" />
          )}
        </button>

        {/* Alerts Link & Counter */}
        <Link
          href="/app/alerts"
          className="relative p-2 text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-50 bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-xl transition-all shadow-apple-sm"
          title="Active Sentinel Alerts"
        >
          <Bell className="w-4 h-4" />
          {unacknowledgedAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-status-critical text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unacknowledgedAlerts.length}
            </span>
          )}
        </Link>

        {/* Public Website Switcher */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-xs font-sans font-medium text-apple-secondary dark:text-eco-400 hover:text-env-emerald dark:hover:text-eco-200 px-3 py-1.5 rounded-xl border border-apple-border dark:border-eco-700 bg-apple-subtle dark:bg-eco-900 transition-colors shadow-apple-sm"
        >
          <span>Public Portal</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </Link>
      </div>
    </header>
  );
}
