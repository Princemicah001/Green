'use client';

import React from 'react';
import { SentinelAlert } from '@/types';
import { useSentinel } from '@/lib/store/sentinelStore';
import { AlertCircle, AlertTriangle, Info, ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';

interface AlertStreamProps {
  alerts: SentinelAlert[];
  showAcknowledge?: boolean;
}

export default function AlertStream({ alerts, showAcknowledge = true }: AlertStreamProps) {
  const { setSelectedLocationId, acknowledgeAlert } = useSentinel();

  return (
    <div className="w-full bg-eco-900 border border-eco-700 rounded overflow-hidden">
      <div className="px-4 py-3 border-b border-eco-750 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-eco-100 font-mono">
          Sentinel Alert Event Stream ({alerts.length})
        </span>
        <span className="text-[11px] font-mono text-eco-400">
          Threshold Trigger Engine: ACTIVE
        </span>
      </div>

      <div className="divide-y divide-eco-800 font-mono">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-xs text-eco-400">
            No active alert triggers registered across monitored regions.
          </div>
        ) : (
          alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 hover:bg-eco-850/40 transition-colors flex flex-col gap-2 ${
                alt.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-eco-400 font-bold">{alt.timeFormatted}</span>
                  <span className="text-eco-600">|</span>

                  <span className={`text-[10px] uppercase px-1.5 py-0.2 rounded border font-medium ${
                    alt.severity === 'CRITICAL' ? 'text-status-critical-text border-status-critical-border bg-status-critical-subtle' :
                    alt.severity === 'HIGH' ? 'text-status-stressed-text border-status-stressed-border bg-status-stressed-subtle' :
                    'text-eco-300 border-eco-700 bg-eco-800'
                  }`}>
                    {alt.severity}
                  </span>

                  <span className="text-eco-100 font-semibold">{alt.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLocationId(alt.locationId)}
                    className="text-[11px] text-eco-300 hover:text-eco-50 flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-eco-800 border border-eco-700 hover:bg-eco-750"
                  >
                    <span>Focus on Globe</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>

                  {showAcknowledge && !alt.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alt.id)}
                      className="text-[11px] text-eco-400 hover:text-eco-200 px-2 py-0.5 rounded border border-eco-800 hover:border-eco-700 transition-colors flex items-center gap-1"
                      title="Acknowledge alert"
                    >
                      <Check className="w-3 h-3" />
                      <span>Ack</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-eco-300 font-sans leading-relaxed">
                {alt.description}
              </p>

              <div className="text-[10px] text-eco-400 flex items-center gap-4">
                <span>Location: {alt.locationName}</span>
                <span>Category: {alt.category}</span>
                <span>Timestamp: {alt.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
