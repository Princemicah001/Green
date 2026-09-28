'use client';

import React from 'react';
import { CommunityReport } from '@/types';

interface CommunityFeedProps {
  reports: CommunityReport[];
}

export default function CommunityFeed({ reports }: CommunityFeedProps) {
  return (
    <div className="w-full bg-eco-900 border border-eco-700 rounded overflow-hidden">
      <div className="px-5 py-3.5 border-b border-eco-750 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wider text-eco-100 font-mono">
          Verified Ground Intelligence Stream ({reports.length})
        </span>
        <span className="text-xs font-mono text-eco-400 font-medium">
          Anonymized Token Protocol: ACTIVE
        </span>
      </div>

      <div className="divide-y divide-eco-800">
        {reports.map((rep) => (
          <div key={rep.id} className="p-5 hover:bg-eco-850/40 transition-colors flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5 text-sm font-mono">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-eco-50 text-sm">{rep.anonymousId}</span>
                <span className="text-eco-500">•</span>
                <span className="text-eco-200 font-medium">{rep.locationName}</span>
                <span className="text-eco-500">•</span>
                <span className="text-eco-400">{rep.category}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`text-xs px-2 py-0.5 rounded border uppercase font-bold ${
                  rep.severity === 'CRITICAL' ? 'text-status-critical-text border-status-critical-border bg-status-critical-subtle' :
                  rep.severity === 'HIGH' ? 'text-status-stressed-text border-status-stressed-border bg-status-stressed-subtle' :
                  rep.severity === 'MEDIUM' ? 'text-status-watch-text border-status-watch-border bg-status-watch-subtle' :
                  'text-status-healthy-text border-status-healthy-border bg-status-healthy-subtle'
                }`}>
                  {rep.severity}
                </span>

                <span className="text-xs px-2 py-0.5 rounded border border-eco-700 bg-eco-800 text-eco-300 font-medium">
                  {rep.verificationStatus} ({rep.confidenceScore}%)
                </span>

                <span className="text-xs text-eco-400">
                  {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <p className="text-sm text-eco-100 font-sans leading-relaxed">
              {rep.observation}
            </p>

            <div className="text-xs font-mono text-eco-400 flex items-center gap-4">
              <span>Approx. Coordinates: <strong className="text-eco-300 font-normal">{rep.approximateLat.toFixed(2)}°N, {rep.approximateLng.toFixed(2)}°E</strong></span>
              <span>Cluster Correlation: <strong className="text-eco-300 font-normal">High</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
