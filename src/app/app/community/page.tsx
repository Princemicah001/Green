'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSentinel } from '@/lib/store/sentinelStore';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityReportModal from '@/components/community/CommunityReportModal';
import { Plus, ShieldCheck, Waves, Flame, Zap, Droplets, Sparkles, Filter } from 'lucide-react';
import { CommunityCategory } from '@/types';

export default function CommunityPage() {
  const { communityReports, locationReports, selectedLocation } = useSentinel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterBySelectedLocation, setFilterBySelectedLocation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | 'ALL'>('ALL');

  const baseReports = filterBySelectedLocation ? locationReports : communityReports;
  const displayReports = selectedCategory === 'ALL'
    ? baseReports
    : baseReports.filter(r => r.category === selectedCategory);

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
      {/* Apple-Style Hero Banner with Environmental Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 shadow-apple-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-env-emerald/10 border border-env-emerald/20 text-env-emerald text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ground Telemetry Integration</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-apple-text dark:text-eco-50">
              Community Sentinel Network
            </h1>

            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-200 leading-relaxed font-sans">
              Connecting real-time observations from rangers, agriculturalists, and local water stewards with satellite and infrastructure telemetry to detect environmental strain early.
            </p>

            {/* 3-Step Flow Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs sm:text-sm font-medium">
              <span className="px-3 py-1 rounded-full bg-apple-subtle dark:bg-eco-800 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700">
                1. Field Observation
              </span>
              <span className="text-apple-muted dark:text-eco-500">→</span>
              <span className="px-3 py-1 rounded-full bg-apple-subtle dark:bg-eco-800 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700">
                2. Satellite Cross-Check
              </span>
              <span className="text-apple-muted dark:text-eco-500">→</span>
              <span className="px-3 py-1 rounded-full bg-env-emerald/10 text-env-emerald dark:text-env-leaf border border-env-emerald/20 font-semibold">
                3. Proactive Intervention
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-env-emerald hover:bg-env-forest text-white font-medium text-sm sm:text-base rounded-2xl shadow-apple-sm transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                <span>Submit Field Observation</span>
              </button>

              <button
                onClick={() => setFilterBySelectedLocation(!filterBySelectedLocation)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-medium transition-all ${
                  filterBySelectedLocation
                    ? 'bg-apple-subtle dark:bg-eco-800 text-apple-text dark:text-eco-50 border-apple-border dark:border-eco-600 font-semibold shadow-apple-sm'
                    : 'text-apple-secondary dark:text-eco-300 border-apple-border dark:border-eco-750 hover:bg-apple-subtle dark:hover:bg-eco-850'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>{filterBySelectedLocation ? `Filtering: ${selectedLocation.name}` : 'All Regions'}</span>
              </button>
            </div>
          </div>

          {/* Right Image Column (Visual Hero Illustration) */}
          <div className="lg:col-span-5 h-64 lg:h-full min-h-[260px] relative overflow-hidden bg-slate-100 dark:bg-eco-950">
            <Image
              src="/images/community.jpg"
              alt="Community Environmental Water Monitoring Station"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 right-4 text-xs text-white/90 font-medium lg:hidden">
              Decentralized river & aquifer monitoring station
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Total Observations</div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 mt-1.5">{communityReports.length}</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Verified ground records</div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Verification Rate</div>
          <div className="text-2xl sm:text-3xl font-bold text-env-emerald mt-1.5">94.8%</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Cross-matched vs satellite</div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Privacy Standard</div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 mt-1.5">Zero PII</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Fuzzed coordinates (~1.2km)</div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Model Weight</div>
          <div className="text-2xl sm:text-3xl font-bold text-env-sky mt-1.5">0.20</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Regional stress factor</div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-mono uppercase text-apple-muted dark:text-eco-400 font-semibold mr-1">Filter Domain:</span>
        {[
          { id: 'ALL', label: 'All Observations' },
          { id: 'WATER', label: 'Water Strain', icon: Droplets },
          { id: 'HEAT', label: 'Thermal Island', icon: Flame },
          { id: 'ENERGY', label: 'Energy Grid', icon: Zap },
          { id: 'FLOODING', label: 'Drainage & Floods', icon: Waves },
          { id: 'POLLUTION', label: 'Pollution & Effluent' },
        ].map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CommunityCategory | 'ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-apple-text text-white dark:bg-eco-50 dark:text-eco-950 font-semibold shadow-apple-sm'
                  : 'bg-white dark:bg-eco-900 text-apple-secondary dark:text-eco-300 border border-apple-border dark:border-eco-700/80 hover:bg-apple-subtle dark:hover:bg-eco-850'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Verified Observation Stream */}
      <CommunityFeed reports={displayReports} />

      {/* Privacy Guarantee Footer Card */}
      <div className="p-4 sm:p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-env-emerald/10 border border-env-emerald/20 flex items-center justify-center text-env-emerald shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <p className="text-xs sm:text-sm text-apple-secondary dark:text-eco-300 font-sans leading-relaxed">
          <strong className="text-apple-text dark:text-eco-100 font-semibold">Privacy Protocol:</strong> Contributor phone numbers, IP addresses, names, and precise coordinates are scrubbed before storage. All locations are quantized to protect community members while preserving hydrological cluster validity.
        </p>
      </div>

      {/* Submit Report Modal */}
      {isModalOpen && (
        <CommunityReportModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
