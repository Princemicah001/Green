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
  Sliders,
  ShieldCheck,
  ChevronRight,
  Droplets,
  Zap,
  Globe2,
  Heart,
  Eye,
  Activity
} from 'lucide-react';

// Dynamic import of 3D globe for zero SSR hydration mismatch
const SentinelGlobe = dynamic(() => import('@/components/globe/SentinelGlobe'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-300 font-sans text-sm">
      Loading Sentinel Earth...
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
    '● NAIROBI BASIN: River levels steady | Aquifer recharge monitoring active',
    '● RIFT VALLEY: Geothermal power running on 100% renewable energy',
    '● MOMBASA: Coastal water temperature normal | Grid operations healthy',
    '● COMMUNITY WATCH: 5 Anonymous scout observations verified across regional corridors',
    '● SENTINEL EARTH: Monitoring 8 global climate regions in real time',
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
      
      {/* Live Operational Status Ribbon */}
      <div className="bg-white/95 dark:bg-eco-900 border-b border-apple-border dark:border-eco-800 px-4 sm:px-8 py-2 text-xs font-sans flex items-center justify-between overflow-hidden shadow-apple-sm z-50">
        <div className="flex items-center gap-2.5 truncate max-w-[85vw] sm:max-w-none">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-env-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-env-emerald" />
          </span>
          <span className="text-apple-muted dark:text-eco-400 uppercase font-semibold hidden md:inline font-mono">
            LIVE NETWORK:
          </span>
          <span className="text-apple-text dark:text-eco-200 transition-all duration-500 font-medium">
            {tickerItems[tickerIndex]}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-apple-muted dark:text-eco-400 shrink-0 text-xs">
          <span className="flex items-center gap-1 font-medium text-env-emerald">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Open Network Active</span>
          </span>
          <span>•</span>
          <span>Public Data Initiative</span>
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
            <span className="text-xs text-apple-muted dark:text-eco-400">Open Sentinel Project</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-sm lg:text-base font-medium text-apple-secondary dark:text-eco-300">
          <a href="#how-it-works" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">How It Works</a>
          <a href="#pillars" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Three Pillars</a>
          <a href="#protection" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Action Engine</a>
          <a href="#open-project" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Open Initiative</a>
          <Link href="/app/api-docs" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Open API</Link>
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
            <span>Open Sentinel</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-5 sm:px-10 lg:px-14 xl:px-16 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-apple-border dark:border-eco-750 overflow-hidden w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          
          {/* Left Column: Friendly, Human Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-env-emerald/10 border border-env-emerald/20 rounded-full text-xs font-semibold text-env-emerald">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OPEN ENVIRONMENTAL SENTINEL</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-apple-text dark:text-eco-50 leading-[1.14]">
                Protecting our shared water, energy, and communities.
              </h1>
              <p className="text-lg sm:text-xl text-apple-secondary dark:text-eco-300 leading-relaxed font-normal font-sans">
                Eco-Shield connects satellite views, essential utilities, and community observations to detect environmental strain early—giving communities and caretakers time to act before water and energy shortages happen.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-sm sm:text-base font-medium">
              <Link
                href="/app"
                className="flex items-center gap-2 px-6 py-3.5 bg-env-emerald text-white hover:bg-env-forest font-semibold rounded-2xl transition-all shadow-apple-sm hover:scale-[1.02] active:scale-95"
              >
                <span>Explore the Live Map</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a
                href="#how-it-works"
                className="px-6 py-3.5 bg-white dark:bg-eco-900 hover:bg-apple-subtle dark:hover:bg-eco-850 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700 rounded-2xl transition-all shadow-apple-sm font-semibold"
              >
                See How It Works
              </a>
            </div>

            {/* Friendly Non-Technical Highlights */}
            <div className="pt-6 border-t border-apple-border dark:border-eco-800 grid grid-cols-3 gap-5 text-sm font-sans">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50">3 Views</div>
                <div className="text-xs sm:text-sm text-apple-muted dark:text-eco-400">Sky, Ground, Grid</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-env-emerald">Real-Time</div>
                <div className="text-xs sm:text-sm text-apple-muted dark:text-eco-400">Early Warning Alerts</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50">100% Free</div>
                <div className="text-xs sm:text-sm text-apple-muted dark:text-eco-400">Open Public Project</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero 3D Globe with Bright, Visible Atmosphere */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="h-[460px] sm:h-[540px] md:h-[620px] xl:h-[680px] w-full rounded-3xl border border-apple-border dark:border-eco-700 bg-gradient-to-b from-[#0B1528] via-[#12233D] to-[#1B3252] relative overflow-hidden shadow-apple-card">
              <SentinelGlobe
                locations={INITIAL_LOCATIONS}
                facilities={INITIAL_FACILITIES}
                communityReports={INITIAL_COMMUNITY_REPORTS}
                selectedLocationId={selectedLocId}
                onSelectLocation={(id) => setSelectedLocId(id)}
                autoRotateSpeed={0.25}
              />

              {/* Floating Region Status Pill */}
              <div className="absolute top-5 left-5 z-20 p-4 sm:p-5 bg-white/95 dark:bg-eco-900/95 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-card text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-env-emerald animate-pulse" />
                  <span className="text-xs text-apple-muted dark:text-eco-400 uppercase tracking-wider font-semibold font-mono">Monitored Basin</span>
                </div>
                <div className="font-bold text-apple-text dark:text-eco-50 text-base sm:text-lg">
                  {selectedLocation.name}, {selectedLocation.country}
                </div>
                <div className="text-xs text-apple-secondary dark:text-eco-300 font-medium">
                  Overall Condition: <strong className="text-env-emerald font-semibold">Active & Monitored</strong>
                </div>
              </div>

              {/* Tap to Explore Region Capsule */}
              <div className="absolute bottom-5 left-5 right-5 z-20 hidden sm:flex items-center justify-between p-2.5 bg-white/95 dark:bg-eco-900/95 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-card text-xs">
                <div className="flex items-center gap-1.5 font-medium text-apple-muted dark:text-eco-400 px-2">
                  <Globe2 className="w-4 h-4 text-env-emerald" />
                  <span>Choose a region:</span>
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

      {/* How It Works: Simple, Clear 3-Step Story */}
      <section id="how-it-works" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="space-y-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Simple Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              How Eco-Shield Keeps Us Safe
            </h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300">
              Three simple steps that turn climate awareness into proactive protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-4 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-env-sky/10 border border-env-sky/20 flex items-center justify-center text-env-sky font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                Notice the Warning Signs
              </h3>
              <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-base">
                Satellites track falling lake levels and heatwaves from space, while local field scouts share ground observations about water pumps and crop drying.
              </p>
            </div>

            <div className="p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-4 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-env-emerald/10 border border-env-emerald/20 flex items-center justify-center text-env-emerald font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                Connect the Signals Early
              </h3>
              <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-base">
                Eco-Shield checks whether regional water and power systems are starting to get overloaded, flagging stress weeks before it turns into an emergency.
              </p>
            </div>

            <div className="p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-4 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-env-amber/10 border border-env-amber/20 flex items-center justify-center text-env-amber font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                Take Proactive Action
              </h3>
              <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-base">
                Facilities switch to closed-loop cooling and ease electricity demand during peak heat, protecting community drinking water and keeping the power grid stable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Data Pillars with Apple 3D Illustrations */}
      <section id="pillars" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="space-y-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">The 3 Data Pillars</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              Where Our Information Comes From
            </h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300 font-sans">
              No single sensor tells the whole story. Eco-Shield brings together three complementary views.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Climate */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/satellite.jpg"
                  alt="Environmental Satellite Scanning Earth"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-sky uppercase font-mono">
                    <CloudRain className="w-4 h-4" />
                    <span>Pillar 01 • Sky</span>
                  </div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                    Satellite Earth Views
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Public satellite observations measuring seasonal rainfall, land temperature changes, and soil dryness across entire river basins.
                  </p>
                </div>
                <div className="text-xs text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Tracks: Seasonal rains, heatwaves, river flow
                </div>
              </div>
            </div>

            {/* Pillar 2: Infrastructure */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/datacenter.jpg"
                  alt="Sustainable Green Facility"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-emerald uppercase font-mono">
                    <Building2 className="w-4 h-4" />
                    <span>Pillar 02 • Grid</span>
                  </div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                    Essential Infrastructure
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Monitoring cooling water intake, electricity grid balance, and clean geothermal operations to avoid straining local community water supplies.
                  </p>
                </div>
                <div className="text-xs text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Tracks: Water intake, energy load, cooling efficiency
                </div>
              </div>
            </div>

            {/* Pillar 3: Community */}
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image
                  src="/images/community.jpg"
                  alt="Community River Monitoring"
                  fill
                  className="object-cover group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-amber uppercase font-mono">
                    <Users className="w-4 h-4" />
                    <span>Pillar 03 • Community</span>
                  </div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">
                    Ground Field Scouts
                  </h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Anonymous, privacy-first reports from park rangers, farmers, and local residents who spot dry river reaches or broken boreholes before sensors catch up.
                  </p>
                </div>
                <div className="text-xs text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">
                  Tracks: Well water levels, power blips, local sightings
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mitigation Sandbox (User-Friendly) */}
      <section id="protection" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Proactive Protection</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
              See How Smart Conservation Works
            </h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300 font-sans leading-relaxed">
              When heat spikes or water reservoirs drop, facilities can switch operating modes immediately. Toggle the buttons below to see how small operational shifts protect community water and relieve pressure on the power grid.
            </p>

            {/* Interactive Control Toggles */}
            <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-2xl shadow-apple-card space-y-3">
              <div className="text-xs font-mono uppercase text-apple-muted dark:text-eco-400 font-semibold">
                Try Toggling Operational Responses:
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
                    <span>Closed-Loop Water Cooling</span>
                  </div>
                  <span className="text-xs font-mono ml-2 font-bold">{closedLoopEnabled ? 'ON (-18% Water)' : 'OFF'}</span>
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
                    <span>Shift Flexible Workloads</span>
                  </div>
                  <span className="text-xs font-mono ml-2 font-bold">{batchSheddingEnabled ? 'ON (-10% Power)' : 'OFF'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 font-sans text-sm sm:text-base pt-1">
              <div className="flex items-center gap-3 text-apple-text dark:text-eco-200">
                <CheckCircle2 className="w-5 h-5 text-env-emerald shrink-0" />
                <span>Saves millions of liters of municipal water during dry seasons</span>
              </div>
              <div className="flex items-center gap-3 text-apple-text dark:text-eco-200">
                <CheckCircle2 className="w-5 h-5 text-env-emerald shrink-0" />
                <span>Prevents heat-induced electrical brownouts for local neighborhoods</span>
              </div>
              <div className="flex items-center gap-3 text-apple-text dark:text-eco-200">
                <CheckCircle2 className="w-5 h-5 text-env-emerald shrink-0" />
                <span>Automated suggestions always require human caretaker review</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-6">
            <div className="flex items-center justify-between border-b border-apple-border dark:border-eco-750 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-env-emerald" />
                <span className="text-apple-text dark:text-eco-100 font-bold text-base">Impact On Local Stress</span>
              </div>
              <span className="text-xs px-3 py-1 bg-env-emerald/10 text-env-emerald rounded-full font-bold">
                LIVE CALCULATION
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-800 rounded-2xl space-y-2">
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 font-semibold uppercase">Before Conservation</div>
                <div className="text-3xl font-bold font-mono text-status-stressed">82 <span className="text-sm font-normal">/ 100</span></div>
                <div className="text-xs text-apple-secondary dark:text-eco-300">Water intake: 1.20 ML/day</div>
                <div className="text-xs text-apple-secondary dark:text-eco-300">Grid draw: 4.8 MW</div>
              </div>

              <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-env-emerald/40 dark:border-env-emerald/30 rounded-2xl space-y-2">
                <div className="text-xs font-mono text-env-emerald font-semibold uppercase">With Action Applied</div>
                <div className="text-3xl font-bold font-mono text-env-emerald">{afterStress} <span className="text-sm font-normal">/ 100 (-{simulatedStressRelief})</span></div>
                <div className="text-xs font-mono text-env-emerald">Water: {(1.20 * (1 - waterReductionPct / 100)).toFixed(2)} ML/day (-{waterReductionPct}%)</div>
                <div className="text-xs font-mono text-env-emerald">Grid: {(4.8 * (1 - powerReductionPct / 100)).toFixed(2)} MW (-{powerReductionPct}%)</div>
              </div>
            </div>

            <div className="p-4 bg-apple-subtle dark:bg-eco-850 rounded-xl text-xs sm:text-sm text-apple-secondary dark:text-eco-300 flex items-center justify-between">
              <span>Ready to explore real data across basins?</span>
              <Link href="/app" className="text-env-emerald font-semibold hover:underline flex items-center gap-1 shrink-0">
                <span>Open Sentinel Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* An Open Project for Our Planet (Zero Corporate Stakeholder Mentions) */}
      <section id="open-project" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-env-emerald/10 border border-env-emerald/20 rounded-full text-xs font-semibold text-env-emerald">
            <Heart className="w-3.5 h-3.5" />
            <span>GLOBAL OPEN PUBLIC GOOD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">
            An Open Initiative for Our Planet
          </h2>
          <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300">
            Eco-Shield is an independent, open project developed for climate researchers, water conservationists, infrastructure engineers, and local community stewards worldwide.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto pt-2">
          {[
            '100% Open Data & Telemetry',
            'Zero Commercial Tracking',
            'Public Good Architecture',
            'Community-Driven Observations',
            'Global Research Commons',
            'Free & Accessible Forever'
          ].map((tag, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-full text-xs sm:text-sm font-medium text-apple-text dark:text-eco-200 shadow-apple-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 sm:px-10 lg:px-14 xl:px-16 py-8 text-xs text-apple-muted dark:text-eco-400 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans w-full max-w-[1920px] mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-bold text-apple-text dark:text-eco-200 font-mono">ECO-SHIELD SENTINEL</span>
          <span>|</span>
          <span>Open Environmental Project</span>
          <span>|</span>
          <span className="text-env-emerald font-semibold">GLOBAL MONITORING ACTIVE</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/app" className="hover:text-env-emerald transition-colors font-medium">
            Launch Workspace →
          </Link>
          <Link href="/app/api-docs" className="hover:text-env-emerald transition-colors font-medium">
            Open API Reference
          </Link>
        </div>
      </footer>
    </div>
  );
}
