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
  ExternalLink
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('eco_shield_theme') as 'light' | 'dark' | null;
      if (stored) {
        setTheme(stored);
        if (stored === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('eco_shield_theme', next);
      if (next === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text dark:bg-eco-950 dark:text-eco-50 flex flex-col font-sans selection:bg-env-emerald selection:text-white transition-colors">
      {/* Top Apple Navigation Bar */}
      <nav className="h-20 border-b border-apple-border dark:border-eco-700/60 bg-white/80 dark:bg-eco-950/80 backdrop-blur-xl px-5 sm:px-10 lg:px-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-env-emerald/10 border border-env-emerald/30 flex items-center justify-center text-env-emerald font-bold text-base">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-apple-text dark:text-eco-50 uppercase font-sans">ECO-SHIELD</span>
            <span className="text-xs font-mono text-apple-muted dark:text-eco-400">Sentinel Network</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-apple-secondary dark:text-eco-300">
          <a href="#pillars" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Data Pillars</a>
          <a href="#architecture" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Architecture</a>
          <a href="#intelligence" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Stress Engine</a>
          <a href="#partners" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Partners</a>
          <Link href="/app/api-docs" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">API Docs</Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme switcher button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-apple-secondary dark:text-eco-300 hover:text-apple-text dark:hover:text-eco-100 bg-apple-subtle dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-xl transition-all shadow-apple-sm"
            title="Toggle Light / Dark mode"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <Link
            href="/app"
            className="flex items-center gap-2 px-5 py-2.5 bg-env-emerald hover:bg-env-forest text-white font-medium text-sm rounded-2xl transition-all shadow-apple-sm active:scale-95"
          >
            <span>Launch Sentinel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-5 sm:px-10 lg:px-14 pt-16 sm:pt-20 pb-20 border-b border-apple-border dark:border-eco-750 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Typography */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-env-emerald/10 border border-env-emerald/20 rounded-full text-xs font-semibold text-env-emerald">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CRITICAL INFRASTRUCTURE INTELLIGENCE</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-apple-text dark:text-eco-50 leading-[1.12]">
                Environmental intelligence for critical infrastructure.
              </h1>
              <p className="text-lg sm:text-xl text-apple-secondary dark:text-eco-300 leading-relaxed font-normal font-sans">
                Connecting climate data, infrastructure telemetry, and community observations to detect environmental stress before it becomes a crisis.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-sm sm:text-base font-medium">
              <Link
                href="/app"
                className="flex items-center gap-2 px-6 py-3 bg-apple-text text-white hover:bg-black dark:bg-eco-50 dark:text-eco-950 dark:hover:bg-eco-200 font-semibold rounded-2xl transition-all shadow-apple-sm"
              >
                <span>Explore Sentinel</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              
              <a
                href="#architecture"
                className="px-6 py-3 bg-white dark:bg-eco-900 hover:bg-apple-subtle dark:hover:bg-eco-850 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700 rounded-2xl transition-all shadow-apple-sm"
              >
                System Overview
              </a>
            </div>

            <div className="pt-8 border-t border-apple-border dark:border-eco-800 grid grid-cols-3 gap-6 text-sm font-sans">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 font-mono">3-Domain</div>
                <div className="text-xs text-apple-muted dark:text-eco-400 mt-1 font-medium">Unified Sensor Mesh</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-env-emerald font-mono">&lt;60s</div>
                <div className="text-xs text-apple-muted dark:text-eco-400 mt-1 font-medium">Stress Recalculation</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 font-mono">Zero-PII</div>
                <div className="text-xs text-apple-muted dark:text-eco-400 mt-1 font-medium">Ground Verification</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero 3D Globe Visualization */}
          <div className="lg:col-span-7 h-[480px] sm:h-[560px] md:h-[620px] w-full rounded-3xl border border-apple-border dark:border-eco-700 bg-slate-950 relative overflow-hidden shadow-apple-card">
            <SentinelGlobe
              locations={INITIAL_LOCATIONS}
              facilities={INITIAL_FACILITIES}
              communityReports={INITIAL_COMMUNITY_REPORTS}
              selectedLocationId={selectedLocId}
              onSelectLocation={(id) => setSelectedLocId(id)}
              autoRotateSpeed={0.3}
            />

            {/* Floating overlay with selected location badge */}
            <div className="absolute top-5 left-5 z-20 p-4 bg-white/90 dark:bg-eco-900/95 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-card text-sm">
              <div className="text-xs text-apple-muted dark:text-eco-400 uppercase tracking-wider font-semibold font-mono">Spatial Focus</div>
              <div className="font-bold text-apple-text dark:text-eco-50 text-base mt-0.5">Nairobi Basin, Kenya</div>
              <div className="text-xs text-apple-secondary dark:text-eco-300 mt-1 font-mono">Stress: 68/100 • Water: 72 • Heat: 79</div>
            </div>
          </div>

        </div>
      </section>

      {/* The Three Data Pillars with Apple 3D Illustrations */}
      <section id="pillars" className="px-5 sm:px-10 lg:px-14 py-20 sm:py-24 border-b border-apple-border dark:border-eco-750">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Data Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              Three Interconnected Data Domains
            </h2>
            <p className="text-base text-apple-secondary dark:text-eco-300 font-sans">
              Eco-Shield synchronizes disparate multi-frequency telemetry layers into one coherent intelligence plane.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Climate */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card flex flex-col group">
              <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/satellite.jpg"
                  alt="Copernicus Sentinel Satellite"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-sky uppercase font-mono">
                    <CloudRain className="w-4 h-4" />
                    <span>Domain 01</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-apple-text dark:text-eco-50">
                    Climate & Environment
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm">
                    Copernicus Sentinel-2 & Sentinel-3 satellite radiance, ERA5 atmospheric reanalysis, 10-year seasonal rainfall baselines, and soil moisture anomaly vectors.
                  </p>
                </div>
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Inputs: Surface Temp, Rainfall Deficit, Drought Indices
                </div>
              </div>
            </div>

            {/* Pillar 2: Infrastructure */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card flex flex-col group">
              <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/datacenter.jpg"
                  alt="Sustainable Green Data Center"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-emerald uppercase font-mono">
                    <Building2 className="w-4 h-4" />
                    <span>Domain 02</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-apple-text dark:text-eco-50">
                    Critical Infrastructure
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm">
                    Data center BMS telemetry, SCADA power grid stability feeds, cooling loop evaporative water draw, and geothermal loop operational loads.
                  </p>
                </div>
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Inputs: Compute Load, Power MW, Water ML/day, PUE
                </div>
              </div>
            </div>

            {/* Pillar 3: Community */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card flex flex-col group">
              <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/community.jpg"
                  alt="Community Environmental Water Monitoring"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-300"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-amber uppercase font-mono">
                    <Users className="w-4 h-4" />
                    <span>Domain 03</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-apple-text dark:text-eco-50">
                    Community Observations
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm">
                    Decentralized ground observations from rangers, borehole operators, and local stewards. Cryptographically anonymized with fuzzed coordinates to protect privacy.
                  </p>
                </div>
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Inputs: Water Pressure, Grid Fluctuation, Thermal Heat
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Flow Section */}
      <section id="architecture" className="px-5 sm:px-10 lg:px-14 py-20 sm:py-24 border-b border-apple-border dark:border-eco-750">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">System Flow</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              Data Pipeline & Intelligence Engine
            </h2>
            <p className="text-base text-apple-secondary dark:text-eco-300">
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

      {/* Predictive Mitigation Section */}
      <section id="intelligence" className="px-5 sm:px-10 lg:px-14 py-20 sm:py-24 border-b border-apple-border dark:border-eco-750">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Intelligence Engine</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              Predictive mitigation, not reactive crisis management.
            </h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300 font-sans leading-relaxed">
              When regional environmental stress crosses operational thresholds, the Eco-Shield Mitigation Engine generates mathematically validated operational recommendations: shifting non-critical batch workloads to renewable geothermal facilities, switching data center cooling towers to closed-circuit economizers, and optimizing chilled water setpoints.
            </p>
            <div className="space-y-3 font-sans text-sm sm:text-base pt-2">
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

          <div className="p-6 sm:p-8 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-5">
            <div className="flex items-center justify-between border-b border-apple-border dark:border-eco-750 pb-4">
              <span className="text-apple-muted dark:text-eco-400 uppercase text-xs font-bold font-mono">Simulation Output Preview</span>
              <span className="text-xs px-2.5 py-0.5 bg-env-emerald/10 text-env-emerald rounded-full font-bold">
                VALIDATED
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div className="p-4 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-800 rounded-2xl space-y-1.5">
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 font-semibold">BEFORE MITIGATION</div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-status-stressed">82 / 100</div>
                <div className="text-xs font-mono text-apple-secondary dark:text-eco-300">Water: 1.20 ML/d</div>
                <div className="text-xs font-mono text-apple-secondary dark:text-eco-300">Power: 4.8 MW</div>
              </div>

              <div className="p-4 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-800 rounded-2xl space-y-1.5">
                <div className="text-xs font-mono text-env-emerald font-semibold">AFTER SIMULATION</div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-env-emerald">69 / 100 (-13)</div>
                <div className="text-xs font-mono text-env-emerald">Water: 0.98 ML/d (-18%)</div>
                <div className="text-xs font-mono text-env-emerald">Power: 4.3 MW (-10%)</div>
              </div>
            </div>

            <div className="text-xs text-apple-muted dark:text-eco-400 font-sans">
              Simulated across Nairobi Cloud Facility & Olkaria Geothermal Computing Hub.
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders & Partners */}
      <section id="partners" className="px-5 sm:px-10 lg:px-14 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750">
        <div className="max-w-7xl mx-auto space-y-8">
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
      <footer className="px-5 sm:px-10 lg:px-14 py-8 text-xs text-apple-muted dark:text-eco-400 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
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
