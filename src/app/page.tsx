'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { INITIAL_LOCATIONS } from '@/data/locations';
import { INITIAL_FACILITIES } from '@/data/facilities';
import { INITIAL_COMMUNITY_REPORTS } from '@/data/communityReports';
import {
  ArrowRight, Building2, Users, CloudRain, CheckCircle2, Sun, Moon, Sparkles,
  ShieldCheck, ChevronRight, Droplets, Zap, Globe2, Heart, Megaphone, Gift,
  Smartphone, Award, Eye, Radar, Bell, Leaf
} from 'lucide-react';

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
  const [closedLoopEnabled, setClosedLoopEnabled] = useState(true);
  const [batchSheddingEnabled, setBatchSheddingEnabled] = useState(true);
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickerItems = [
    '● NAIROBI BASIN: River levels steady | Aquifer recharge monitoring active',
    '● RIFT VALLEY: Geothermal power running on 100% renewable energy',
    '● MOMBASA: Coastal water temperature normal | Grid operations healthy',
    '● COMMUNITY WATCH: 5 anonymous scout observations verified across regional corridors',
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
  const simulatedStressRelief = (closedLoopEnabled ? 8 : 0) + (batchSheddingEnabled ? 5 : 0);
  const afterStress = Math.max(45, 82 - simulatedStressRelief);
  const waterReductionPct = closedLoopEnabled ? 18 : 0;
  const powerReductionPct = batchSheddingEnabled ? 10 : 0;

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text dark:bg-eco-950 dark:text-eco-50 flex flex-col font-sans selection:bg-env-emerald selection:text-white transition-colors">
      {/* Live ticker ribbon */}
      <div className="bg-white/95 dark:bg-eco-900 border-b border-apple-border dark:border-eco-800 px-4 sm:px-8 py-2 text-xs flex items-center justify-between overflow-hidden shadow-apple-sm z-50">
        <div className="flex items-center gap-2.5 truncate max-w-[85vw] sm:max-w-none">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-env-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-env-emerald" />
          </span>
          <span className="text-apple-muted dark:text-eco-400 uppercase font-semibold hidden md:inline font-mono">LIVE:</span>
          <span className="text-apple-text dark:text-eco-200 transition-all duration-500 font-medium">{tickerItems[tickerIndex]}</span>
        </div>
        <div className="hidden lg:flex items-center gap-3 text-apple-muted dark:text-eco-400 shrink-0 text-xs">
          <span className="flex items-center gap-1 font-medium text-env-emerald">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Free & Open to Everyone</span>
          </span>
        </div>
      </div>

      {/* Top navigation */}
      <nav className="h-20 border-b border-apple-border dark:border-eco-700/60 bg-white/80 dark:bg-eco-950/80 backdrop-blur-xl px-5 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-env-emerald/10 border border-env-emerald/30 flex items-center justify-center text-env-emerald font-bold text-lg shadow-sm">E</div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-apple-text dark:text-eco-50 uppercase font-sans">ECO-SHIELD</span>
            <span className="text-xs text-apple-muted dark:text-eco-400">Open Environmental Watch</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 lg:gap-10 text-sm lg:text-base font-medium text-apple-secondary dark:text-eco-300">
          <a href="#explore" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Explore</a>
          <a href="#report-earn" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Report & Earn</a>
          <a href="#green-line" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Green Line</a>
          <a href="#protect" className="hover:text-apple-text dark:hover:text-eco-50 transition-colors">Protection</a>
        </div>

        <div className="flex items-center gap-3">
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
            <span>Open the Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-5 sm:px-10 lg:px-14 xl:px-16 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-env-emerald/10 border border-env-emerald/20 rounded-full text-xs font-semibold text-env-emerald">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AN OPEN PROJECT FOR EVERYONE</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-apple-text dark:text-eco-50 leading-[1.14]">
                Watch your water. Report what you see. Earn rewards.
              </h1>
              <p className="text-lg sm:text-xl text-apple-secondary dark:text-eco-300 leading-relaxed font-normal font-sans">
                Eco-Shield brings together satellite views, utility data, and everyday observations from people like you
                to spot water and energy problems early — before they become emergencies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-sm sm:text-base font-medium">
              <button
                onClick={() => window.location.href = '/app/claims'}
                className="flex items-center gap-2 px-6 py-3.5 bg-env-emerald text-white hover:bg-env-forest font-semibold rounded-2xl transition-all shadow-apple-sm hover:scale-[1.02] active:scale-95"
              >
                <Megaphone className="w-5 h-5" />
                <span>Report a Problem</span>
              </button>
              <Link
                href="/app"
                className="px-6 py-3.5 bg-white dark:bg-eco-900 hover:bg-apple-subtle dark:hover:bg-eco-850 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700 rounded-2xl transition-all shadow-apple-sm font-semibold"
              >
                Explore the Live Map
              </Link>
            </div>

            <div className="pt-6 border-t border-apple-border dark:border-eco-800 grid grid-cols-3 gap-5 text-sm font-sans">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50">3 Views</div>
                <div className="text-xs sm:text-sm text-apple-muted dark:text-eco-400">Sky, Ground, Grid</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-env-emerald">Free</div>
                <div className="text-xs sm:text-sm text-apple-muted dark:text-eco-400">No account needed</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50">Real Rewards</div>
                <div className="text-xs sm:text-sm text-apple-muted dark:text-eco-400">Solar, lamps, pumps</div>
              </div>
            </div>
          </div>

          {/* Hero globe */}
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
              <div className="absolute top-5 left-5 z-20 p-4 sm:p-5 bg-white/95 dark:bg-eco-900/95 border border-apple-border dark:border-eco-700/80 backdrop-blur-xl rounded-2xl shadow-apple-card text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-env-emerald animate-pulse" />
                  <span className="text-xs text-apple-muted dark:text-eco-400 uppercase tracking-wider font-semibold font-mono">Watching Now</span>
                </div>
                <div className="font-bold text-apple-text dark:text-eco-50 text-base sm:text-lg">{selectedLocation.name}, {selectedLocation.country}</div>
                <div className="text-xs text-apple-secondary dark:text-eco-300 font-medium">
                  Overall Condition: <strong className="text-env-emerald font-semibold">Active & Monitored</strong>
                </div>
              </div>
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

      {/* Teaser grid: every section of the platform */}
      <section id="explore" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="max-w-3xl space-y-3 mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Everything inside</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">One place to see, report, and act</h2>
          <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300">
            Every part of Eco-Shield works together. Pick a door — they all lead to the same live picture of the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Live Map */}
          <Link href="/app" className="group p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-3 hover-card-lift">
            <div className="w-12 h-12 rounded-2xl bg-env-sky/10 border border-env-sky/20 flex items-center justify-center text-env-sky"><Globe2 className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">The Live Map</h3>
            <p className="text-apple-secondary dark:text-eco-300 text-sm sm:text-base leading-relaxed">
              A real 3D Earth showing heat, water and power stress as it happens. Tap a region to dive in.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-env-emerald">Open the map <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>

          {/* Community */}
          <Link href="/app/community" className="group p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-3 hover-card-lift">
            <div className="w-12 h-12 rounded-2xl bg-env-amber/10 border border-env-amber/20 flex items-center justify-center text-env-amber"><Users className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">Community Watch</h3>
            <p className="text-apple-secondary dark:text-eco-300 text-sm sm:text-base leading-relaxed">
              Observations from farmers, rangers and neighbours — private by design, powerful together.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-env-emerald">See what people spotted <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>

          {/* Report & Earn */}
          <Link href="/app/claims" id="report-earn" className="group p-7 bg-gradient-to-br from-env-emerald/10 to-env-sky/5 border border-env-emerald/25 rounded-3xl shadow-apple-card space-y-3 hover-card-lift">
            <div className="w-12 h-12 rounded-2xl bg-env-emerald text-white flex items-center justify-center"><Megaphone className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">Report & Earn</h3>
            <p className="text-apple-secondary dark:text-eco-300 text-sm sm:text-base leading-relaxed">
              Spotted pollution or a broken pump? Report it with photo, video or voice. Verified reports earn GreenPoints.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-env-emerald">Send a report <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>

          {/* Rewards */}
          <Link href="/app/rewards" className="group p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-3 hover-card-lift">
            <div className="w-12 h-12 rounded-2xl bg-env-emerald/10 border border-env-emerald/20 flex items-center justify-center text-env-emerald"><Gift className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">Green Rewards Shop</h3>
            <p className="text-apple-secondary dark:text-eco-300 text-sm sm:text-base leading-relaxed">
              Turn points into solar lamps, water pumps, cook stoves and tree seedlings from local partners.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-env-emerald">Browse rewards <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>

          {/* USSD Green Line */}
          <Link href="/app/ussd" id="green-line" className="group p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-3 hover-card-lift">
            <div className="w-12 h-12 rounded-2xl bg-apple-text dark:bg-eco-800 flex items-center justify-center text-env-emerald"><Smartphone className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">Green Line *384*EC#</h3>
            <p className="text-apple-secondary dark:text-eco-300 text-sm sm:text-base leading-relaxed">
              No smartphone? No internet? Dial the code on any phone to report, track and earn. Try the real menus here.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-env-emerald">Try the phone <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>

          {/* Alerts */}
          <Link href="/app/alerts" className="group p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-3 hover-card-lift">
            <div className="w-12 h-12 rounded-2xl bg-status-critical/10 border border-status-critical/20 flex items-center justify-center text-status-critical"><Bell className="w-6 h-6" /></div>
            <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">Early-Warning Alerts</h3>
            <p className="text-apple-secondary dark:text-eco-300 text-sm sm:text-base leading-relaxed">
              When rivers drop or the grid strains, the platform raises a flag — hours or days before crisis.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-env-emerald">See active alerts <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="space-y-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Report & Earn</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">How reporting works</h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300">
              Three simple steps from your eyes on the ground to real rewards in your hands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-4 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-env-sky/10 border border-env-sky/20 flex items-center justify-center text-env-sky font-bold text-xl"><Megaphone className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">1. Tell us what you see</h3>
              <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-base">
                A drying river, illegal dumping, a broken borehole. One short line, plus a photo, video or voice note if you can.
              </p>
            </div>
            <div className="p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-4 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-env-amber/10 border border-env-amber/20 flex items-center justify-center text-env-amber font-bold text-xl"><Eye className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">2. We check it is true</h3>
              <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-base">
                Our review team compares your report with satellite data and field records. You can follow every step with your tracking number.
              </p>
            </div>
            <div className="p-7 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-4 hover-card-lift">
              <div className="w-12 h-12 rounded-2xl bg-env-emerald/10 border border-env-emerald/20 flex items-center justify-center text-env-emerald font-bold text-xl"><Award className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">3. Verified? You earn</h3>
              <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-base">
                Verified reports get a ticket number. Enter it on the Green Line and GreenPoints land in your wallet — spend them in the rewards shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three data pillars */}
      <section className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="space-y-12">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Where the information comes from</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">Three views, one truth</h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300 font-sans">
              No single sensor tells the whole story. Eco-Shield blends three complementary views.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image src="/images/satellite.jpg" alt="Satellite scanning Earth" fill className="object-cover group-hover:scale-105 transition-all duration-500" />
              </div>
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-sky uppercase font-mono"><CloudRain className="w-4 h-4" /><span>Pillar 01 • Sky</span></div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">Satellite Earth Views</h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Public satellite observations measuring seasonal rainfall, land temperature and soil dryness across entire river basins.
                  </p>
                </div>
                <div className="text-xs text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">Tracks: seasonal rains, heatwaves, river flow</div>
              </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image src="/images/datacenter.jpg" alt="Sustainable facility" fill className="object-cover group-hover:scale-105 transition-all duration-500" />
              </div>
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-emerald uppercase font-mono"><Building2 className="w-4 h-4" /><span>Pillar 02 • Grid</span></div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">Essential Infrastructure</h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Cooling water intake, electricity grid balance and clean geothermal operations — watched so they never strain community water.
                  </p>
                </div>
                <div className="text-xs text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">Tracks: water intake, energy load, cooling</div>
              </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card hover-card-lift flex flex-col group">
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-eco-950">
                <Image src="/images/community.jpg" alt="Community river monitoring" fill className="object-cover group-hover:scale-105 transition-all duration-500" />
              </div>
              <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-env-amber uppercase font-mono"><Users className="w-4 h-4" /><span>Pillar 03 • Community</span></div>
                  <h3 className="text-xl font-bold text-apple-text dark:text-eco-50">People Like You</h3>
                  <p className="text-apple-secondary dark:text-eco-300 font-sans leading-relaxed text-sm sm:text-base">
                    Rangers, farmers and residents who spot dry rivers and broken pumps before the sensors do — the most valuable signal of all.
                  </p>
                </div>
                <div className="text-xs text-apple-muted dark:text-eco-400 pt-3 border-t border-apple-border dark:border-eco-800">Tracks: wells, power blips, local sightings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive mitigation sandbox */}
      <section id="protect" className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest text-apple-muted dark:text-eco-400 font-semibold">Smart protection</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">See how smart conservation works</h2>
            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300 font-sans leading-relaxed">
              When heat spikes or reservoirs drop, facilities can switch modes immediately. Toggle below to see how small
              operational shifts protect community water and steady the power grid.
            </p>

            <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-2xl shadow-apple-card space-y-3">
              <div className="text-xs font-mono uppercase text-apple-muted dark:text-eco-400 font-semibold">Try toggling:</div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setClosedLoopEnabled(!closedLoopEnabled)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                    closedLoopEnabled ? 'bg-env-emerald/10 border-env-emerald text-env-emerald font-semibold shadow-sm' : 'bg-apple-subtle dark:bg-eco-800 border-apple-border dark:border-eco-700 text-apple-secondary'
                  }`}
                >
                  <span className="flex items-center gap-2"><Droplets className="w-4 h-4" />Closed-loop water cooling</span>
                  <span className="text-xs font-mono ml-2 font-bold">{closedLoopEnabled ? 'ON (-18% Water)' : 'OFF'}</span>
                </button>
                <button
                  onClick={() => setBatchSheddingEnabled(!batchSheddingEnabled)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium transition-all ${
                    batchSheddingEnabled ? 'bg-env-emerald/10 border-env-emerald text-env-emerald font-semibold shadow-sm' : 'bg-apple-subtle dark:bg-eco-800 border-apple-border dark:border-eco-700 text-apple-secondary'
                  }`}
                >
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4" />Shift flexible workloads</span>
                  <span className="text-xs font-mono ml-2 font-bold">{batchSheddingEnabled ? 'ON (-10% Power)' : 'OFF'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 font-sans text-sm sm:text-base pt-1">
              {[
                'Saves millions of liters of municipal water during dry seasons',
                'Prevents heat-induced power cuts for local neighbourhoods',
                'Automated suggestions always need a human decision first',
              ].map(t => (
                <div key={t} className="flex items-center gap-3 text-apple-text dark:text-eco-200">
                  <CheckCircle2 className="w-5 h-5 text-env-emerald shrink-0" /><span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card space-y-6">
            <div className="flex items-center justify-between border-b border-apple-border dark:border-eco-750 pb-4">
              <span className="text-apple-text dark:text-eco-100 font-bold text-base">Impact on local stress</span>
              <span className="text-xs px-3 py-1 bg-env-emerald/10 text-env-emerald rounded-full font-bold">LIVE CALCULATION</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-800 rounded-2xl space-y-2">
                <div className="text-xs font-mono text-apple-muted dark:text-eco-400 font-semibold uppercase">Before</div>
                <div className="text-3xl font-bold font-mono text-status-stressed">82 <span className="text-sm font-normal">/ 100</span></div>
                <div className="text-xs text-apple-secondary dark:text-eco-300">Water intake: 1.20 ML/day</div>
                <div className="text-xs text-apple-secondary dark:text-eco-300">Grid draw: 4.8 MW</div>
              </div>
              <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-env-emerald/40 dark:border-env-emerald/30 rounded-2xl space-y-2">
                <div className="text-xs font-mono text-env-emerald font-semibold uppercase">With action</div>
                <div className="text-3xl font-bold font-mono text-env-emerald">{afterStress} <span className="text-sm font-normal">/ 100 (-{simulatedStressRelief})</span></div>
                <div className="text-xs font-mono text-env-emerald">Water: {(1.20 * (1 - waterReductionPct / 100)).toFixed(2)} ML/day</div>
                <div className="text-xs font-mono text-env-emerald">Grid: {(4.8 * (1 - powerReductionPct / 100)).toFixed(2)} MW</div>
              </div>
            </div>
            <div className="p-4 bg-apple-subtle dark:bg-eco-850 rounded-xl text-xs sm:text-sm text-apple-secondary dark:text-eco-300 flex items-center justify-between gap-3">
              <span>Ready to explore real data across regions?</span>
              <Link href="/app" className="text-env-emerald font-semibold hover:underline flex items-center gap-1 shrink-0">
                <span>Open the workspace</span><ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Green Line teaser band */}
      <section className="px-5 sm:px-10 lg:px-14 xl:px-16 py-14 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-eco-950 dark:bg-eco-900 p-8 sm:p-12 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-env-emerald/15 border border-env-emerald/30 rounded-full text-xs font-semibold text-env-emerald uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" /> For every phone, not just smartphones
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-eco-50 tracking-tight max-w-3xl mx-auto">
            Dial <span className="font-mono text-env-emerald">*384*EC#</span> — the whole platform on any phone
          </h2>
          <p className="text-sm sm:text-base text-eco-300 max-w-2xl mx-auto leading-relaxed">
            Report a problem, track it, collect your GreenPoints and redeem rewards — all through a simple menu on
            any feature phone. No app, no internet, no cost.
          </p>
          <Link
            href="/app/ussd"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-env-emerald hover:bg-env-forest text-white font-bold rounded-2xl transition-all active:scale-95 shadow-apple-sm"
          >
            <Smartphone className="w-5 h-5" /> Try the phone simulator
          </Link>
        </div>
      </section>

      {/* Open project footer statement */}
      <section className="px-5 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 border-b border-apple-border dark:border-eco-750 w-full max-w-[1920px] mx-auto text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-env-emerald/10 border border-env-emerald/20 rounded-full text-xs font-semibold text-env-emerald">
            <Heart className="w-3.5 h-3.5" /><span>GLOBAL PUBLIC GOOD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-apple-text dark:text-eco-50 tracking-tight">An open initiative for our planet</h2>
          <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-300">
            Eco-Shield is an independent, open project built for communities, researchers, water stewards and
            infrastructure caretakers everywhere. No company, university or government owns it — the data belongs to everyone.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto pt-2">
          {['100% Open Data', 'Zero Commercial Tracking', 'Privacy First', 'Community-Driven', 'Free & Accessible Forever'].map((tag, idx) => (
            <span key={idx} className="px-4 py-2 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-full text-xs sm:text-sm font-medium text-apple-text dark:text-eco-200 shadow-apple-sm">{tag}</span>
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
          <Link href="/app" className="hover:text-env-emerald transition-colors font-medium">Open the map →</Link>
          <Link href="/app/ussd" className="hover:text-env-emerald transition-colors font-medium">Green Line</Link>
          <Link href="/app/api-docs" className="hover:text-env-emerald transition-colors font-medium">API Reference</Link>
        </div>
      </footer>
    </div>
  );
}
