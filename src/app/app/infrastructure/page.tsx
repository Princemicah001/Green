'use client';

import React from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import FacilityMonitor from '@/components/telemetry/FacilityMonitor';
import { Building2, Server, ShieldCheck, Zap, Droplets, Activity } from 'lucide-react';

export default function InfrastructurePage() {
  const { facilities, selectedLocation, simulateMitigationResponse, mitigationPlan } = useSentinel();

  return (
    <div className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-eco-400">
            Critical Assets Telemetry
          </div>
          <h1 className="text-xl font-semibold text-eco-50 tracking-tight mt-0.5">
            Infrastructure Monitoring & Mitigation Plane
          </h1>
          <p className="text-xs text-eco-300 font-sans mt-0.5">
            Continuous SCADA and BMS telemetry across connected cloud facilities, geothermal nodes, and subsea landing hubs.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-eco-900 border border-eco-700 rounded text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-status-healthy animate-pulse" />
          <span className="text-eco-200">5 Facilities Monitored</span>
        </div>
      </div>

      {/* Aggregate Telemetry Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Total Power Draw</div>
          <div className="text-xl font-bold text-eco-50 mt-1">20.3 MW</div>
          <div className="text-[10px] text-eco-400 mt-1">Across 5 monitored hubs</div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Cooling Water Consumption</div>
          <div className="text-xl font-bold text-status-stressed mt-1">3.80 ML/day</div>
          <div className="text-[10px] text-eco-400 mt-1">Evaporative cooling intake</div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Average Regional PUE</div>
          <div className="text-xl font-bold text-eco-100 mt-1">1.21</div>
          <div className="text-[10px] text-eco-400 mt-1">Power Usage Effectiveness</div>
        </div>

        <div className="p-3 bg-eco-900 border border-eco-700 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Mitigation Status</div>
          <div className="text-xl font-bold text-status-healthy mt-1">
            {facilities.filter(f => f.mitigationActive).length > 0 ? 'Active' : 'Standby'}
          </div>
          <div className="text-[10px] text-eco-400 mt-1">Closed-loop & batch shed</div>
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
        <div className="p-4 bg-eco-900 border border-status-healthy-border rounded text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-status-healthy font-semibold">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Active Mitigation Simulation Plan ({mitigationPlan.id})</span>
            </span>
            <span>Relief: -{mitigationPlan.stressReductionPoints} Stress Points</span>
          </div>

          <div className="text-eco-300 font-sans text-xs">
            Applied simulated closed-loop cooling and batch job shedding. Water draw reduced by {mitigationPlan.waterSavingsPct}%, regional stress reduced from {mitigationPlan.before.overallStress} to {mitigationPlan.after.overallStress}.
          </div>
        </div>
      )}
    </div>
  );
}
