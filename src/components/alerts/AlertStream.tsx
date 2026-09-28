'use client';

import React from 'react';
import { SentinelAlert } from '@/types';
import { useSentinel } from '@/lib/store/sentinelStore';
import { ArrowUpRight, Check } from 'lucide-react';

interface AlertStreamProps {
  alerts: SentinelAlert[];
  showAcknowledge?: boolean;
}

export default function AlertStream({ alerts, showAcknowledge = true }: AlertStreamProps) {
  const { setSelectedLocationId, acknowledgeAlert } = useSentinel();

  return (
    <div className="w-full bg-eco-900 border border-eco-700 rounded overflow-hidden">
      <div className="px-5 py-3.5 border-b border-eco-750 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wider text-eco-100 font-mono">
          Sentinel Alert Event Stream ({alerts.length})
        </span>
        <span className="text-xs font-mono text-eco-400">
          Threshold Trigger Engine: ACTIVE
        </span>
      </div>

      <div className="divide-y divide-eco-800 font-mono">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-sm text-eco-400">
            No active alert triggers registered across monitored regions.
          </div>
        ) : (
          alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-5 hover:bg-eco-850/40 transition-colors flex flex-col gap-2.5 ${
                alt.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-eco-400 font-bold text-sm">{alt.timeFormatted}</span>
                  <span className="text-eco-600">|</span>

                  <span className={`text-xs uppercase px-2 py-0.5 rounded border font-bold ${
                    alt.severity === 'CRITICAL' ? 'text-status-critical-text border-status-critical-border bg-status-critical-subtle' :
                    alt.severity === 'HIGH' ? 'text-status-stressed-text border-status-stressed-border bg-status-stressed-subtle' :
                    'text-eco-300 border-eco-700 bg-eco-800'
                  }`}>
                    {alt.severity}
                  </span>

                  <span className="text-eco-50 font-bold text-sm">{alt.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLocationId(alt.locationId)}
                    className="text-xs text-eco-200 hover:text-eco-50 flex items-center gap-1.5 transition-colors px-3 py-1 rounded bg-eco-800 border border-eco-700 hover:bg-eco-750 font-semibold"
                  >
                    <span>Focus on Globe</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  {showAcknowledge && !alt.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alt.id)}
                      className="text-xs text-eco-400 hover:text-eco-200 px-2.5 py-1 rounded border border-eco-800 hover:border-eco-700 transition-colors flex items-center gap-1 font-semibold"
                      title="Acknowledge alert"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Ack</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-eco-200 font-sans leading-relaxed">
                {alt.description}
              </p>

              <div className="text-xs text-eco-400 flex items-center gap-4">
                <span>Location: <strong className="text-eco-300 font-normal">{alt.locationName}</strong></span>
                <span>Category: <strong className="text-eco-300 font-normal">{alt.category}</strong></span>
                <span>Timestamp: <strong className="text-eco-300 font-normal">{alt.timestamp}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
