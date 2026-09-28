'use client';

import React, { useState } from 'react';
import { FacilityTelemetry } from '@/types';
import { Server, CheckCircle2, Sliders } from 'lucide-react';
import MitigationSimulatorModal from './MitigationSimulatorModal';

interface FacilityMonitorProps {
  facilities: FacilityTelemetry[];
  selectedLocationName?: string;
  onSimulateMitigation?: (facilityId: string) => void;
}

export default function FacilityMonitor({
  facilities,
  selectedLocationName,
  onSimulateMitigation,
}: FacilityMonitorProps) {
  const [selectedFacilityForMitigation, setSelectedFacilityForMitigation] = useState<FacilityTelemetry | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Clean Table Layout with Apple Styling */}
      <div className="w-full bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card overflow-hidden">
        <div className="px-6 py-4 border-b border-apple-border dark:border-eco-750 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-env-emerald" />
            <span className="text-base sm:text-lg font-bold text-apple-text dark:text-eco-100">
              Monitored Facilities ({facilities.length})
            </span>
          </div>
          <span className="text-xs font-mono text-apple-muted dark:text-eco-400 font-medium">
            SCADA / BMS Integration Status: Live (Sub-second Polling)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-apple-subtle/60 dark:bg-eco-850 text-apple-secondary dark:text-eco-300 text-xs uppercase border-b border-apple-border dark:border-eco-750 font-mono">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Facility / Node</th>
                <th className="py-3.5 px-3 font-semibold">Type</th>
                <th className="py-3.5 px-3 font-semibold text-right">Compute</th>
                <th className="py-3.5 px-3 font-semibold text-right">Power</th>
                <th className="py-3.5 px-3 font-semibold text-right">Water Loop</th>
                <th className="py-3.5 px-3 font-semibold text-right">Cooling</th>
                <th className="py-3.5 px-3 font-semibold text-right">Ambient</th>
                <th className="py-3.5 px-3 font-semibold text-right">Grid</th>
                <th className="py-3.5 px-3 font-semibold text-right">PUE</th>
                <th className="py-3.5 px-6 font-semibold text-right">Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-border/70 dark:divide-eco-800 text-apple-text dark:text-eco-200 text-sm">
              {facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-apple-subtle/50 dark:hover:bg-eco-850/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-apple-text dark:text-eco-50 text-sm sm:text-base">{fac.name}</div>
                    <div className="text-xs text-apple-muted dark:text-eco-400 font-mono mt-0.5">{fac.code} • {fac.locationName}</div>
                  </td>
                  <td className="py-4 px-3 text-apple-secondary dark:text-eco-300 text-xs font-medium">
                    {fac.type}
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className="font-semibold font-mono text-apple-text dark:text-eco-100">{fac.computeLoadPct}%</span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className="font-semibold font-mono text-apple-text dark:text-eco-100">{fac.powerMW.toFixed(1)} MW</span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className={`font-semibold font-mono ${fac.waterConsumptionMLDay > 1.0 ? 'text-status-stressed' : 'text-apple-text dark:text-eco-100'}`}>
                      {fac.waterConsumptionMLDay.toFixed(2)} ML/d
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className={`font-semibold font-mono ${fac.coolingDemandPct > 75 ? 'text-status-stressed' : 'text-apple-text dark:text-eco-100'}`}>
                      {fac.coolingDemandPct}%
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right text-apple-secondary dark:text-eco-300 font-mono">
                    {fac.ambientTempC.toFixed(1)}°C
                  </td>
                  <td className="py-4 px-3 text-right text-apple-secondary dark:text-eco-300 font-mono">
                    {fac.gridStabilityPct}%
                  </td>
                  <td className="py-4 px-3 text-right font-bold font-mono text-apple-text dark:text-eco-100">
                    {fac.pue.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {fac.mitigationActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-sans text-env-emerald px-3 py-1 rounded-full border border-env-emerald/30 bg-env-emerald/10 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedFacilityForMitigation(fac)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 bg-apple-subtle hover:bg-apple-hover dark:bg-eco-800 dark:hover:bg-eco-750 text-apple-text dark:text-eco-100 border border-apple-border dark:border-eco-700 rounded-xl transition-all shadow-apple-sm active:scale-95"
                      >
                        <Sliders className="w-3.5 h-3.5 text-apple-muted" />
                        <span>Simulate</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mitigation Simulation Modal Dialog */}
      {selectedFacilityForMitigation && (
        <MitigationSimulatorModal
          facility={selectedFacilityForMitigation}
          onClose={() => setSelectedFacilityForMitigation(null)}
          onApplyMitigation={(facilityId) => {
            if (onSimulateMitigation) onSimulateMitigation(facilityId);
            setSelectedFacilityForMitigation(null);
          }}
        />
      )}
    </div>
  );
}
