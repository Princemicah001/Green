'use client';

import React, { useState } from 'react';
import { FacilityTelemetry } from '@/types';
import { Server, Zap, Droplets, Thermometer, Gauge, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';
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
        <div className="px-4 py-3 border-b border-eco-750 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-eco-300" />
            <span className="text-xs font-semibold uppercase tracking-wider text-eco-100 font-mono">
              Monitored Critical Facilities ({facilities.length})
            </span>
          </div>
          <span className="text-[11px] font-mono text-eco-400">
            SCADA / BMS Integration Status: Live
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-eco-850 text-eco-400 text-[10px] uppercase border-b border-eco-750">
              <tr>
                <th className="py-2.5 px-4 font-medium">Facility / Node</th>
                <th className="py-2.5 px-3 font-medium">Type</th>
                <th className="py-2.5 px-3 font-medium text-right">Compute</th>
                <th className="py-2.5 px-3 font-medium text-right">Power</th>
                <th className="py-2.5 px-3 font-medium text-right">Water Loop</th>
                <th className="py-2.5 px-3 font-medium text-right">Cooling</th>
                <th className="py-2.5 px-3 font-medium text-right">Ambient</th>
                <th className="py-2.5 px-3 font-medium text-right">Grid</th>
                <th className="py-2.5 px-3 font-medium text-right">PUE</th>
                <th className="py-2.5 px-4 font-medium text-right">Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-eco-800 text-eco-200">
              {facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-eco-850/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-eco-50">{fac.name}</div>
                    <div className="text-[10px] text-eco-400">{fac.code} • {fac.locationName}</div>
                  </td>
                  <td className="py-3 px-3 text-eco-300 text-[11px]">
                    {fac.type}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-medium text-eco-100">{fac.computeLoadPct}%</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="font-medium text-eco-100">{fac.powerMW.toFixed(1)} MW</span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`font-medium ${fac.waterConsumptionMLDay > 1.0 ? 'text-status-stressed-text' : 'text-eco-100'}`}>
                      {fac.waterConsumptionMLDay.toFixed(2)} ML/d
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`font-medium ${fac.coolingDemandPct > 75 ? 'text-status-stressed-text' : 'text-eco-100'}`}>
                      {fac.coolingDemandPct}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-eco-300">
                    {fac.ambientTempC.toFixed(1)}°C
                  </td>
                  <td className="py-3 px-3 text-right text-eco-300">
                    {fac.gridStabilityPct}%
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-eco-100">
                    {fac.pue.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {fac.mitigationActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-status-healthy px-2 py-0.5 rounded border border-status-healthy-border bg-status-healthy-subtle">
                        <CheckCircle2 className="w-3 h-3" />
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedFacilityForMitigation(fac)}
                        className="text-[11px] font-mono px-2.5 py-1 bg-eco-800 hover:bg-eco-750 text-eco-100 border border-eco-700 rounded transition-colors"
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
