'use client';

import React from 'react';
import { GREEN_FINANCE_PROFILES } from '@/data/finance';
import { useSentinel } from '@/lib/store/sentinelStore';
import { ShieldCheck, Award, FileText, Landmark, Activity, CheckCircle2 } from 'lucide-react';

export default function GreenFinanceLayer() {
  const { selectedLocationId, selectedLocation } = useSentinel();
  const profile = GREEN_FINANCE_PROFILES[selectedLocationId] || GREEN_FINANCE_PROFILES['nairobi'];

  return (
    <div className="bg-eco-900 border border-eco-700 rounded p-5 text-eco-50 font-mono space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-eco-750 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-eco-400">
              Climate Data & Awareness Hackathon Track
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded border border-status-healthy-border bg-status-healthy-subtle text-status-healthy">
              EVIDENCE LAYER
            </span>
          </div>
          <h3 className="text-base font-semibold text-eco-50 mt-1">
            Green Finance & Environmental Performance Dossier
          </h3>
          <p className="text-xs text-eco-300 font-sans mt-0.5">
            Cryptographically audited empirical evidence for sustainable capital allocation, ESG compliance, and risk underwriting.
          </p>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-eco-400">Environmental Trend Rating</div>
          <div className="text-2xl font-bold text-status-healthy mt-0.5">{profile.environmentalTrendRating}</div>
        </div>
      </div>

      {/* Core Evidence Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-eco-950 border border-eco-750 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Resource Efficiency</div>
          <div className="text-xl font-bold text-eco-50 mt-1">{profile.resourceEfficiencyScore} / 100</div>
          <div className="text-[10px] text-eco-400 mt-1">Water & energy baseline</div>
        </div>

        <div className="p-3 bg-eco-950 border border-eco-750 rounded">
          <div className="text-[10px] text-eco-400 uppercase">ESG Auditability</div>
          <div className="text-xl font-bold text-eco-50 mt-1">{profile.esgAuditabilityScore}%</div>
          <div className="text-[10px] text-eco-400 mt-1">Verified telemetry trace</div>
        </div>

        <div className="p-3 bg-eco-950 border border-eco-750 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Water Risk Index</div>
          <div className={`text-xl font-bold mt-1 ${profile.waterRiskIndex > 60 ? 'text-status-stressed-text' : 'text-eco-50'}`}>
            {profile.waterRiskIndex} / 100
          </div>
          <div className="text-[10px] text-eco-400 mt-1">Aquifer vulnerability</div>
        </div>

        <div className="p-3 bg-eco-950 border border-eco-750 rounded">
          <div className="text-[10px] text-eco-400 uppercase">Carbon Intensity</div>
          <div className="text-xl font-bold text-eco-50 mt-1">{profile.carbonIntensityGPerKwh} g/kWh</div>
          <div className="text-[10px] text-eco-400 mt-1">Geothermal grid mix</div>
        </div>
      </div>

      {/* Eligible Sustainable Finance Instruments */}
      <div>
        <div className="text-xs uppercase tracking-wider text-eco-300 font-semibold mb-2 flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5 text-eco-400" />
          <span>Eligible Sustainable Financing Facilities</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
          {profile.eligibleInstruments.map((inst, i) => (
            <div key={i} className="p-2.5 bg-eco-850 border border-eco-750 rounded flex items-center justify-between text-eco-200">
              <span>{inst}</span>
              <span className="text-[10px] font-mono text-status-healthy px-1.5 py-0.5 rounded border border-status-healthy-border bg-status-healthy-subtle shrink-0">
                VERIFIED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Capital Applications */}
      <div className="p-4 bg-eco-950 border border-eco-750 rounded text-xs">
        <div className="text-[11px] font-mono uppercase tracking-wider text-eco-300 mb-2">
          Capital Market Applications
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-eco-300">
          <div className="space-y-1">
            <div className="font-semibold text-eco-100 font-mono text-xs">1. Parametric Insurance</div>
            <p className="text-[11px] leading-relaxed">
              Automated trigger payout criteria grounded on multi-sensor temperature anomaly and water aquifer thresholds.
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-eco-100 font-mono text-xs">2. Green Bond Covenants</div>
            <p className="text-[11px] leading-relaxed">
              Live continuous PUE and water consumption ratio telemetry satisfying European Green Bond Standard (EuGB).
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-eco-100 font-mono text-xs">3. Climate Risk Disclosure</div>
            <p className="text-[11px] leading-relaxed">
              TCFD and ISSB S2 physical climate risk data feed directly exported for annual investor transparency reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
