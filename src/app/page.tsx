'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { INITIAL_LOCATIONS } from '@/data/locations';
import { INITIAL_FACILITIES } from '@/data/facilities';
import { INITIAL_COMMUNITY_REPORTS } from '@/data/communityReports';
import { 
  ArrowRight, 
  Globe2, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Building2, 
  Users, 
  CloudRain, 
  Database, 
  CheckCircle2, 
  Cpu, 
  Code2 
} from 'lucide-react';

// Dynamic import of 3D globe for zero SSR hydration mismatch
const SentinelGlobe = dynamic(() => import('@/components/globe/SentinelGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-eco-950 text-eco-500 font-mono text-xs">
      Initializing 3D Spatial Engine...
    </div>
  ),
});

export default function LandingPage() {
  const [selectedLocId, setSelectedLocId] = React.useState('nairobi');

  return (
    <div className="min-h-screen bg-eco-950 text-eco-50 flex flex-col font-sans selection:bg-eco-700">
      {/* Top Minimal Navigation Bar */}
      <nav className="h-16 border-b border-eco-700/60 bg-eco-950/80 backdrop-blur-md px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded border border-eco-600 bg-eco-850 flex items-center justify-center text-eco-100 font-mono font-bold text-xs">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest text-eco-50 uppercase font-mono">ECO-SHIELD</span>
            <span className="text-[10px] font-mono text-eco-400">Sentinel Network</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-mono text-eco-300">
          <a href="#pillars" className="hover:text-eco-50 transition-colors">Data Pillars</a>
          <a href="#architecture" className="hover:text-eco-50 transition-colors">Architecture</a>
          <a href="#intelligence" className="hover:text-eco-50 transition-colors">Stress Engine</a>
          <a href="#partners" className="hover:text-eco-50 transition-colors">Partners</a>
          <Link href="/app/api-docs" className="hover:text-eco-50 transition-colors">API Docs</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-eco-900 border border-eco-750 rounded text-[11px] font-mono text-eco-300">
            <span className="w-1.5 h-1.5 rounded-full bg-status-healthy" />
            <span>OPERATIONAL</span>
          </div>

          <Link
            href="/app"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-eco-50 hover:bg-eco-200 text-eco-950 font-semibold text-xs font-mono rounded transition-colors"
          >
            <span>LAUNCH SENTINEL</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-16 pb-20 border-b border-eco-750 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Typography (Requirement 4 & 6) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-eco-900 border border-eco-700 rounded text-[11px] font-mono text-eco-300">
              <span className="w-1.5 h-1.5 rounded-full bg-eco-400" />
              <span>CRITICAL INFRASTRUCTURE INTELLIGENCE</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-eco-50 leading-[1.15]">
                Environmental intelligence for critical infrastructure.
              </h1>
              <p className="text-base text-eco-300 leading-relaxed font-normal">
                Connecting climate data, infrastructure telemetry, and community observations to detect environmental stress before it becomes a crisis.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
              <Link
                href="/app"
                className="flex items-center gap-2 px-5 py-2.5 bg-eco-50 hover:bg-eco-200 text-eco-950 font-semibold rounded transition-colors shadow-sm"
              >
                <span>EXPLORE SENTINEL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href="#architecture"
                className="px-5 py-2.5 bg-eco-900 hover:bg-eco-850 text-eco-200 border border-eco-700 rounded transition-colors"
              >
                SYSTEM OVERVIEW
              </a>
            </div>

            <div className="pt-6 border-t border-eco-800 grid grid-cols-3 gap-4 text-xs font-mono text-eco-400">
              <div>
                <div className="text-lg font-bold text-eco-50">3-Domain</div>
                <div className="text-[10px] mt-0.5">Unified Sensor Mesh</div>
              </div>
              <div>
                <div className="text-lg font-bold text-eco-50">&lt;60s</div>
                <div className="text-[10px] mt-0.5">Stress Recalculation</div>
              </div>
              <div>
                <div className="text-lg font-bold text-eco-50">Zero-PII</div>
                <div className="text-[10px] mt-0.5">Ground Verification</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero 3D Globe Visualization (Requirement 7) */}
          <div className="lg:col-span-7 h-[460px] md:h-[560px] w-full rounded border border-eco-750 bg-eco-950 relative overflow-hidden shadow-2xl">
            <SentinelGlobe
              locations={INITIAL_LOCATIONS}
              facilities={INITIAL_FACILITIES}
              communityReports={INITIAL_COMMUNITY_REPORTS}
              selectedLocationId={selectedLocId}
              onSelectLocation={(id) => setSelectedLocId(id)}
              autoRotateSpeed={0.3}
            />

            {/* Discreet floating overlay with selected location badge */}
            <div className="absolute top-4 left-4 z-20 p-3 bg-eco-900/90 border border-eco-700/80 backdrop-blur-md rounded text-xs font-mono">
              <div className="text-[10px] text-eco-400 uppercase tracking-wider">Spatial Focus</div>
              <div className="font-semibold text-eco-50 text-sm">Nairobi Basin, Kenya</div>
              <div className="text-[11px] text-eco-300 mt-0.5">Stress: 68/100 • Water: 72 • Heat: 79</div>
            </div>
          </div>

        </div>
      </section>

      {/* The Three Data Pillars (Requirement 1 & 6) */}
      <section id="pillars" className="px-6 md:px-12 py-20 border-b border-eco-750">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-eco-400">Data Architecture</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-eco-50 tracking-tight">
              Three interconnected data domains
            </h2>
            <p className="text-xs text-eco-300 font-mono">
              Eco-Shield synchronizes disparate multi-frequency telemetry layers into one coherent intelligence plane.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Pillar 1: Climate */}
            <div className="p-6 bg-eco-900 border border-eco-700 rounded space-y-3">
              <div className="w-8 h-8 rounded bg-eco-850 border border-eco-700 flex items-center justify-center text-eco-200">
                <CloudRain className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-eco-50 uppercase tracking-wider">
                1. Climate & Environment
              </h3>
              <p className="text-eco-300 font-sans leading-relaxed text-xs">
                Copernicus Sentinel-2 & Sentinel-3 satellite feeds, ERA5 atmospheric reanalysis, 10-year seasonal precipitation baselines, and soil moisture anomaly vectors.
              </p>
              <div className="text-[11px] text-eco-400 pt-2 border-t border-eco-800">
                Inputs: Surface Temp, Rainfall Deficit, Drought Indices
              </div>
            </div>

            {/* Pillar 2: Infrastructure */}
            <div className="p-6 bg-eco-900 border border-eco-700 rounded space-y-3">
              <div className="w-8 h-8 rounded bg-eco-850 border border-eco-700 flex items-center justify-center text-eco-200">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-eco-50 uppercase tracking-wider">
                2. Critical Infrastructure
              </h3>
              <p className="text-eco-300 font-sans leading-relaxed text-xs">
                Data center BMS telemetry, SCADA power grid stability feeds, cooling loop evaporative water draw, and subsea cable landing station operational loads.
              </p>
              <div className="text-[11px] text-eco-400 pt-2 border-t border-eco-800">
                Inputs: Compute Load, Power MW, Water ML/day, PUE
              </div>
            </div>

            {/* Pillar 3: Community */}
            <div className="p-6 bg-eco-900 border border-eco-700 rounded space-y-3">
              <div className="w-8 h-8 rounded bg-eco-850 border border-eco-700 flex items-center justify-center text-eco-200">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-eco-50 uppercase tracking-wider">
                3. Community Observations
              </h3>
              <p className="text-eco-300 font-sans leading-relaxed text-xs">
                Decentralized ground observations from local communities, municipal borehole operators, and utility consumers. Cryptographically anonymized to protect contributor privacy.
              </p>
              <div className="text-[11px] text-eco-400 pt-2 border-t border-eco-800">
                Inputs: Water Pressure, Grid Brownouts, Thermal Corridors
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview Section (Requirement 11 & 12) */}
      <section id="architecture" className="px-6 md:px-12 py-20 border-b border-eco-750 bg-eco-950">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-xl space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-eco-400">System Flow</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-eco-50 tracking-tight">
              Data Pipeline & Intelligence Engine
            </h2>
            <p className="text-xs text-eco-300 font-mono">
              From raw heterogeneous telemetry to deterministic operational decisions.
            </p>
          </div>

          {/* ASCII / Monospace Flow Diagram (Requirement 1 & 12) */}
          <div className="p-6 bg-eco-900 border border-eco-700 rounded font-mono text-xs overflow-x-auto">
            <pre className="text-eco-300 text-[11px] leading-relaxed">
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
    NORMALIZATION & COORDINATE FUZZING
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

      {/* Environmental Stress Engine & Scenario (Requirement 14 & 45) */}
      <section id="intelligence" className="px-6 md:px-12 py-20 border-b border-eco-750">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-eco-400">Intelligence Engine</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-eco-50 tracking-tight">
              Predictive mitigation, not reactive crisis management.
            </h2>
            <p className="text-xs text-eco-300 font-sans leading-relaxed">
              When regional environmental stress crosses operational thresholds, the Eco-Shield Mitigation Engine generates mathematically validated operational recommendations: shifting non-critical batch workloads to renewable geothermal facilities, switching data center cooling towers to closed-circuit economizers, and optimizing chilled water setpoints.
            </p>
            <div className="space-y-2 font-mono text-xs pt-2">
              <div className="flex items-center gap-2 text-eco-200">
                <CheckCircle2 className="w-4 h-4 text-status-healthy" />
                <span>Deterministic reduction: -18% cooling water draw</span>
              </div>
              <div className="flex items-center gap-2 text-eco-200">
                <CheckCircle2 className="w-4 h-4 text-status-healthy" />
                <span>Non-critical batch shedding: -10% energy demand</span>
              </div>
              <div className="flex items-center gap-2 text-eco-200">
                <CheckCircle2 className="w-4 h-4 text-status-healthy" />
                <span>Zero external actuator dispatch without explicit human authorization</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-eco-900 border border-eco-700 rounded font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-eco-750 pb-3">
              <span className="text-eco-400 uppercase text-[10px]">Simulation Output Preview</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-eco-800 text-status-healthy rounded border border-status-healthy-border">
                VALIDATED
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-eco-950 border border-eco-800 rounded space-y-1">
                <div className="text-[10px] text-eco-400">BEFORE MITIGATION</div>
                <div className="text-lg font-bold text-status-stressed">82 / 100</div>
                <div className="text-[11px] text-eco-400">Water: 1.20 ML/d</div>
                <div className="text-[11px] text-eco-400">Power: 4.8 MW</div>
              </div>

              <div className="p-3 bg-eco-950 border border-eco-800 rounded space-y-1">
                <div className="text-[10px] text-status-healthy">AFTER SIMULATED RESPONSE</div>
                <div className="text-lg font-bold text-status-healthy">69 / 100 (-13)</div>
                <div className="text-[11px] text-status-healthy">Water: 0.98 ML/d (-18%)</div>
                <div className="text-[11px] text-status-healthy">Power: 4.3 MW (-10%)</div>
              </div>
            </div>

            <div className="text-[11px] text-eco-400 font-sans">
              Simulated across Nairobi Cloud Facility & Olkaria Geothermal Computing Hub.
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Partnerships & Hackathon Track Alignment (Requirement 6) */}
      <section id="partners" className="px-6 md:px-12 py-16 border-b border-eco-750 bg-eco-950">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-eco-400">Enterprise Stakeholders</span>
            <h3 className="text-base font-semibold text-eco-100 font-mono">
              Designed for Infrastructure Operators, Cloud Providers & Climate Institutions
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-4 text-xs font-mono text-eco-400">
            <span className="hover:text-eco-200 transition-colors">ORACLE CLOUD INFRASTRUCTURE</span>
            <span className="text-eco-700">•</span>
            <span className="hover:text-eco-200 transition-colors">@iLabAfrica / STRATHMORE</span>
            <span className="text-eco-700">•</span>
            <span className="hover:text-eco-200 transition-colors">KENYA METEOROLOGICAL DEPT</span>
            <span className="text-eco-700">•</span>
            <span className="hover:text-eco-200 transition-colors">EAST AFRICA DATA CENTER ALLIANCE</span>
            <span className="text-eco-700">•</span>
            <span className="hover:text-eco-200 transition-colors">AFRICA CLIMATE FOUNDATION</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 bg-eco-950 text-xs font-mono text-eco-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-eco-200">ECO-SHIELD SENTINEL NETWORK</span>
          <span className="text-eco-600">|</span>
          <span>v2.4-enterprise</span>
          <span className="text-eco-600">|</span>
          <span className="text-status-healthy">DEMO ENVIRONMENT</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/app" className="hover:text-eco-100 transition-colors">
            Launch Workspace →
          </Link>
          <Link href="/app/api-docs" className="hover:text-eco-100 transition-colors">
            API Documentation
          </Link>
        </div>
      </footer>
    </div>
  );
}
