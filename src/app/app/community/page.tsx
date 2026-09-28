'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityReportModal from '@/components/community/CommunityReportModal';
import { Users, Plus, ShieldCheck, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export default function CommunityPage() {
  const { communityReports, locationReports, selectedLocation, selectedLocationId } = useSentinel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterBySelectedLocation, setFilterBySelectedLocation] = useState(false);

  const displayReports = filterBySelectedLocation ? locationReports : communityReports;

  return (
    <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-eco-400">
            Ground Telemetry Integration
          </div>
          <h1 className="text-xl font-semibold text-eco-50 tracking-tight mt-0.5">
            Community Observation Network
          </h1>
          <p className="text-xs text-eco-300 font-sans mt-0.5">
            Decentralized ground observations cross-referenced with satellite radiance and infrastructure SCADA feeds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFilterBySelectedLocation(!filterBySelectedLocation)}
            className={`px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
              filterBySelectedLocation
                ? 'bg-eco-750 text-eco-50 border-eco-600'
                : 'text-eco-400 border-eco-800 hover:text-eco-200'
            }`}
          >
            {filterBySelectedLocation ? `Filter: ${selectedLocation.name}` : 'Showing: All Regions'}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-eco-50 hover:bg-eco-200 text-eco-950 font-semibold text-xs font-mono rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Observation</span>
          </button>
        </div>
      </div>

      {/* Pipeline Status & Privacy Architecture Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Total Reports Ingested</div>
          <div className="text-xl font-bold text-eco-50 mt-1">{communityReports.length}</div>
          <div className="text-[10px] text-eco-400 mt-1">Verified ground traces</div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Cross-Reference Rate</div>
          <div className="text-xl font-bold text-status-healthy mt-1">94.8%</div>
          <div className="text-[10px] text-eco-400 mt-1">Validated vs telemetry</div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Privacy Standard</div>
          <div className="text-xl font-bold text-eco-100 mt-1">Zero-PII</div>
          <div className="text-[10px] text-eco-400 mt-1">Cryptographic tokens</div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Regional Signal Weight</div>
          <div className="text-xl font-bold text-eco-100 mt-1">0.20</div>
          <div className="text-[10px] text-eco-400 mt-1">Stress engine factor</div>
        </div>
      </div>

      {/* Privacy Architecture Notice Box (Requirement 18) */}
      <div className="p-4 bg-eco-900/60 border border-eco-700 rounded text-xs space-y-1.5 font-mono">
        <div className="flex items-center gap-2 text-eco-200 font-semibold">
          <Lock className="w-4 h-4 text-status-healthy" />
          <span>Community Privacy & Anonymization Architecture</span>
        </div>
        <p className="text-eco-300 font-sans leading-relaxed text-xs">
          The Eco-Shield Sentinel Network strictly strips contributor phone numbers, IP addresses, names, and precise GPS coordinates prior to database insertion. Geographic coordinates are quantized (~1.2km fuzzing) to protect privacy while preserving regional hydrological and thermal cluster validity.
        </p>
      </div>

      {/* Verified Ground Observation Stream */}
      <CommunityFeed reports={displayReports} />

      {/* Submit Report Modal */}
      {isModalOpen && (
        <CommunityReportModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
