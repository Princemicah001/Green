'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import AlertStream from '@/components/alerts/AlertStream';
import { AlertSeverity } from '@/types';

export default function AlertsPage() {
  const { alerts } = useSentinel();
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'ALL'>('ALL');

  const filteredAlerts = filterSeverity === 'ALL' 
    ? alerts 
    : alerts.filter(a => a.severity === filterSeverity);

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-apple-border dark:border-eco-750 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-apple-muted dark:text-eco-400 font-semibold">
            Automated Threshold Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 tracking-tight mt-1">
            Operational Alerts & Anomaly Feed
          </h1>
          <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-300 font-sans mt-1">
            Real-time event stream generated when multi-sensor stress metrics cross operational baseline boundaries.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-2xl shadow-apple-sm text-xs sm:text-sm font-medium">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filterSeverity === 'ALL'
                ? 'bg-apple-text text-white dark:bg-eco-50 dark:text-eco-950 font-semibold shadow-sm'
                : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('CRITICAL')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filterSeverity === 'CRITICAL'
                ? 'bg-status-critical/10 text-status-critical font-bold border border-status-critical/30'
                : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setFilterSeverity('HIGH')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filterSeverity === 'HIGH'
                ? 'bg-status-stressed/10 text-status-stressed font-bold border border-status-stressed/30'
                : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-800'
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
