'use client';

import React, { useState } from 'react';
import { FacilityTelemetry } from '@/types';
import { generateMitigationPlan } from '@/lib/intelligence/mitigationEngine';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      <div className="w-full max-w-2xl bg-eco-900 border border-eco-700 rounded shadow-2xl p-7 text-eco-50 font-mono">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-eco-750 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs uppercase tracking-wider text-eco-400 font-semibold">
                Decision Intelligence
              </span>
              <span className="text-xs px-2 py-0.5 bg-eco-800 border border-eco-700 text-eco-200 rounded font-bold">
                SIMULATION
              </span>
            </div>
            <h3 className="text-lg font-bold text-eco-50 mt-1.5">
              Mitigation Response Plan • {facility.code}
            </h3>
            <p className="text-sm text-eco-300 font-sans mt-1">
              Simulate operational workload shedding and evaporative cooling setpoint shifts.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-eco-400 hover:text-eco-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Recommended Actions List */}
        <div className="mb-6">
          <div className="text-xs uppercase tracking-wider text-eco-400 mb-2.5 font-bold">
            Automated Operational Recommendations
          </div>
          <div className="space-y-2 font-sans text-sm">
            {plan.recommendedActions.map((action, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-eco-850 border border-eco-750 rounded text-eco-200">
                <span className="text-eco-400 font-mono text-xs mt-0.5 font-bold">{i + 1}.</span>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Before vs After Impact Comparison (Requirement 21) */}
        <div className="mb-6 bg-eco-950 border border-eco-750 rounded p-5">
          <div className="text-xs uppercase tracking-wider text-eco-400 mb-3.5 flex items-center justify-between font-bold">
            <span>Projected Environmental Relief</span>
            <span className="text-status-healthy font-bold text-sm">
              ↓ {plan.stressReductionPoints} Stress Points
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            {/* Before Column */}
            <div className="space-y-2.5 border-r border-eco-800 pr-5">
              <div className="text-xs text-eco-400 uppercase tracking-wider font-semibold">Before Mitigation</div>
              <div className="flex justify-between py-1.5 border-b border-eco-850">
                <span className="text-eco-300">Water Consumption</span>
                <span className="font-bold text-eco-100">{plan.before.waterConsumptionMLDay} ML/day</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-eco-850">
                <span className="text-eco-300">Energy Draw</span>
                <span className="font-bold text-eco-100">{plan.before.powerMW} MW</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-eco-300">Regional Stress</span>
                <span className="font-bold text-status-stressed">{plan.before.overallStress} / 100</span>
              </div>
            </div>

            {/* After Column */}
            <div className="space-y-2.5 pl-2">
              <div className="text-xs text-status-healthy uppercase tracking-wider font-bold">After Simulated Response</div>
              <div className="flex justify-between py-1.5 border-b border-eco-850">
                <span className="text-eco-300">Water Consumption</span>
                <span className="font-bold text-status-healthy">
                  {plan.after.waterConsumptionMLDay} ML/day (-{plan.waterSavingsPct}%)
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-eco-850">
                <span className="text-eco-300">Energy Draw</span>
                <span className="font-bold text-status-healthy">
                  {plan.after.powerMW} MW (-10%)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-eco-300">Regional Stress</span>
                <span className="font-bold text-status-healthy">{plan.after.overallStress} / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3">
          <span className="text-xs text-eco-400 font-mono">
            Audit logging: Hash generated for ESG compliance
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-eco-800 hover:bg-eco-750 text-eco-300 rounded text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            {isSimulated ? (
              <button
                onClick={() => {
                  onApplyMitigation(facility.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2 bg-status-healthy text-eco-950 font-bold rounded text-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mitigation Applied (Done)</span>
              </button>
            ) : (
              <button
                onClick={handleSimulateResponse}
                className="flex items-center gap-2 px-5 py-2 bg-eco-50 hover:bg-eco-200 text-eco-950 font-bold rounded text-xs transition-colors"
              >
                <span>SIMULATE RESPONSE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
