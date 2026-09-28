'use client';

import React, { useState, useRef } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import { ClaimCategory, ClaimEvidence, Claim, EvidenceKind } from '@/types';
import { ClaimProvider } from '@/lib/providers/claimProvider';
import {
  X, CheckCircle2, Send, MapPin, MessageSquare, AlertTriangle,
  Camera, Video, Mic, FileText, Trash2, Copy, Loader2
} from 'lucide-react';

interface ClaimReportModalProps {
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

const CATEGORIES: Array<{ id: ClaimCategory; label: string; emoji: string }> = [
  { id: 'WATER', label: 'Water problem', emoji: '💧' },
  { id: 'ENERGY', label: 'Power problem', emoji: '⚡' },
  { id: 'POLLUTION', label: 'Pollution', emoji: '🏭' },
  { id: 'FLOODING', label: 'Flooding', emoji: '🌊' },
  { id: 'WASTE', label: 'Waste / dumping', emoji: '🗑️' },
  { id: 'HEAT', label: 'Heat', emoji: '🔥' },
  { id: 'OTHER', label: 'Something else', emoji: '📋' },
];

const URGENCIES: Array<{ id: 'LOW' | 'MEDIUM' | 'HIGH'; label: string; hint: string; color: string }> = [
  { id: 'LOW', label: 'Can wait', hint: 'No immediate danger', color: 'bg-status-healthy/10 text-status-healthy border-status-healthy/30' },
  { id: 'MEDIUM', label: 'Serious', hint: 'Should be fixed soon', color: 'bg-status-watch/10 text-status-watch border-status-watch/30' },
  { id: 'HIGH', label: 'Urgent', hint: 'People or nature at risk now', color: 'bg-status-critical/10 text-status-critical border-status-critical/30' },
];

const EVIDENCE_TABS: Array<{ kind: EvidenceKind; label: string; icon: React.ElementType; accept: string; capture?: string }> = [
  { kind: 'PHOTO', label: 'Photo', icon: Camera, accept: 'image/*', capture: 'environment' },
  { kind: 'VIDEO', label: 'Video', icon: Video, accept: 'video/*', capture: 'environment' },
  { kind: 'VOICE', label: 'Voice', icon: Mic, accept: 'audio/*', capture: 'microphone' },
];

export default function ClaimReportModal({ onClose }: ClaimReportModalProps) {
  const { locations, selectedLocationId, submitClaim } = useSentinel();
  const provider = ClaimProvider.getInstance();

  const [step, setStep] = useState<Step>(1);
  const [locationId, setLocationId] = useState(selectedLocationId);
  const [category, setCategory] = useState<ClaimCategory>('WATER');
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [evidence, setEvidence] = useState<ClaimEvidence[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState<Claim | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingKindRef = useRef<EvidenceKind>('PHOTO');

  const selectedLoc = locations.find(l => l.id === locationId) || locations[0];
  const canContinueStep1 = !!title.trim() && !!details.trim();

  const openFilePicker = (kind: EvidenceKind) => {
    pendingKindRef.current = kind;
    fileInputRef.current?.click();
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const kind = pendingKindRef.current;
    const incoming: ClaimEvidence[] = Array.from(files).slice(0, 3).map((f, i) => ({
      id: `ev-pending-${Date.now()}-${i}`,
      kind,
      fileName: f.name || `${kind.toLowerCase()}-${i + 1}`,
      sizeBytes: f.size,
      capturedAt: new Date().toISOString(),
      previewUrl: kind === 'PHOTO' || kind === 'VIDEO' ? URL.createObjectURL(f) : undefined,
    }));
    setEvidence(prev => [...prev, ...incoming].slice(0, 5));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeEvidence = (id: string) => {
    setEvidence(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmit = async () => {
    if (!selectedLoc) return;
    setIsSubmitting(true);
    try {
      const claim = await submitClaim({
        locationId: selectedLoc.id,
        locationName: selectedLoc.name,
        title: title.trim(),
        details: details.trim(),
        category,
        urgency,
        evidence: evidence.map(({ previewUrl, ...rest }) => rest),
      });
      setSubmittedClaim(claim);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTracking = async () => {
    if (!submittedClaim) return;
    try {
      await navigator.clipboard.writeText(submittedClaim.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const steps = ['What happened', 'Where & how bad', 'Evidence', 'Confirm'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700 rounded-3xl shadow-apple-hover text-apple-text dark:text-eco-50 font-sans">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-eco-900 border-b border-apple-border dark:border-eco-750 px-6 pt-5 pb-4 z-10 rounded-t-3xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold font-mono">
                Report a Problem
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                {submittedClaim ? 'Report received' : 'Tell us what is happening'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-apple-muted hover:text-apple-text dark:text-eco-400 dark:hover:text-eco-100 rounded-full hover:bg-apple-subtle dark:hover:bg-eco-800 transition-colors shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper */}
          {!submittedClaim && (
            <div className="flex items-center gap-1.5 mt-4">
              {steps.map((label, i) => (
                <div key={label} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-colors ${i + 1 <= step ? 'bg-env-emerald' : 'bg-apple-subtle dark:bg-eco-800'}`} />
                  <div className={`text-[10px] mt-1 font-medium truncate ${i + 1 === step ? 'text-env-emerald font-bold' : 'text-apple-muted dark:text-eco-400'}`}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 pt-5">
          {/* ─── Success Screen ─── */}
          {submittedClaim ? (
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-env-emerald/10 border border-env-emerald/20 flex items-center justify-center text-env-emerald">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold">Your report is in. Thank you!</h4>
              <p className="text-sm text-apple-secondary dark:text-eco-300 max-w-md leading-relaxed">
                Keep this tracking number. It is how you check progress and claim your reward if the report is verified.
              </p>

              <div className="w-full p-5 bg-apple-subtle dark:bg-eco-850 border-2 border-dashed border-env-emerald/40 rounded-2xl space-y-2">
                <div className="text-xs font-mono uppercase text-apple-muted dark:text-eco-400 font-semibold">Your tracking number</div>
                <div className="text-3xl font-mono font-bold text-env-emerald tracking-wider">{submittedClaim.trackingNumber}</div>
                <button
                  onClick={copyTracking}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-env-emerald hover:underline mt-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy number'}</span>
                </button>
              </div>

              <div className="w-full p-3.5 bg-env-emerald/5 border border-env-emerald/20 rounded-xl text-xs text-apple-secondary dark:text-eco-300 leading-relaxed text-left">
                <strong className="text-apple-text dark:text-eco-100">What happens next?</strong> Our review team will check your report
                against satellite data and field information. If it is verified as true, you will receive a
                Ticket Number — send it to <strong className="text-env-emerald">*384*EC#</strong> on any phone to collect your GreenPoints.
              </div>

              <button
                onClick={onClose}
                className="w-full mt-2 px-6 py-3 bg-env-emerald hover:bg-env-forest text-white font-semibold rounded-2xl transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* ─── Step 1: What happened ─── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">What is the problem? <span className="text-apple-muted font-normal">(one short line)</span></label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The river near our market is turning green and smelly"
                      className="w-full bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-env-emerald placeholder:text-apple-muted dark:placeholder:text-eco-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Tell us a bit more</label>
                    <textarea
                      rows={4}
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="What do you see? Since when? Who is affected? Your own words are perfect — no special language needed."
                      className="w-full bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl p-3.5 text-sm outline-none focus:border-env-emerald placeholder:text-apple-muted dark:placeholder:text-eco-500 leading-relaxed"
                    />
                  </div>

                  <div className="p-3 bg-apple-subtle dark:bg-eco-950 border border-apple-border dark:border-eco-750 rounded-xl text-xs text-apple-secondary dark:text-eco-300 flex items-start gap-2.5">
                    <MessageSquare className="w-4 h-4 text-env-emerald shrink-0 mt-0.5" />
                    <span>Write like you are telling a neighbour. Short and clear is best.</span>
                  </div>
                </div>
              )}

              {/* ─── Step 2: Where & how bad ─── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold mb-1.5">
                      <MapPin className="w-4 h-4 text-env-emerald" /> Where is it happening?
                    </label>
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl px-3.5 py-3 text-sm outline-none focus:border-env-emerald"
                    >
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}, {loc.country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5">What kind of problem?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all ${
                            category === cat.id
                              ? 'bg-env-emerald/10 border-env-emerald text-env-emerald font-bold'
                              : 'bg-apple-subtle dark:bg-eco-850 border-apple-border dark:border-eco-700 text-apple-secondary dark:text-eco-300 hover:bg-apple-hover dark:hover:bg-eco-800'
                          }`}
                        >
                          <span className="text-xl">{cat.emoji}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-env-amber" /> How bad is it?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {URGENCIES.map(u => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setUrgency(u.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            urgency === u.id ? `${u.color} font-bold` : 'bg-apple-subtle dark:bg-eco-850 border-apple-border dark:border-eco-700 text-apple-secondary dark:text-eco-300 hover:bg-apple-hover dark:hover:bg-eco-800'
                          }`}
                        >
                          <div className="text-sm font-semibold">{u.label}</div>
                          <div className="text-[10px] mt-0.5 leading-tight">{u.hint}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Step 3: Evidence ─── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Add proof <span className="text-apple-muted font-normal">(optional but helps a lot)</span></label>
                    <p className="text-xs text-apple-secondary dark:text-eco-300 mb-3">
                      Photos, videos or a voice note all work. Up to 5 files.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {EVIDENCE_TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.kind}
                            type="button"
                            onClick={() => openFilePicker(tab.kind)}
                            className="flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 border-dashed border-apple-border dark:border-eco-700 text-apple-secondary dark:text-eco-300 hover:border-env-emerald hover:text-env-emerald transition-all"
                          >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-semibold">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={EVIDENCE_TABS.find(t => t.kind === pendingKindRef.current)?.accept}
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>

                  {evidence.length > 0 && (
                    <div className="space-y-2">
                      {evidence.map(ev => (
                        <div key={ev.id} className="flex items-center gap-3 p-2.5 bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl">
                          {ev.kind === 'PHOTO' && ev.previewUrl ? (
                            <img src={ev.previewUrl} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-env-emerald/10 flex items-center justify-center text-env-emerald shrink-0">
                              {ev.kind === 'VIDEO' ? <Video className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate">{ev.fileName}</div>
                            <div className="text-[10px] text-apple-muted dark:text-eco-400">
                              {ev.kind.toLowerCase()} • {(ev.sizeBytes / 1024).toFixed(0)} KB
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeEvidence(ev.id)}
                            className="p-1.5 text-apple-muted hover:text-status-critical transition-colors"
                            aria-label="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-apple-subtle dark:bg-eco-950 border border-apple-border dark:border-eco-750 rounded-xl text-xs text-apple-secondary dark:text-eco-300 flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-env-emerald shrink-0 mt-0.5" />
                    <span>Your files stay private. Reviewers only see what is needed to check the problem.</span>
                  </div>
                </div>
              )}

              {/* ─── Step 4: Confirm ─── */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-apple-subtle dark:bg-eco-850 rounded-xl space-y-2.5 text-sm">
                    <div className="flex justify-between gap-3"><span className="text-apple-muted">Problem</span><span className="font-semibold text-right">{title}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-apple-muted">Place</span><span className="font-semibold">{selectedLoc?.name}, {selectedLoc?.country}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-apple-muted">Kind</span><span className="font-semibold">{CATEGORIES.find(c => c.id === category)?.label}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-apple-muted">How bad</span><span className="font-semibold">{URGENCIES.find(u => u.id === urgency)?.label}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-apple-muted">Proof attached</span><span className="font-semibold">{evidence.length} file{evidence.length === 1 ? '' : 's'}</span></div>
                  </div>
                  <div className="p-3 bg-env-emerald/5 border border-env-emerald/20 rounded-xl text-xs text-apple-secondary dark:text-eco-300">
                    By sending, you confirm this is true to the best of your knowledge. False reports may not earn points.
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-apple-border dark:border-eco-750">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((step - 1) as Step)}
                    className="px-5 py-2.5 bg-apple-subtle dark:bg-eco-800 hover:bg-apple-hover dark:hover:bg-eco-750 text-apple-secondary dark:text-eco-300 rounded-2xl text-sm font-semibold transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    disabled={step === 1 && !canContinueStep1}
                    onClick={() => setStep((step + 1) as Step)}
                    className="px-6 py-2.5 bg-env-emerald hover:bg-env-forest text-white font-semibold rounded-2xl text-sm transition-all shadow-apple-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 bg-env-emerald hover:bg-env-forest text-white font-semibold rounded-2xl text-sm transition-all shadow-apple-sm disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>{isSubmitting ? 'Sending...' : 'Send report'}</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
