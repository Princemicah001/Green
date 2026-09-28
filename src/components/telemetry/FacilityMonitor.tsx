'use client';

import React, { useState } from 'react';
import { FacilityTelemetry } from '@/types';
import { Server, CheckCircle2 } from 'lucide-react';
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
      {/* Clean Table Layout (Requirement 19 & 37) */}
      <div className="w-full bg-eco-900 border border-eco-700 rounded overflow-hidden">
        <div className="px-5 py-3.5 border-b border-eco-750 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Server className="w-4.5 h-4.5 text-eco-300" />
            <span className="text-sm font-bold uppercase tracking-wider text-eco-100 font-mono">
              Monitored Critical Facilities ({facilities.length})
            </span>
          </div>
          <span className="text-xs font-mono text-eco-400 font-medium">
            SCADA / BMS Integration Status: Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-mono">
            <thead className="bg-eco-850 text-eco-300 text-xs uppercase border-b border-eco-750">
              <tr>
                <th className="py-3 px-5 font-semibold">Facility / Node</th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-3 font-semibold text-right">Compute</th>
                <th className="py-3 px-3 font-semibold text-right">Power</th>
                <th className="py-3 px-3 font-semibold text-right">Water Loop</th>
                <th className="py-3 px-3 font-semibold text-right">Cooling</th>
                <th className="py-3 px-3 font-semibold text-right">Ambient</th>
                <th className="py-3 px-3 font-semibold text-right">Grid</th>
                <th className="py-3 px-3 font-semibold text-right">PUE</th>
                <th className="py-3 px-5 font-semibold text-right">Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-800 text-eco-200 text-sm">
              {facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-eco-850/60 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-eco-50 text-sm">{fac.name}</div>
                    <div className="text-xs text-eco-400 font-medium mt-0.5">{fac.code} • {fac.locationName}</div>
                  </td>
                  <td className="py-3.5 px-3 text-eco-300 text-xs font-medium">
                    {fac.type}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-semibold text-eco-100">{fac.computeLoadPct}%</span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-semibold text-eco-100">{fac.powerMW.toFixed(1)} MW</span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`font-semibold ${fac.waterConsumptionMLDay > 1.0 ? 'text-status-stressed-text' : 'text-eco-100'}`}>
                      {fac.waterConsumptionMLDay.toFixed(2)} ML/d
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className={`font-semibold ${fac.coolingDemandPct > 75 ? 'text-status-stressed-text' : 'text-eco-100'}`}>
                      {fac.coolingDemandPct}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-eco-300">
                    {fac.ambientTempC.toFixed(1)}°C
                  </td>
                  <td className="py-3.5 px-3 text-right text-eco-300">
                    {fac.gridStabilityPct}%
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-eco-100">
                    {fac.pue.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {fac.mitigationActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-status-healthy px-2.5 py-1 rounded border border-status-healthy-border bg-status-healthy-subtle font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedFacilityForMitigation(fac)}
                        className="text-xs font-mono font-semibold px-3 py-1 bg-eco-800 hover:bg-eco-750 text-eco-100 border border-eco-700 rounded transition-colors"
                      >
                        Simulate →
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
