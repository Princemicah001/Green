'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import ClaimReportModal from '@/components/claims/ClaimReportModal';
import ClaimTracker from '@/components/claims/ClaimTracker';
import { Claim } from '@/types';
import {
  Megaphone, Smartphone, ShieldCheck, Camera, FileVideo, FileAudio,
  ChevronRight, Award, Clock, MapPin, Leaf
} from 'lucide-react';

const EvidenceIcon = { PHOTO: Camera, VIDEO: FileVideo, VOICE: FileAudio } as const;

const statusBadge = (s: Claim['status']) => {
  switch (s) {
    case 'SUBMITTED': return 'bg-apple-subtle dark:bg-eco-800 text-apple-secondary dark:text-eco-300 border-apple-border dark:border-eco-700';
    case 'UNDER_REVIEW': return 'bg-status-watch/10 text-status-watch border-status-watch/30';
    case 'VERIFIED': return 'bg-env-sky/10 text-env-sky border-env-sky/30';
    case 'REWARDED': return 'bg-env-emerald/10 text-env-emerald border-env-emerald/30';
    case 'REJECTED': return 'bg-status-critical/10 text-status-critical border-status-critical/30';
  }
};

export default function ClaimsPage() {
  const { claims, isClaimModalOpen, setIsClaimModalOpen, pointsWallet } = useSentinel();
  const [tab, setTab] = useState<'track' | 'mine'>('track');

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-env-forest to-env-emerald p-6 sm:p-10 text-white shadow-apple-card">
        <div className="absolute -right-10 -top-14 w-56 h-56 rounded-full bg-white/10" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5" /> Report · Track · Earn
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">See something wrong? Report it and earn.</h1>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed">
              Tell us about pollution, water and power problems in your area — attach a photo, video or voice note.
              If our review team verifies it, you earn GreenPoints to spend on solar lamps, pumps and more.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsClaimModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-env-forest font-bold rounded-2xl text-sm sm:text-base hover:bg-white/90 transition-all active:scale-95 shadow-apple-sm"
              >
                <Megaphone className="w-5 h-5" /> Report a problem
              </button>
              <a
                href="/app/ussd"
                className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/30 rounded-2xl text-sm font-semibold hover:bg-white/20 transition-all"
              >
                <Smartphone className="w-4 h-4" /> Report by phone (*384*EC#)
              </a>
            </div>
          </div>

          {/* Wallet mini-card */}
          <div className="shrink-0 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-center min-w-[170px]">
            <Leaf className="w-5 h-5 mx-auto mb-1.5 text-white/80" />
            <div className="text-4xl font-bold font-mono">{pointsWallet.balance}</div>
            <div className="text-xs text-white/75 mt-1">GreenPoints</div>
            <a href="/app/rewards" className="inline-flex items-center gap-1 text-xs font-semibold text-white underline underline-offset-2 mt-2 hover:text-white/80">
              Spend in rewards <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Evidence-type strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Camera, label: 'Photo proof', sub: 'snap the problem' },
          { icon: FileVideo, label: 'Video proof', sub: 'show it happening' },
          { icon: FileAudio, label: 'Voice note', sub: 'just talk about it' },
        ].map(e => (
          <div key={e.label} className="p-4 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-env-emerald/10 flex items-center justify-center text-env-emerald shrink-0">
              <e.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-apple-text dark:text-eco-50">{e.label}</div>
              <div className="text-[11px] text-apple-muted dark:text-eco-400">{e.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs: Track / My reports */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('track')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'track' ? 'bg-apple-text text-white dark:bg-eco-50 dark:text-eco-950' : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-850'
            }`}
          >
            Track a report
          </button>
          <button
            onClick={() => setTab('mine')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'mine' ? 'bg-apple-text text-white dark:bg-eco-50 dark:text-eco-950' : 'text-apple-secondary dark:text-eco-300 hover:bg-apple-subtle dark:hover:bg-eco-850'
            }`}
          >
            All community reports ({claims.length})
          </button>
        </div>

        {tab === 'track' ? (
          <ClaimTracker />
        ) : (
          <div className="space-y-3">
            {claims.map(claim => (
              <div key={claim.id} className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-env-emerald">{claim.trackingNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(claim.status)}`}>
                      {claim.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-apple-muted dark:text-eco-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{claim.locationName}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(claim.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="font-semibold text-apple-text dark:text-eco-50">{claim.title}</div>
                <div className="text-xs text-apple-secondary dark:text-eco-300 mt-1 line-clamp-2">{claim.details}</div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {claim.evidence.map(ev => {
                    const Icon = EvidenceIcon[ev.kind];
                    return (
                      <span key={ev.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-full text-[10px] font-medium text-apple-secondary dark:text-eco-300">
                        <Icon className="w-3 h-3 text-env-emerald" /> {ev.kind.toLowerCase()}
                      </span>
                    );
                  })}
                  {claim.status === 'REWARDED' && claim.pointsAwarded && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-env-emerald/10 text-env-emerald rounded-full text-[10px] font-bold">
                      <Award className="w-3 h-3" /> +{claim.pointsAwarded} pts
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-env-emerald">
                    <ShieldCheck className="w-3.5 h-3.5" /> privacy-protected reporter
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isClaimModalOpen && <ClaimReportModal onClose={() => setIsClaimModalOpen(false)} />}
    </div>
  );
}
