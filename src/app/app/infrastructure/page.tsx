'use client';

import React from 'react';
import Image from 'next/image';
import { useSentinel } from '@/lib/store/sentinelStore';
import FacilityMonitor from '@/components/telemetry/FacilityMonitor';
import { ShieldCheck, Cpu, Droplets, Zap, Activity } from 'lucide-react';

export default function InfrastructurePage() {
  const { facilities, selectedLocation, simulateMitigationResponse, mitigationPlan } = useSentinel();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8">
      {/* Apple-Style Hero Banner with Green Datacenter Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 shadow-apple-card">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-env-emerald/10 border border-env-emerald/20 text-env-emerald text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time SCADA & BMS Telemetry</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-apple-text dark:text-eco-50">
              Critical Infrastructure Monitoring
            </h1>

            <p className="text-base sm:text-lg text-apple-secondary dark:text-eco-200 leading-relaxed font-sans">
              Continuous environmental telemetry monitoring compute workload, cooling water intake, geothermal exchange loops, and power grid stress across enterprise data centers.
            </p>

            {/* Quick Status Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm font-medium">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-subtle dark:bg-eco-800 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700">
                <span className="w-2 h-2 rounded-full bg-env-emerald animate-pulse" />
                5 Facilities Live
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-apple-subtle dark:bg-eco-800 text-apple-text dark:text-eco-200 border border-apple-border dark:border-eco-700">
                Avg PUE: 1.21
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-env-emerald/10 text-env-emerald border border-env-emerald/20 font-semibold">
                Closed-Loop Automated Mitigation: Enabled
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 h-64 lg:h-full min-h-[260px] relative overflow-hidden bg-slate-100 dark:bg-eco-950">
            <Image
              src="/images/datacenter.jpg"
              alt="Sustainable Green Data Center with Geothermal Loops"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-4 right-4 text-xs text-white/90 font-medium lg:hidden">
              Closed-loop evaporative & geothermal cooling nodes
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Total Power</span>
            <Zap className="w-4 h-4 text-env-amber" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 mt-2">20.3 MW</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Across 5 monitored hubs</div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Cooling Water</span>
            <Droplets className="w-4 h-4 text-env-sky" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-status-stressed mt-2">3.80 ML/d</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Evaporative cooling draw</div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Average PUE</span>
            <Cpu className="w-4 h-4 text-env-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-100 mt-2">1.21</div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Power usage effectiveness</div>
        </div>

        <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold">Mitigation Status</span>
            <ShieldCheck className="w-4 h-4 text-env-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-env-emerald mt-2">
            {facilities.filter(f => f.mitigationActive).length > 0 ? 'Active' : 'Standby'}
          </div>
          <div className="text-xs text-apple-secondary dark:text-eco-400 mt-1 font-medium">Load shifting & closed loop</div>
        </div>
      </div>

      {/* Facility Telemetry Table & Mitigation Simulation Trigger */}
      <FacilityMonitor
        facilities={facilities}
        selectedLocationName={selectedLocation.name}
        onSimulateMitigation={simulateMitigationResponse}
      />

      {/* Mitigation Simulation Audit Log / Active Plan Notice */}
      {mitigationPlan && (
        <div className="p-5 sm:p-6 bg-white dark:bg-eco-900 border border-env-emerald/30 rounded-2xl shadow-apple-card space-y-2.5">
          <div className="flex items-center justify-between text-env-emerald font-bold text-base sm:text-lg">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Active Mitigation Simulation Plan ({mitigationPlan.id})</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-env-emerald/10 text-xs font-mono font-bold">
              Relief: -{mitigationPlan.stressReductionPoints} Stress Points
            </span>
          </div>

          <p className="text-apple-secondary dark:text-eco-200 font-sans text-sm sm:text-base leading-relaxed">
            Applied simulated closed-loop cooling and non-critical batch job shedding. Water consumption reduced by {mitigationPlan.waterSavingsPct}%, regional stress reduced from {mitigationPlan.before.overallStress} to {mitigationPlan.after.overallStress}.
          </p>
        </div>
      )}
    </div>
  );
}
