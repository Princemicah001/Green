'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import AlertStream from '@/components/alerts/AlertStream';
import { AlertSeverity } from '@/types';
import { AlertTriangle, Bell, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, resetAllDemoData } = useSentinel();
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'ALL'>('ALL');

  const filteredAlerts = filterSeverity === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.severity === filterSeverity);

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;

  return (
    <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-eco-400">
            Automated Threshold Engine
          </div>
          <h1 className="text-xl font-semibold text-eco-50 tracking-tight mt-0.5">
            Operational Alerts & Anomaly Feed
          </h1>
          <p className="text-xs text-eco-300 font-sans mt-0.5">
            Restrained event stream generated when multi-sensor stress metrics cross operational boundaries.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-eco-900 border border-eco-700 rounded text-xs font-mono">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3 py-1 rounded transition-colors ${
              filterSeverity === 'ALL'
                ? 'bg-eco-750 text-eco-50 font-semibold border border-eco-600'
                : 'text-eco-400 hover:text-eco-200'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('CRITICAL')}
            className={`px-3 py-1 rounded transition-colors ${
              filterSeverity === 'CRITICAL'
                ? 'bg-status-critical-subtle text-status-critical-text font-semibold border border-status-critical-border'
                : 'text-eco-400 hover:text-eco-200'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setFilterSeverity('HIGH')}
            className={`px-3 py-1 rounded transition-colors ${
              filterSeverity === 'HIGH'
                ? 'bg-status-stressed-subtle text-status-stressed-text font-semibold border border-status-stressed-border'
                : 'text-eco-400 hover:text-eco-200'
            }`}
          >
            High ({highCount})
          </button>
        </div>
      </div>

      {/* Alert Stream Component */}
      <AlertStream alerts={filteredAlerts} showAcknowledge={true} />
    </div>
  );
}
