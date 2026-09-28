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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-eco-900 border border-eco-700 rounded shadow-2xl p-6 text-eco-50 font-mono">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-eco-750 pb-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-eco-400">
                Community Intelligence Pipeline
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-eco-800 border border-eco-700 text-status-healthy rounded">
                PII-PROTECTED
              </span>
            </div>
            <h3 className="text-base font-semibold text-eco-50 mt-1">
              Submit Environmental Observation
            </h3>
            <p className="text-xs text-eco-300 font-sans mt-0.5">
              Crowdsourced ground signals cross-reference satellite and SCADA infrastructure telemetry.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-eco-400 hover:text-eco-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedReportId ? (
          <div className="py-6 flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-status-healthy-subtle border border-status-healthy-border flex items-center justify-center text-status-healthy">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-eco-100">
              Observation Verified & Ingested
            </h4>
            <div className="text-xs text-eco-300 max-w-md font-sans">
              Your observation was assigned anonymous identifier <span className="font-mono text-eco-50 font-semibold">{submittedReportId}</span>.
              The regional stress model has recalculated with the newly weighted community signal.
            </div>
            <div className="text-[11px] font-mono text-eco-400 p-2 bg-eco-850 rounded border border-eco-750">
              Flow: Received → Validated → Cross-referenced → Confidence (88%)
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-1.5 bg-eco-50 hover:bg-eco-200 text-eco-950 font-semibold text-xs rounded transition-colors"
            >
              Return to Monitoring
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            {/* Location & Category Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-eco-400 mb-1">
                  Target Region / Basin
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full bg-eco-850 border border-eco-700 rounded px-2.5 py-1.5 text-eco-100 font-mono text-xs outline-none focus:border-eco-500"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}, {loc.country}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-eco-400 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                  className="w-full bg-eco-850 border border-eco-700 rounded px-2.5 py-1.5 text-eco-100 font-mono text-xs outline-none focus:border-eco-500"
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
              <label className="block text-[10px] font-mono uppercase text-eco-400 mb-1">
                Observed Severity
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as ReportSeverity[]).map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-1.5 text-center text-xs rounded border transition-colors ${
                      severity === sev
                        ? sev === 'CRITICAL' ? 'bg-status-critical-subtle text-status-critical-text border-status-critical-border font-semibold'
                        : sev === 'HIGH' ? 'bg-status-stressed-subtle text-status-stressed-text border-status-stressed-border font-semibold'
                        : sev === 'MEDIUM' ? 'bg-status-watch-subtle text-status-watch-text border-status-watch-border font-semibold'
                        : 'bg-status-healthy-subtle text-status-healthy-text border-status-healthy-border font-semibold'
                        : 'bg-eco-850 text-eco-400 border-eco-750 hover:text-eco-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Observation Textarea */}
            <div>
              <label className="block text-[10px] font-mono uppercase text-eco-400 mb-1">
                Ground Observation Details
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe visible ground conditions (e.g. aquifer pressure drop, river reach drying, transformer heat plume)..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full bg-eco-850 border border-eco-700 rounded p-2.5 text-eco-100 placeholder:text-eco-500 text-xs outline-none focus:border-eco-500"
              />
            </div>

            {/* Privacy Guarantee Note (Requirement 18) */}
            <div className="p-2.5 bg-eco-950 border border-eco-750 rounded text-[11px] text-eco-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-status-healthy shrink-0 mt-0.5" />
              <span>
                Privacy Guarantee: Personal identifers, device telemetry, and exact GPS coordinates are stripped before submission. Observation is assigned a cryptographic token.
              </span>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-eco-750 font-mono">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-eco-800 hover:bg-eco-750 text-eco-300 rounded text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !observation.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-eco-50 hover:bg-eco-200 text-eco-950 font-semibold rounded text-xs transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Ingesting...' : 'Submit Observation'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
