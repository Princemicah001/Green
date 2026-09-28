'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { INITIAL_LOCATIONS } from '@/data/locations';
import { INITIAL_FACILITIES } from '@/data/facilities';
import { INITIAL_COMMUNITY_REPORTS } from '@/data/communityReports';
import { 
  ArrowRight, 
  Building2, 
  Users, 
  CloudRain, 
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
  Radio,
  Sliders,
  ShieldCheck,
  ChevronRight,
  Droplets,
  Zap,
  Globe2
} from 'lucide-react';

// Dynamic import of 3D globe for zero SSR hydration mismatch
const SentinelGlobe = dynamic(() => import('@/components/globe/SentinelGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-400 font-sans text-sm">
      Initializing 3D Sentinel Earth...
    </div>
  ),
});

export default function LandingPage() {
  const [selectedLocId, setSelectedLocId] = useState('nairobi');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Interactive mitigation preview simulator on the home page
  const [closedLoopEnabled, setClosedLoopEnabled] = useState(true);
  const [batchSheddingEnabled, setBatchSheddingEnabled] = useState(true);

  // Live telemetry pulse ticker
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerItems = [
    '● NAIROBI BASIN: Ambient 28.4°C | Aquifer Drawdown Tracked | Copernicus Tile 37M Validated',
    '● OLKARIA GEOTHERMAL NODE: PUE 1.18 | Zero-Carbon Renewable Compute Load 88% | Loop Active',
    '● MOMBASA LANDING HUB: Subsea Cable Telemetry Steady | Grid Stability 99.4% | Normal Operations',
    '● GROUND OBSERVATION: Anonymous field water report verified against satellite multi-spectral radiance',
    '● SENTINEL ENGINE: 8 Regional digital twins recalculated in <45s | System fully operational',
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('eco_shield_theme') as 'light' | 'dark' | null;
      if (stored) {
        setTheme(stored);
        if (stored === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
    } catch {}

    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [tickerItems.length]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('eco_shield_theme', next);
      if (next === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch {}
  };

  const selectedLocation = INITIAL_LOCATIONS.find(l => l.id === selectedLocId) || INITIAL_LOCATIONS[0];

  // Dynamic calculated mitigation values for the interactive sandbox
  const simulatedStressRelief = (closedLoopEnabled ? 8 : 0) + (batchSheddingEnabled ? 5 : 0);
  const afterStress = Math.max(45, 82 - simulatedStressRelief);
  const waterReductionPct = closedLoopEnabled ? 18 : 0;
  const powerReductionPct = batchSheddingEnabled ? 10 : 0;

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text dark:bg-eco-950 dark:text-eco-50 flex flex-col font-sans selection:bg-env-emerald selection:text-white transition-colors">
      
      {/* Live Operational Telemetry Ticker Ribbon */}
      <div className="bg-white/95 dark:bg-eco-900 border-b border-apple-border dark:border-eco-800 px-4 sm:px-8 py-2 text-xs font-mono flex items-center justify-between overflow-hidden shadow-apple-sm z-50">
        <div className="flex items-center gap-2.5 truncate max-w-[85vw] sm:max-w-none">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-env-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-env-emerald" />
          </span>
          <span className="text-apple-muted dark:text-eco-400 uppercase font-semibold hidden md:inline">
            LIVE SENTINEL MESH:
          </span>
          <span className="text-apple-text dark:text-eco-200 transition-all duration-500 font-medium">
            {tickerItems[tickerIndex]}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-apple-muted dark:text-eco-400 shrink-0">
          <span>LATENCY: <strong className="text-env-emerald font-semibold">14ms</strong></span>
          <span>•</span>
          <span>ISO 14064 READY</span>
        </div>
      </div>

      {/* Top Apple Navigation Bar */}
      <nav className="h-20 border-b border-apple-border dark:border-eco-700/60 bg-white/80 dark:bg-eco-950/80 backdrop-blur-xl px-5 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-env-emerald/10 border border-env-emerald/30 flex items-center justify-center text-env-emerald font-bold text-lg shadow-sm">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-apple-text dark:text-eco-50 uppercase font-sans">ECO-SHIELD</span>
            <span className="text-xs font-mono text-apple-muted dark:text-eco-400">Sentinel Network</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-sm lg:text-base font-medium text-apple-secondary dark:text-eco-300">
          <a href="#pillars" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Data Pillars</a>
          <a href="#architecture" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Architecture</a>
          <a href="#intelligence" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Mitigation Engine</a>
          <a href="#partners" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Stakeholders</a>
          <Link href="/app/api-docs" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">API Specs</Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-100 bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-2xl transition-all shadow-apple-sm"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <Link
            href="/app"
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-env-emerald hover:bg-env-forest text-white font-medium text-sm sm:text-base rounded-2xl transition-all shadow-apple-sm active:scale-95"
          >
            <span>Launch Sentinel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section: Full Viewport Width on Wide Screens */}
      <section className="relative px-5 sm:px-10 lg:px-14 xl:px-16 pt-12 sm:pt-16 pb-20 border-b border-apple-border dark:border-eco-750 overflow-hidden w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          
          {/* Left Column: Hero Copy & Active Indicators */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-env-emerald/10 border border-env-emerald/20 rounded-full text-xs font-semibold text-env-emerald">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CRITICAL INFRASTRUCTURE INTELLIGENCE</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-apple-text dark:text-eco-50 leading-[1.12]">
                Environmental intelligence for critical infrastructure.
              </h1>
              <p className="text-lg sm:text-xl text-apple-secondary dark:text-eco-300 leading-relaxed font-normal font-sans">
                Connecting climate data, infrastructure telemetry, and community observations to detect environmental and resource stress before it becomes an operational crisis.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-sm sm:text-base font-medium">
              <Link
                href="/app"
                className="flex items-center gap-2 px-6 py-3.5 bg-apple-text text-white hover:bg-black dark:bg-eco-50 dark:text-eco-950 dark:hover:bg-eco-200 font-semibold rounded-2xl transition-all shadow-apple-sm hover:scale-[1.02] active:scale-95"
              >
                <span>Explore Sentinel</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="#architecture"
                className="px-6 py-3.5 bg-white dark:bg-eco-900 hover:bg-apple-subtle dark:hover:bg-eco-850 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700 rounded-2xl transition-all shadow-apple-sm"
              >
                System Overview
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-apple-border dark:border-eco-800 grid grid-cols-3 gap-6 text-sm font-sans">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 font-mono">3-Domain</div>
                <div className="text-xs text-apple-muted dark:text-eco-400 font-medium">Unified Sensor Mesh</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-env-emerald font-mono">&lt;60s</div>
                <div className="text-xs text-apple-muted dark:text-eco-400 font-medium">Stress Recalculation</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 font-mono">Zero-PII</div>
                <div className="text-xs text-apple-muted dark:text-eco-400 font-medium">Ground Verification</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero 3D Globe with Interactive Region Fly-to */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="h-[460px] sm:h-[540px] md:h-[620px] xl:h-[680px] w-full rounded-3xl border border-apple-border dark:border-eco-700 bg-slate-950 relative overflow-hidden shadow-apple-card">
              <SentinelGlobe
                locations={INITIAL_LOCATIONS}
                facilities={INITIAL_FACILITIES}
                communityReports={INITIAL_COMMUNITY_REPORTS}
                selectedLocationId={selectedLocId}
                onSelectLocation={(id) => setSelectedLocId(id)}
                autoRotateSpeed={0.25}
              />

              {/* Floating Real-Time Region Focus Badge */}
              <div className="absolute top-5 left-5 z-20 p-4 sm:p-5 bg-white/90 dark:bg-eco-900/95 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-card text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-env-emerald animate-pulse" />
                  <span className="text-xs text-apple-muted dark:text-eco-400 uppercase tracking-wider font-semibold font-mono">Active Digital Twin</span>
                </div>
                <div className="font-bold text-apple-text dark:text-eco-50 text-base sm:text-lg">
                  {selectedLocation.name}, {selectedLocation.country}
                </div>
                <div className="text-xs font-mono text-apple-secondary dark:text-eco-300 pt-0.5">
                  Stress: <strong className="text-status-stressed font-bold">{selectedLocation.overallStress}/100</strong> • Water: {selectedLocation.signals.waterStress} • Heat: {selectedLocation.signals.heatStress}
                </div>
              </div>

              {/* Fly-to Interactive Region Capsule */}
              <div className="absolute bottom-5 left-5 right-5 z-20 hidden sm:flex items-center justify-between p-2.5 bg-white/90 dark:bg-eco-900/95 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-card text-xs">
                <div className="flex items-center gap-1.5 font-medium text-apple-muted dark:text-eco-400 px-2">
                  <Globe2 className="w-3.5 h-3.5 text-env-emerald" />
                  <span>Explore Regions:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {INITIAL_LOCATIONS.slice(0, 5).map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedLocId(loc.id)}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        loc.id === selectedLocId
                          ? 'bg-env-emerald text-white font-semibold shadow-sm'
                          : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* The Three Data Pillars with Apple 3D Illustrations */}
      <section id="pillars" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-20 sm:py-24 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="space-y-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Data Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              Three Interconnected Data Domains
            </h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300 font-sans">
              Eco-Shield synchronizes disparate multi-frequency telemetry layers into one coherent, predictive intelligence plane.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Climate */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/satellite.jpg"
                  alt="Copernicus Sentinel Satellite"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-sky uppercase font-mono">
                    <CloudRain className="w-4 h-4" />
                    <span>Domain 01</span>
                  </div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                    Climate & Hydrological
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Copernicus Sentinel-2 & Sentinel-3 satellite radiance, ERA5 atmospheric reanalysis, 10-year seasonal rainfall baselines, and soil moisture anomaly vectors.
                  </p>
                </div>
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Inputs: Surface Radiance, Precipitation Deficit, Drought Indices
                </div>
              </div>
            </div>

            {/* Pillar 2: Infrastructure */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/datacenter.jpg"
                  alt="Sustainable Green Data Center"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-emerald uppercase font-mono">
                    <Building2 className="w-4 h-4" />
                    <span>Domain 02</span>
                  </div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                    Critical Infrastructure
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Data center BMS telemetry, SCADA power grid stability feeds, cooling loop evaporative water draw, and geothermal loop operational loads.
                  </p>
                </div>
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Inputs: Compute Load, Power MW, Water ML/day, PUE
                </div>
              </div>
            </div>

            {/* Pillar 3: Community */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/community.jpg"
                  alt="Community Environmental Water Monitoring"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-amber uppercase font-mono">
                    <Users className="w-4 h-4" />
                    <span>Domain 03</span>
                  </div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                    Community Ground Signals
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Decentralized observations from rangers, borehole operators, and local water stewards. Cryptographically anonymized with fuzzed coordinates to protect privacy.
                  </p>
                </div>
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Inputs: Aquifer Pressure, Grid Fluctuation, Thermal Heat
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Flow Section */}
      <section id="architecture" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-20 sm:py-24 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">System Flow</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              Data Pipeline & Intelligence Engine
            </h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300">
              From raw heterogeneous telemetry to deterministic operational decisions.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card font-mono text-sm overflow-x-auto">
            <pre className="text-apple-secondary dark:text-eco-300 text-xs sm:text-sm leading-relaxed">
{`DATA SOURCES
  ├── Climate APIs (ERA5 / ECMWF / NOAA)
  ├── Satellite Imagery (Copernicus Sentinel-2/3)
  ├── Infrastructure Telemetry (SCADA / BMS / Power / Water)
  └── Community Ground Observations (Zero-PII Token Protocol)
          │
          ▼
    DATA INGESTION & PROTOCOL ADAPTERS
          │
          ▼
    NORMALIZATION & COORDINATE FUZZING (~1.2km)
          │
          ▼
    MULTI-VARIATE ANOMALY DETECTION (Z-Score vs 10-Yr Baselines)
          │
          ▼
    ENVIRONMENTAL STRESS ENGINE (Weighted Cross-Domain Aggregation)
          │
    ┌─────┴────────────────────────┐
    ▼                              ▼                              ▼
TREND TRAJECTORY             ALERT ENGINE                  MITIGATION SIMULATOR
(90-Day Moving Baseline)     (Multi-Vector Thresholds)     (Load Shifting & Closed-Loop)
          │                              │                              │
          └──────────────────────────────┼──────────────────────────────┘
                                         ▼
                            ECO-SHIELD REST & WEBSOCKET API
                                         ▼
                    SENTINEL ENTERPRISE COMMAND WORKSPACE`}
            </pre>
          </div>
        </div>
      </section>

      {/* Interactive Predictive Mitigation Engine with Live Controls */}
      <section id="intelligence" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-20 sm:py-24 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Intelligence Engine</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              Predictive mitigation, not reactive crisis management.
            </h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300 font-sans leading-relaxed">
              When regional environmental stress crosses operational thresholds, the Eco-Shield Mitigation Engine generates mathematically validated operational recommendations: shifting non-critical batch workloads to renewable geothermal facilities, switching cooling towers to closed-circuit economizers, and optimizing chilled water setpoints.
            </p>

            {/* Interactive Control Toggles */}
            <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-2xl shadow-apple-card space-y-3">
              <div className="text-xs font-mono uppercase text-apple-muted dark:text-eco-400 font-semibold">
                Interactive Mitigation Sandbox:
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setClosedLoopEnabled(!closedLoopEnabled)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                    closedLoopEnabled
                      ? 'bg-env-emerald/10 border-env-emerald text-env-emerald font-semibold shadow-sm'
                      : 'bg-apple-subtle dark:bg-eco-800 border-apple-border dark:border-eco-700 text-apple-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    <span>Closed-Loop Cooling</span>
                  </div>
                  <span className="text-xs font-mono ml-2 font-bold">{closedLoopEnabled ? 'ON (-18%)' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setBatchSheddingEnabled(!batchSheddingEnabled)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                    batchSheddingEnabled
                      ? 'bg-env-emerald/10 border-env-emerald text-env-emerald font-semibold shadow-sm'
                      : 'bg-apple-subtle dark:bg-eco-800 border-apple-border dark:border-eco-700 text-apple-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Batch Job Shedding</span>
                  </div>
                  <span className="text-xs font-mono ml-2 font-bold">{batchSheddingEnabled ? 'ON (-10%)' : 'OFF'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 font-sans text-sm sm:text-base pt-1">
              <div className="flex items-center gap-3 text-apple-text dark:text-eco-200">
                <CheckCircle2 className="w-5 h-5 text-env-emerald shrink-0" />
                <span>Deterministic reduction: -18% cooling water draw</span>
              </div>
              <div className="flex items-center gap-3 text-apple-text dark:text-eco-200">
                <CheckCircle2 className="w-5 h-5 text-env-emerald shrink-0" />
                <span>Non-critical batch shedding: -10% energy demand</span>
              </div>
              <div className="flex items-center gap-3 text-apple-text dark:text-eco-200">
                <CheckCircle2 className="w-5 h-5 text-env-emerald shrink-0" />
                <span>Zero external actuator dispatch without explicit human authorization</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-6">
            <div className="flex items-center justify-between border-b border-apple-border dark:border-eco-750 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-env-emerald" />
                <span className="text-apple-text dark:text-eco-100 font-bold text-sm sm:text-base">Real-Time Simulation Output</span>
              </div>
              <span className="text-xs px-3 py-1 bg-env-emerald/10 text-env-emerald rounded-full font-bold">
                MATHEMATICALLY VALIDATED
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-800 rounded-2xl space-y-2">
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 font-semibold">BEFORE MITIGATION</div>
                <div className="text-3xl font-bold font-mono text-status-stressed">82 <span className="text-sm font-normal">/ 100</span></div>
                <div className="text-xs font-mono text-apple-secondary dark:text-eco-300">Water Draw: 1.20 ML/d</div>
                <div className="text-xs font-mono text-apple-secondary dark:text-eco-300">Power Draw: 4.8 MW</div>
              </div>

              <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-env-emerald/40 dark:border-env-emerald/30 rounded-2xl space-y-2">
                <div className="text-xs font-mono text-env-emerald font-semibold">AFTER SIMULATION</div>
                <div className="text-3xl font-bold font-mono text-env-emerald">{afterStress} <span className="text-sm font-normal">/ 100 (-{simulatedStressRelief})</span></div>
                <div className="text-xs font-mono text-env-emerald">Water: {(1.20 * (1 - waterReductionPct / 100)).toFixed(2)} ML/d (-{waterReductionPct}%)</div>
                <div className="text-xs font-mono text-env-emerald">Power: {(4.8 * (1 - powerReductionPct / 100)).toFixed(2)} MW (-{powerReductionPct}%)</div>
              </div>
            </div>

            <div className="p-4 bg-apple-subtle dark:bg-eco-850 rounded-xl text-xs sm:text-sm text-apple-secondary dark:text-eco-300 flex items-center justify-between">
              <span>Modeled across Nairobi Cloud Facility & Olkaria Geothermal Hub.</span>
              <Link href="/app/infrastructure" className="text-env-emerald font-semibold hover:underline flex items-center gap-1 shrink-0">
                <span>View facility plane</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders & Partners */}
      <section id="partners" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Enterprise Stakeholders</span>
            <h3 className="text-lg sm:text-xl font-bold text-apple-text dark:text-eco-100">
              Designed for Infrastructure Operators, Cloud Providers & Climate Institutions
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2 text-xs sm:text-sm font-mono text-apple-secondary dark:text-eco-400 font-medium">
            <span className="hover:text-apple-text dark:hover:text-eco-200 transition-colors">ORACLE CLOUD INFRASTRUCTURE</span>
            <span className="text-apple-border dark:text-eco-700">•</span>
            <span className="hover:text-apple-text dark:hover:text-eco-200 transition-colors">@iLabAfrica / STRATHMORE</span>
            <span className="text-apple-border dark:text-eco-700">•</span>
            <span className="hover:text-apple-text dark:hover:text-eco-200 transition-colors">KENYA METEOROLOGICAL DEPT</span>
            <span className="text-apple-border dark:text-eco-700">•</span>
            <span className="hover:text-apple-text dark:hover:text-eco-200 transition-colors">EAST AFRICA DATA CENTER ALLIANCE</span>
            <span className="text-apple-border dark:text-eco-700">•</span>
            <span className="hover:text-apple-text dark:hover:text-eco-200 transition-colors">AFRICA CLIMATE FOUNDATION</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 sm:px-10 lg:px-14 xl:px-16 py-8 text-xs text-apple-muted dark:text-eco-400 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans w-full max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-bold text-apple-text dark:text-eco-200 font-mono">ECO-SHIELD SENTINEL NETWORK</span>
          <span>|</span>
          <span className="font-mono">v2.4-enterprise</span>
          <span>|</span>
          <span className="text-env-emerald font-semibold font-mono">DEMO ENVIRONMENT</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/app" className="hover:text-env-emerald transition-colors font-medium">
            Launch Workspace →
          </Link>
          <Link href="/app/api-docs" className="hover:text-env-emerald transition-colors font-medium">
            API Documentation
          </Link>
        </div>
      </footer>
    </div>
  );
}
