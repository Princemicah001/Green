'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import { Claim } from '@/types';
import { ClaimProvider } from '@/lib/providers/claimProvider';
import {
  Search, MapPin, Clock, CheckCircle2, Circle, FileVideo, FileAudio, Camera,
  Award, PackageSearch, MessageCircle, Leaf
} from 'lucide-react';

interface ClaimTrackerProps {
  /** Pre-fill the input (e.g. from a just-submitted claim) */
  initialRef?: string;
  /** Called when user submits a claim via USSD (unused here, kept for symmetry) */
  onUssdPrompt?: () => void;
}

const STATUS_STEPS = [
  { status: 'SUBMITTED', label: 'Received' },
  { status: 'UNDER_REVIEW', label: 'Being checked' },
  { status: 'VERIFIED', label: 'Verified true' },
  { status: 'REWARDED', label: 'Points sent' },
] as const;

export default function ClaimTracker({ initialRef }: ClaimTrackerProps) {
  const { claims, pointsWallet } = useSentinel();
  const provider = ClaimProvider.getInstance();

  const [ref, setRef] = useState(initialRef || '');
  const [result, setResult] = useState<Claim | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSearch = () => {
    setTouched(true);
    const found = provider.findClaimByRef(claims, ref);
    setResult(found || null);
    setNotFound(!found);
  };

  const EvidenceIcon = { PHOTO: Camera, VIDEO: FileVideo, VOICE: FileAudio } as const;

  const stepIndexFor = (claim: Claim): number => {
    if (claim.status === 'REJECTED') return -1;
    const idx = STATUS_STEPS.findIndex(s => s.status === claim.status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="space-y-6">
      {/* Lookup Card */}
      <div className="bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-1.5">
          <PackageSearch className="w-5 h-5 text-env-emerald" />
          <h3 className="text-lg sm:text-xl font-bold">Track your report</h3>
        </div>
        <p className="text-sm text-apple-secondary dark:text-eco-300 mb-5">
          Enter the tracking number (like <span className="font-mono font-semibold">EC-48213</span>) you received when you reported.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={ref}
            onChange={(e) => { setRef(e.target.value); setNotFound(false); setResult(null); }}
            onKeyDown={(e) => e.key === 'Enter' && ref.trim() && handleSearch()}
            placeholder="EC-12345 or TK-12345"
            className="flex-1 bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-env-emerald uppercase placeholder:normal-case placeholder:font-sans placeholder:text-apple-muted dark:placeholder:text-eco-500"
          />
          <button
            onClick={handleSearch}
            disabled={!ref.trim()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-env-emerald hover:bg-env-forest text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-40 shadow-apple-sm"
          >
            <Search className="w-4 h-4" />
            <span>Check status</span>
          </button>
        </div>

        {notFound && (
          <div className="mt-4 p-3.5 bg-status-critical/5 border border-status-critical/20 rounded-xl text-sm text-apple-secondary dark:text-eco-300 flex items-start gap-2.5">
            <MessageCircle className="w-4 h-4 text-status-critical shrink-0 mt-0.5" />
            <span>
              We could not find that number. Check it and try again — or dial <span className="font-mono font-semibold text-env-emerald">*384*EC#</span> on your phone to report by USSD.
            </span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 pt-6 border-t border-apple-border dark:border-eco-750 space-y-5 animate-in fade-in">
            {/* Title row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-env-emerald">{result.trackingNumber}</span>
                  {result.status === 'REJECTED' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-status-critical/10 text-status-critical border border-status-critical/30">
                      Not verified
                    </span>
                  ) : result.status === 'REWARDED' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-env-emerald/10 text-env-emerald border border-env-emerald/30">
                      +{result.pointsAwarded} pts sent
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-status-watch/10 text-status-watch border border-status-watch/30">
                      In progress
                    </span>
                )}
                </div>
                <h4 className="text-base sm:text-lg font-bold mt-1.5">{result.title}</h4>
                <div className="flex items-center gap-3 text-xs text-apple-muted dark:text-eco-400 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{result.locationName}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(result.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Progress timeline */}
            {result.status !== 'REJECTED' ? (
              <div className="flex items-start">
                {STATUS_STEPS.map((s, i) => {
                  const current = stepIndexFor(result);
                  const done = i <= current;
                  const isLast = i === STATUS_STEPS.length - 1;
                  return (
                    <React.Fragment key={s.status}>
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          done ? 'bg-env-emerald border-env-emerald text-white' : 'bg-apple-subtle dark:bg-eco-850 border-apple-border dark:border-eco-700 text-apple-muted dark:text-eco-400'
                        }`}>
                          {done ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Circle className="w-3 h-3" />}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-semibold text-center ${done ? 'text-env-emerald' : 'text-apple-muted dark:text-eco-400'}`}>
                          {s.label}
                        </span>
                      </div>
                      {!isLast && (
                        <div className={`flex-1 h-0.5 mt-4 mx-1 rounded ${i < stepIndexFor(result) ? 'bg-env-emerald' : 'bg-apple-border dark:bg-eco-750'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <div className="p-3.5 bg-status-critical/5 border border-status-critical/20 rounded-xl text-sm text-apple-secondary dark:text-eco-300">
                Unfortunately this report could not be confirmed. {result.reviewerNote || 'You can file a new report with more evidence at any time.'}
              </div>
            )}

            {/* Details */}
            <div className="p-4 bg-apple-subtle dark:bg-eco-850 rounded-xl text-sm text-apple-secondary dark:text-eco-300 leading-relaxed">
              {result.details}
            </div>

            {/* Evidence chips */}
            {result.evidence.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.evidence.map(ev => {
                  const Icon = EvidenceIcon[ev.kind];
                  return (
                    <span key={ev.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-eco-800 border border-apple-border dark:border-eco-700 rounded-full text-xs font-medium">
                      <Icon className="w-3.5 h-3.5 text-env-emerald" />
                      {ev.kind.toLowerCase()} • {ev.fileName.length > 22 ? ev.fileName.slice(0, 20) + '…' : ev.fileName}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Verified → earn points CTA */}
            {(result.status === 'VERIFIED' || result.status === 'REWARDED') && result.ticketNumber && (
              <div className={`p-4 rounded-xl border ${
                result.status === 'REWARDED'
                  ? 'bg-env-emerald/5 border-env-emerald/30'
                  : 'bg-env-amber/5 border-env-amber/30'
              }`}>
                {result.status === 'REWARDED' ? (
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-env-emerald shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-bold text-env-emerald">Reward sent — +{result.pointsAwarded} GreenPoints</div>
                      <div className="text-apple-secondary dark:text-eco-300 mt-0.5">
                        Your wallet now holds {pointsWallet.balance} points. Spend them in the Green Rewards shop.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Leaf className="w-5 h-5 text-env-amber shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-bold text-apple-text dark:text-eco-100">Your report was verified. Time to claim your reward!</div>
                      <div className="text-apple-secondary dark:text-eco-300 mt-0.5">
                        Dial <span className="font-mono font-bold text-env-emerald">*384*EC#</span>, choose <strong>“Earn points”</strong> and enter ticket
                        <span className="font-mono font-bold"> {result.ticketNumber}</span> to collect your GreenPoints.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviewer note */}
            {result.reviewerNote && result.status !== 'REJECTED' && (
              <div className="text-xs text-apple-muted dark:text-eco-400 flex items-start gap-2">
                <MessageCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong>Reviewer note:</strong> {result.reviewerNote}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { n: 1, title: 'Report', text: 'Send the problem with photos, video or voice proof.' },
          { n: 2, title: 'We verify', text: 'The review team checks it against satellite and field data.' },
          { n: 3, title: 'You earn', text: 'If verified, your ticket number earns GreenPoints on *384*EC#.' },
        ].map(s => (
          <div key={s.n} className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
            <div className="w-9 h-9 rounded-xl bg-env-emerald/10 text-env-emerald font-bold flex items-center justify-center mb-3">{s.n}</div>
            <div className="font-bold text-sm mb-1">{s.title}</div>
            <div className="text-xs text-apple-secondary dark:text-eco-300 leading-relaxed">{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
