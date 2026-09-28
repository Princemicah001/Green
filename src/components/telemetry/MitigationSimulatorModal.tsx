'use client';

import React, { useState } from 'react';
import { FacilityTelemetry } from '@/types';
import { generateMitigationPlan } from '@/lib/intelligence/mitigationEngine';
import { X, ArrowRight, ShieldCheck, Cpu, Droplets, Zap, CheckCircle2 } from 'lucide-react';
import { useSentinel } from '@/lib/store/sentinelStore';

interface MitigationSimulatorModalProps {
  facility: FacilityTelemetry;
  onClose: () => void;
  onApplyMitigation: (facilityId: string) => void;
}

export default function MitigationSimulatorModal({
  facility,
  onClose,
  onApplyMitigation,
}: MitigationSimulatorModalProps) {
  const { selectedLocation, simulateMitigationResponse } = useSentinel();
  const [isSimulated, setIsSimulated] = useState(false);

  // Generate plan for display
  const plan = generateMitigationPlan(facility, selectedLocation.overallStress);

  const handleSimulateResponse = () => {
    simulateMitigationResponse(facility.id);
    setIsSimulated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-eco-900 border border-eco-700 rounded shadow-2xl p-6 text-eco-50 font-mono">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-eco-750 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-eco-400">
                Decision Intelligence
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-eco-800 border border-eco-700 text-eco-300 rounded">
                SIMULATION
              </span>
            </div>
            <h3 className="text-base font-semibold text-eco-50 mt-1">
              Mitigation Response Plan • {facility.code}
            </h3>
            <p className="text-xs text-eco-300 font-sans mt-0.5">
              Simulate operational workload shedding and evaporative cooling setpoint shifts.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-eco-400 hover:text-eco-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Recommended Actions List */}
        <div className="mb-5">
          <div className="text-[10px] uppercase tracking-wider text-eco-400 mb-2">
            Automated Operational Recommendations
          </div>
          <div className="space-y-1.5 font-sans text-xs">
            {plan.recommendedActions.map((action, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-eco-850 border border-eco-750 rounded text-eco-200">
                <span className="text-eco-400 font-mono text-[11px] mt-0.5">{i + 1}.</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Before vs After Impact Comparison (Requirement 21) */}
        <div className="mb-6 bg-eco-950 border border-eco-750 rounded p-4">
          <div className="text-[10px] uppercase tracking-wider text-eco-400 mb-3 flex items-center justify-between">
            <span>Projected Environmental Relief</span>
            <span className="text-status-healthy font-semibold">
              ↓ {plan.stressReductionPoints} Stress Points
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Before Column */}
            <div className="space-y-2 border-r border-eco-800 pr-4">
              <div className="text-[11px] text-eco-400 uppercase tracking-wider">Before Mitigation</div>
              <div className="flex justify-between py-1 border-b border-eco-850">
                <span className="text-eco-400">Water Consumption</span>
                <span className="font-semibold text-eco-100">{plan.before.waterConsumptionMLDay} ML/day</span>
              </div>
              <div className="flex justify-between py-1 border-b border-eco-850">
                <span className="text-eco-400">Energy Draw</span>
                <span className="font-semibold text-eco-100">{plan.before.powerMW} MW</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-eco-400">Regional Stress</span>
                <span className="font-semibold text-status-stressed">{plan.before.overallStress} / 100</span>
              </div>
            </div>

            {/* After Column */}
            <div className="space-y-2 pl-2">
              <div className="text-[11px] text-status-healthy uppercase tracking-wider">After Simulated Response</div>
              <div className="flex justify-between py-1 border-b border-eco-850">
                <span className="text-eco-400">Water Consumption</span>
                <span className="font-semibold text-status-healthy">
                  {plan.after.waterConsumptionMLDay} ML/day (-{plan.waterSavingsPct}%)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-eco-850">
                <span className="text-eco-400">Energy Draw</span>
                <span className="font-semibold text-status-healthy">
                  {plan.after.powerMW} MW (-10%)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-eco-400">Regional Stress</span>
                <span className="font-semibold text-status-healthy">{plan.after.overallStress} / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[10px] text-eco-400">
            Audit logging: Hash generated for ESG compliance
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-eco-800 hover:bg-eco-750 text-eco-300 rounded text-xs transition-colors"
            >
              Cancel
            </button>

            {isSimulated ? (
              <button
                onClick={() => {
                  onApplyMitigation(facility.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-status-healthy text-eco-950 font-semibold rounded text-xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mitigation Applied (Done)</span>
              </button>
            ) : (
              <button
                onClick={handleSimulateResponse}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-eco-50 hover:bg-eco-200 text-eco-950 font-semibold rounded text-xs transition-colors"
              >
                <span>SIMULATE RESPONSE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
