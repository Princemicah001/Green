'use client';

import React from 'react';
import { CommunityReport } from '@/types';
import { MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface CommunityFeedProps {
  reports: CommunityReport[];
}

export default function CommunityFeed({ reports }: CommunityFeedProps) {
  if (reports.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl p-10 text-center shadow-apple-card space-y-3">
        <div className="w-12 h-12 rounded-full bg-apple-subtle dark:bg-eco-800 flex items-center justify-center mx-auto text-apple-muted dark:text-eco-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-apple-text dark:text-eco-100">No Observations Match Current Filter</h3>
        <p className="text-sm text-apple-secondary dark:text-eco-300 max-w-md mx-auto">
          Try selecting another category or switching to all regions to view active ground signals.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-apple-text dark:text-eco-100">
            Verified Ground Observations
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-apple-subtle dark:bg-eco-800 text-xs font-mono font-semibold text-apple-secondary dark:text-eco-300 border border-apple-border dark:border-eco-700">
            {reports.length} Signals
          </span>
        </div>
        <div className="text-xs font-medium text-env-emerald flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span className="hidden sm:inline">Telemetry Validated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {reports.map((rep) => {
          const categoryColor = 
            rep.category === 'WATER' ? 'text-env-sky bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800' :
            rep.category === 'HEAT' ? 'text-env-amber bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' :
            rep.category === 'ENERGY' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' :
            rep.category === 'FLOODING' ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800' :
            'text-env-emerald bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';

          const severityBadge =
            rep.severity === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical border-status-critical/30' :
            rep.severity === 'HIGH' ? 'bg-status-stressed/10 text-status-stressed border-status-stressed/30' :
            rep.severity === 'MEDIUM' ? 'bg-status-watch/10 text-status-watch border-status-watch/30' :
            'bg-status-healthy/10 text-status-healthy border-status-healthy/30';

          return (
            <div 
              key={rep.id} 
              className="p-5 sm:p-6 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card hover:shadow-apple-hover transition-all flex flex-col gap-3 group"
            >
              {/* Header row: ID, Basin, Category, Severity */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${categoryColor}`}>
                    {rep.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${severityBadge}`}>
                    {rep.severity}
                  </span>
                  <span className="font-mono text-apple-muted dark:text-eco-400 text-xs">
                    {rep.anonymousId}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-apple-muted dark:text-eco-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-apple-subtle dark:bg-eco-800 text-apple-secondary dark:text-eco-300 border border-apple-border dark:border-eco-700 text-xs font-mono font-medium">
                    {rep.verificationStatus} ({rep.confidenceScore}%)
                  </span>
                </div>
              </div>

              {/* Main Observation Text (Larger, readable font) */}
              <p className="text-base sm:text-lg text-apple-text dark:text-eco-50 font-sans leading-relaxed">
                {rep.observation}
              </p>

              {/* Footer Location & Correlation */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-apple-border/60 dark:border-eco-800 text-xs sm:text-sm text-apple-secondary dark:text-eco-400">
                <div className="flex items-center gap-1.5 font-medium text-apple-text dark:text-eco-200">
                  <MapPin className="w-4 h-4 text-env-emerald" />
                  <span>{rep.locationName}</span>
                  <span className="text-apple-muted dark:text-eco-500 font-mono text-xs">
                    ({rep.approximateLat.toFixed(2)}°N, {rep.approximateLng.toFixed(2)}°E)
                  </span>
                </div>

                <div className="text-xs text-apple-muted dark:text-eco-400">
                  Correlation: <span className="text-env-emerald font-semibold">Confirmed by Satellite</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
