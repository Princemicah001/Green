'use client';

import React from 'react';
import { GREEN_FINANCE_PROFILES } from '@/data/finance';
import { useSentinel } from '@/lib/store/sentinelStore';
import { Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function GreenFinanceLayer() {
  const { selectedLocationId } = useSentinel();
  const profile = GREEN_FINANCE_PROFILES[selectedLocationId] || GREEN_FINANCE_PROFILES['nairobi'];

  return (
    <div className="bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card p-6 sm:p-8 text-apple-text dark:text-eco-50 font-sans space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-apple-border dark:border-eco-750 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold font-mono">
              Environmental Performance & Funding Readiness
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-env-emerald/10 text-env-emerald border border-env-emerald/20 font-bold">
              EVIDENCE LAYER
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-apple-text dark:text-eco-50 mt-1.5">
            Green Finance & Environmental Performance Dossier
          </h3>
          <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-300 font-sans mt-1">
            Audited empirical telemetry for sustainable capital allocation, ESG compliance, and parametric risk underwriting.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-apple-muted dark:text-eco-400 font-medium">Environmental Rating</div>
          <div className="text-3xl sm:text-4xl font-bold text-env-emerald mt-0.5 font-mono">{profile.environmentalTrendRating}</div>
        </div>
      </div>

      {/* Core Evidence Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-750 rounded-2xl">
          <div className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Resource Efficiency</div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 mt-1.5 font-mono">{profile.resourceEfficiencyScore} / 100</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Water & power baseline</div>
        </div>

        <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-750 rounded-2xl">
          <div className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">ESG Auditability</div>
          <div className="text-2xl sm:text-3xl font-bold text-env-emerald mt-1.5 font-mono">{profile.esgAuditabilityScore}%</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Verified telemetry trace</div>
        </div>

        <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-750 rounded-2xl">
          <div className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Water Risk Index</div>
          <div className={`text-2xl sm:text-3xl font-bold mt-1.5 font-mono ${profile.waterRiskIndex > 60 ? 'text-status-stressed' : 'text-apple-text dark:text-eco-50'}`}>
            {profile.waterRiskIndex} / 100
          </div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Aquifer depletion risk</div>
        </div>

        <div className="p-5 bg-apple-subtle/60 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-750 rounded-2xl">
          <div className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Carbon Intensity</div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 mt-1.5 font-mono">{profile.carbonIntensityGPerKwh} <span className="text-sm font-normal">g/kWh</span></div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Regional grid mix</div>
        </div>
      </div>

      {/* Eligible Sustainable Finance Instruments */}
      <div className="space-y-3">
        <div className="text-sm uppercase tracking-wider text-apple-text dark:text-eco-200 font-bold flex items-center gap-2">
          <Landmark className="w-4 h-4 text-env-emerald" />
          <span>Eligible Sustainable Financing Facilities</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profile.eligibleInstruments.map((inst, i) => (
            <div key={i} className="p-4 bg-apple-subtle/60 dark:bg-eco-850 border border-apple-border/70 dark:border-eco-750 rounded-2xl flex items-center justify-between text-apple-text dark:text-eco-200">
              <span className="font-medium text-sm sm:text-base">{inst}</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-env-emerald px-2.5 py-0.5 rounded-full bg-env-emerald/10 border border-env-emerald/20 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Capital Applications */}
      <div className="p-6 bg-apple-subtle/50 dark:bg-eco-950 border border-apple-border/70 dark:border-eco-750 rounded-2xl space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-apple-text dark:text-eco-200 font-bold">
          Institutional Capital Applications
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-apple-secondary dark:text-eco-300">
          <div className="space-y-1.5">
            <div className="font-bold text-apple-text dark:text-eco-100 text-sm sm:text-base">1. Parametric Insurance</div>
            <p className="text-xs sm:text-sm leading-relaxed text-apple-secondary dark:text-eco-300">
              Automated payout criteria grounded on multi-sensor temperature anomaly and water aquifer thresholds.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-apple-text dark:text-eco-100 text-sm sm:text-base">2. Green Bond Covenants</div>
            <p className="text-xs sm:text-sm leading-relaxed text-apple-secondary dark:text-eco-300">
              Live continuous PUE and water consumption ratio telemetry satisfying European Green Bond Standard (EuGB).
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-apple-text dark:text-eco-100 text-sm sm:text-base">3. Climate Risk Disclosure</div>
            <p className="text-xs sm:text-sm leading-relaxed text-apple-secondary dark:text-eco-300">
              TCFD and ISSB S2 physical climate risk data feed directly exported for annual investor transparency reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
