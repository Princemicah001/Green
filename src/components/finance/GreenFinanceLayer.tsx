'use client';

import React from 'react';
import { GREEN_FINANCE_PROFILES } from '@/data/finance';
import { useSentinel } from '@/lib/store/sentinelStore';
import { Landmark } from 'lucide-react';

export default function GreenFinanceLayer() {
  const { selectedLocationId } = useSentinel();
  const profile = GREEN_FINANCE_PROFILES[selectedLocationId] || GREEN_FINANCE_PROFILES['nairobi'];

  return (
    <div className="bg-eco-900 border border-eco-700 rounded p-6 text-eco-50 font-mono space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs uppercase tracking-wider text-eco-400 font-semibold">
              Climate Data & Awareness Hackathon Track
            </span>
            <span className="text-xs px-2 py-0.5 rounded border border-status-healthy-border bg-status-healthy-subtle text-status-healthy font-bold">
              EVIDENCE LAYER
            </span>
          </div>
          <h3 className="text-lg font-bold text-eco-50 mt-1.5">
            Green Finance & Environmental Performance Dossier
          </h3>
          <p className="text-sm text-eco-300 font-sans mt-1">
            Cryptographically audited empirical evidence for sustainable capital allocation, ESG compliance, and risk underwriting.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-eco-400 font-medium">Environmental Trend Rating</div>
          <div className="text-3xl font-bold text-status-healthy mt-0.5">{profile.environmentalTrendRating}</div>
        </div>
      </div>

      {/* Core Evidence Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-4 bg-eco-950 border border-eco-750 rounded">
          <div className="text-xs text-eco-400 uppercase font-semibold">Resource Efficiency</div>
          <div className="text-2xl font-bold text-eco-50 mt-1">{profile.resourceEfficiencyScore} / 100</div>
          <div className="text-xs text-eco-400 mt-1">Water & energy baseline</div>
        </div>

        <div className="p-4 bg-eco-950 border border-eco-750 rounded">
          <div className="text-xs text-eco-400 uppercase font-semibold">ESG Auditability</div>
          <div className="text-2xl font-bold text-eco-50 mt-1">{profile.esgAuditabilityScore}%</div>
          <div className="text-xs text-eco-400 mt-1">Verified telemetry trace</div>
        </div>

        <div className="p-4 bg-eco-950 border border-eco-750 rounded">
          <div className="text-xs text-eco-400 uppercase font-semibold">Water Risk Index</div>
          <div className={`text-2xl font-bold mt-1 ${profile.waterRiskIndex > 60 ? 'text-status-stressed-text' : 'text-eco-50'}`}>
            {profile.waterRiskIndex} / 100
          </div>
          <div className="text-xs text-eco-400 mt-1">Aquifer vulnerability</div>
        </div>

        <div className="p-4 bg-eco-950 border border-eco-750 rounded">
          <div className="text-xs text-eco-400 uppercase font-semibold">Carbon Intensity</div>
          <div className="text-2xl font-bold text-eco-50 mt-1">{profile.carbonIntensityGPerKwh} g/kWh</div>
          <div className="text-xs text-eco-400 mt-1">Geothermal grid mix</div>
        </div>
      </div>

      {/* Eligible Sustainable Finance Instruments */}
      <div>
        <div className="text-sm uppercase tracking-wider text-eco-200 font-bold mb-3 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-eco-400" />
          <span>Eligible Sustainable Financing Facilities</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm font-sans">
          {profile.eligibleInstruments.map((inst, i) => (
            <div key={i} className="p-3 bg-eco-850 border border-eco-750 rounded flex items-center justify-between text-eco-200">
              <span className="font-medium">{inst}</span>
              <span className="text-xs font-mono font-bold text-status-healthy px-2 py-0.5 rounded border border-status-healthy-border bg-status-healthy-subtle shrink-0">
                VERIFIED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Capital Applications */}
      <div className="p-5 bg-eco-950 border border-eco-750 rounded text-sm">
        <div className="text-xs font-mono uppercase tracking-wider text-eco-200 font-bold mb-3">
          Capital Market Applications
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-eco-300">
          <div className="space-y-1.5">
            <div className="font-bold text-eco-100 font-mono text-sm">1. Parametric Insurance</div>
            <p className="text-xs leading-relaxed text-eco-300">
              Automated trigger payout criteria grounded on multi-sensor temperature anomaly and water aquifer thresholds.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-eco-100 font-mono text-sm">2. Green Bond Covenants</div>
            <p className="text-xs leading-relaxed text-eco-300">
              Live continuous PUE and water consumption ratio telemetry satisfying European Green Bond Standard (EuGB).
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-eco-100 font-mono text-sm">3. Climate Risk Disclosure</div>
            <p className="text-xs leading-relaxed text-eco-300">
              TCFD and ISSB S2 physical climate risk data feed directly exported for annual investor transparency reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
