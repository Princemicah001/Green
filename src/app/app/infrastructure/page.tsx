'use client';

import React from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import FacilityMonitor from '@/components/telemetry/FacilityMonitor';
import { ShieldCheck } from 'lucide-react';

export default function InfrastructurePage() {
  const { facilities, selectedLocation, simulateMitigationResponse, mitigationPlan } = useSentinel();

  return (
    <div className="flex-1 p-5 md:p-7 max-w-7xl w-full mx-auto space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-eco-400 font-semibold">
            Critical Assets Telemetry
          </div>
          <h1 className="text-2xl font-bold text-eco-50 tracking-tight mt-1">
            Infrastructure Monitoring & Mitigation Plane
          </h1>
          <p className="text-sm text-eco-300 font-sans mt-1">
            Continuous SCADA and BMS telemetry across connected cloud facilities, geothermal nodes, and subsea landing hubs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-2 bg-eco-900 border border-eco-700 rounded text-xs font-mono font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-status-healthy animate-pulse" />
          <span className="text-eco-100">5 Facilities Monitored</span>
        </div>
      </div>

      {/* Aggregate Telemetry Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
        <div className="p-4 bg-eco-900 border border-eco-700 rounded">
          <div className="text-xs text-eco-400 uppercase font-semibold">Total Power Draw</div>
          <div className="text-2xl font-bold text-eco-50 mt-1">20.3 MW</div>
          <div className="text-xs text-eco-400 mt-1">Across 5 monitored hubs</div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded">
          <div className="text-xs text-eco-400 uppercase font-semibold">Cooling Water Consumption</div>
          <div className="text-2xl font-bold text-status-stressed mt-1">3.80 ML/day</div>
          <div className="text-xs text-eco-400 mt-1">Evaporative cooling intake</div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded">
          <div className="text-xs text-eco-400 uppercase font-semibold">Average Regional PUE</div>
          <div className="text-2xl font-bold text-eco-100 mt-1">1.21</div>
          <div className="text-xs text-eco-400 mt-1">Power Usage Effectiveness</div>
        </div>

        <div className="p-4 bg-eco-900 border border-eco-700 rounded">
          <div className="text-xs text-eco-400 uppercase font-semibold">Mitigation Status</div>
          <div className="text-2xl font-bold text-status-healthy mt-1">
            {facilities.filter(f => f.mitigationActive).length > 0 ? 'Active' : 'Standby'}
          </div>
          <div className="text-xs text-eco-400 mt-1">Closed-loop & batch shed</div>
        </div>
      </div>

      {/* Facility Telemetry Table & Mitigation Simulation Trigger (Requirement 19 & 21) */}
      <FacilityMonitor
        facilities={facilities}
        selectedLocationName={selectedLocation.name}
        onSimulateMitigation={simulateMitigationResponse}
      />

      {/* Mitigation Simulation Audit Log / Active Plan Notice */}
      {mitigationPlan && (
        <div className="p-5 bg-eco-900 border border-status-healthy-border rounded text-sm font-mono space-y-2.5">
          <div className="flex items-center justify-between text-status-healthy font-bold text-sm">
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5" />
              <span>Active Mitigation Simulation Plan ({mitigationPlan.id})</span>
            </span>
            <span>Relief: -{mitigationPlan.stressReductionPoints} Stress Points</span>
          </div>

          <div className="text-eco-200 font-sans text-sm leading-relaxed">
            Applied simulated closed-loop cooling and batch job shedding. Water draw reduced by {mitigationPlan.waterSavingsPct}%, regional stress reduced from {mitigationPlan.before.overallStress} to {mitigationPlan.after.overallStress}.
          </div>
        </div>
      )}
    </div>
  );
}
