'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import { CommunityCategory, ReportSeverity } from '@/types';
import { X, CheckCircle2, ShieldCheck, Send } from 'lucide-react';

interface CommunityReportModalProps {
  onClose: () => void;
}

export default function CommunityReportModal({ onClose }: CommunityReportModalProps) {
  const { locations, selectedLocationId, submitCommunityReport } = useSentinel();

  const [locationId, setLocationId] = useState(selectedLocationId);
  const [category, setCategory] = useState<CommunityCategory>('WATER');
  const [severity, setSeverity] = useState<ReportSeverity>('HIGH');
  const [observation, setObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  const selectedLoc = locations.find(l => l.id === locationId) || locations[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!observation.trim()) return;

    setIsSubmitting(true);
    try {
      const rep = await submitCommunityReport({
        locationId,
        locationName: selectedLoc.name,
        category,
        severity,
        observation: observation.trim(),
        approximateLat: selectedLoc.latitude,
        approximateLng: selectedLoc.longitude,
      });
      setSubmittedReportId(rep.anonymousId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-3xl shadow-apple-hover p-6 sm:p-8 text-apple-text dark:text-eco-50 font-sans">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-apple-border dark:border-eco-750 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold font-mono">
                Community Telemetry Pipeline
              </span>
              <span className="text-xs px-2.5 py-0.5 bg-env-emerald/10 text-env-emerald rounded-full font-bold">
                Zero-PII
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-apple-text dark:text-eco-50 mt-1.5">
              Submit Field Observation
            </h3>
            <p className="text-sm text-apple-secondary dark:text-eco-300 font-sans mt-1">
              Field observations are cross-referenced with Sentinel-2 satellite data and SCADA telemetry.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-apple-muted hover:text-apple-text dark:text-eco-400 dark:hover:text-eco-100 rounded-full hover:bg-apple-subtle dark:hover:bg-eco-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedReportId ? (
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-env-emerald/10 border border-env-emerald/20 flex items-center justify-center text-env-emerald">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-apple-text dark:text-eco-100">
              Observation Ingested & Verified
            </h4>
            <div className="text-base text-apple-secondary dark:text-eco-300 max-w-md font-sans leading-relaxed">
              Your observation was assigned anonymous identifier <span className="font-mono text-apple-text dark:text-eco-50 font-bold">{submittedReportId}</span>.
              The regional stress model has recalculated with newly correlated ground intelligence.
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-env-emerald hover:bg-env-forest text-white font-medium text-base rounded-2xl shadow-apple-sm transition-all"
            >
              Return to Monitoring
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-sm sm:text-base font-sans">
            {/* Location & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-apple-secondary dark:text-eco-300 mb-1.5 font-semibold">
                  Target Basin / Region
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl px-3.5 py-2.5 text-apple-text dark:text-eco-100 text-sm outline-none focus:border-env-emerald font-medium"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id} className="bg-white dark:bg-eco-900">{loc.name}, {loc.country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-apple-secondary dark:text-eco-300 mb-1.5 font-semibold">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                  className="w-full bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl px-3.5 py-2.5 text-apple-text dark:text-eco-100 text-sm outline-none focus:border-env-emerald font-medium"
                >
                  <option value="WATER">Water Strain / Deficit</option>
                  <option value="HEAT">Heat / Thermal Island</option>
                  <option value="ENERGY">Energy / Grid Fluctuation</option>
                  <option value="FLOODING">Flooding / Drainage</option>
                  <option value="POLLUTION">Pollution / Effluent</option>
                  <option value="NOISE">Acoustic / Chiller Noise</option>
                  <option value="OTHER">Other Ground Anomaly</option>
                </select>
              </div>
            </div>

            {/* Severity Radio/Tabs */}
            <div>
              <label className="block text-xs font-mono uppercase text-apple-secondary dark:text-eco-300 mb-1.5 font-semibold">
                Observed Severity
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm font-medium">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as ReportSeverity[]).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 text-center rounded-xl border transition-all ${
                      severity === sev
                        ? sev === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical border-status-critical/30 font-bold'
                        : sev === 'HIGH' ? 'bg-status-stressed/10 text-status-stressed border-status-stressed/30 font-bold'
                        : sev === 'MEDIUM' ? 'bg-status-watch/10 text-status-watch border-status-watch/30 font-bold'
                        : 'bg-status-healthy/10 text-status-healthy border-status-healthy/30 font-bold'
                        : 'bg-apple-subtle dark:bg-eco-850 text-apple-secondary dark:text-eco-400 border-apple-border dark:border-eco-750 hover:bg-apple-hover'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Observation Textarea */}
            <div>
              <label className="block text-xs font-mono uppercase text-apple-secondary dark:text-eco-300 mb-1.5 font-semibold">
                Ground Observation Details
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe visible ground conditions (e.g. aquifer pump cavitation, river reach drying, transformer heat plume)..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl p-3.5 text-apple-text dark:text-eco-100 placeholder:text-apple-muted dark:placeholder:text-eco-500 text-sm sm:text-base outline-none focus:border-env-emerald leading-relaxed"
              />
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-3.5 bg-apple-subtle dark:bg-eco-950 border border-apple-border dark:border-eco-750 rounded-xl text-xs text-apple-secondary dark:text-eco-300 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-env-emerald shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong className="text-apple-text dark:text-eco-100 font-semibold">Privacy Safeguard:</strong> Contributor device telemetry, phone numbers, and exact GPS coordinates are stripped before submission. Observation is assigned a zero-knowledge token.
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-apple-border dark:border-eco-750">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-apple-subtle dark:bg-eco-800 hover:bg-apple-hover dark:hover:bg-eco-750 text-apple-secondary dark:text-eco-300 rounded-2xl text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !observation.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-env-emerald hover:bg-env-forest text-white font-medium rounded-2xl text-sm sm:text-base transition-all shadow-apple-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Ingesting...' : 'Submit Observation'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
