'use client';

import React from 'react';
import { SentinelAlert } from '@/types';
import { useSentinel } from '@/lib/store/sentinelStore';
import { ArrowUpRight, Check, AlertTriangle } from 'lucide-react';

interface AlertStreamProps {
  alerts: SentinelAlert[];
  showAcknowledge?: boolean;
}

export default function AlertStream({ alerts, showAcknowledge = true }: AlertStreamProps) {
  const { setSelectedLocationId, acknowledgeAlert } = useSentinel();

  return (
    <div className="w-full bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card overflow-hidden">
      <div className="px-6 py-4 border-b border-apple-border dark:border-eco-750 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-env-amber" />
          <span className="text-base font-bold text-apple-text dark:text-eco-100">
            Sentinel Alert Stream ({alerts.length})
          </span>
        </div>
        <span className="text-xs font-mono text-apple-muted dark:text-eco-400 font-medium">
          Automated Threshold Engine: ACTIVE
        </span>
      </div>

      <div className="divide-y divide-apple-border/70 dark:divide-eco-800">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-sm text-apple-secondary dark:text-eco-400">
            No active alert triggers registered across monitored regions.
          </div>
        ) : (
          alerts.map((alt) => {
            const severityBadge =
              alt.severity === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical border-status-critical/30' :
              alt.severity === 'HIGH' ? 'bg-status-stressed/10 text-status-stressed border-status-stressed/30' :
              'bg-status-watch/10 text-status-watch border-status-watch/30';

            return (
              <div
                key={alt.id}
                className={`p-5 sm:p-6 hover:bg-apple-subtle/50 dark:hover:bg-eco-850/40 transition-colors flex flex-col gap-3 ${
                  alt.acknowledged ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-apple-muted dark:text-eco-400 font-mono font-medium text-xs sm:text-sm">
                      {alt.timeFormatted}
                    </span>
                    <span className="text-apple-border dark:text-eco-600">|</span>

                    <span className={`text-xs uppercase px-2.5 py-0.5 rounded-full border font-bold font-mono ${severityBadge}`}>
                      {alt.severity}
                    </span>

                    <span className="text-apple-text dark:text-eco-50 font-bold text-sm sm:text-base">
                      {alt.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLocationId(alt.locationId)}
                      className="text-xs font-medium text-apple-text dark:text-eco-100 flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-xl bg-apple-subtle hover:bg-apple-hover dark:bg-eco-800 dark:hover:bg-eco-750 border border-apple-border dark:border-eco-700 shadow-apple-sm active:scale-95"
                    >
                      <span>Focus on Globe</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    {showAcknowledge && !alt.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alt.id)}
                        className="text-xs font-medium text-apple-secondary dark:text-eco-400 hover:text-env-emerald px-2.5 py-1.5 rounded-xl border border-apple-border dark:border-eco-800 hover:border-env-emerald transition-colors flex items-center gap-1"
                        title="Acknowledge alert"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-200 font-sans leading-relaxed">
                  {alt.description}
                </p>

                <div className="text-xs text-apple-muted dark:text-eco-400 flex flex-wrap items-center gap-4 pt-1 font-sans">
                  <span>Location: <strong className="text-apple-text dark:text-eco-200 font-medium">{alt.locationName}</strong></span>
                  <span>Category: <strong className="text-apple-text dark:text-eco-200 font-medium">{alt.category}</strong></span>
                  <span className="font-mono text-apple-muted">ID: {alt.id}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
