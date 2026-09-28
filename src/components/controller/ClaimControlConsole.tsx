'use client';

import React, { useState } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import { Claim, ClaimStatus } from '@/types';
import {
  Inbox, Eye, CheckCircle2, XCircle, Award, FileVideo, FileAudio, Camera,
  MapPin, Clock, MessageSquare, Search, Radio, Signal
} from 'lucide-react';

const STATUS_FILTERS: Array<{ id: ClaimStatus | 'ALL'; label: string }> = [
  { id: 'ALL', label: 'All' },
  { id: 'SUBMITTED', label: 'New' },
  { id: 'UNDER_REVIEW', label: 'In review' },
  { id: 'VERIFIED', label: 'Verified' },
  { id: 'REWARDED', label: 'Rewarded' },
  { id: 'REJECTED', label: 'Rejected' },
];

const statusBadge = (status: ClaimStatus) => {
  switch (status) {
    case 'SUBMITTED': return 'bg-apple-subtle dark:bg-eco-800 text-apple-secondary dark:text-eco-300 border-apple-border dark:border-eco-700';
    case 'UNDER_REVIEW': return 'bg-status-watch/10 text-status-watch border-status-watch/30';
    case 'VERIFIED': return 'bg-env-sky/10 text-env-sky border-env-sky/30';
    case 'REWARDED': return 'bg-env-emerald/10 text-env-emerald border-env-emerald/30';
    case 'REJECTED': return 'bg-status-critical/10 text-status-critical border-status-critical/30';
  }
};

const statusLabel = (status: ClaimStatus) => {
  switch (status) {
    case 'SUBMITTED': return 'New — needs review';
    case 'UNDER_REVIEW': return 'Under review';
    case 'VERIFIED': return 'Verified — awaiting reward';
    case 'REWARDED': return 'Rewarded';
    case 'REJECTED': return 'Rejected';
  }
};

const EvidenceIcon = { PHOTO: Camera, VIDEO: FileVideo, VOICE: FileAudio } as const;

export default function ClaimControlConsole() {
  const { claims, setClaimStatus, awardClaimPoints, pointsWallet } = useSentinel();
  const [filter, setFilter] = useState<ClaimStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const filtered = claims.filter(c => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.trackingNumber.toLowerCase().includes(q) ||
        c.ticketNumber.toLowerCase().includes(q) ||
        c.locationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selected = claims.find(c => c.id === selectedId) || null;

  const doAction = (action: 'START_REVIEW' | 'VERIFY' | 'REJECT' | 'AWARD') => {
    if (!selected) return;
    if (action === 'AWARD') {
      awardClaimPoints(selected.id);
      setActionMsg(`+${selected.pointsAwarded ?? ''} GreenPoints issued to the reporter.`);
    } else if (action === 'START_REVIEW') {
      setClaimStatus(selected.id, 'UNDER_REVIEW', note.trim() || undefined);
      setActionMsg('Claim moved to review.');
    } else if (action === 'VERIFY') {
      setClaimStatus(selected.id, 'VERIFIED', note.trim() || undefined);
      setActionMsg('Claim verified. Reporter can now earn points with the ticket number.');
    } else if (action === 'REJECT') {
      setClaimStatus(selected.id, 'REJECTED', note.trim() || undefined);
      setActionMsg('Claim rejected — reporter will see this when tracking.');
    }
    setNote('');
    setTimeout(() => setActionMsg(null), 4000);
  };

  const pendingCount = claims.filter(c => c.status === 'SUBMITTED').length;
  const reviewCount = claims.filter(c => c.status === 'UNDER_REVIEW').length;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* Queue Panel */}
      <div className="xl:col-span-5 space-y-4">
        {/* Controller status strip */}
        <div className="flex items-center justify-between p-4 bg-eco-950 dark:bg-eco-900 border border-eco-700 rounded-2xl text-eco-100">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-env-emerald animate-pulse" />
            <span className="text-xs font-mono font-semibold tracking-wider">CONTROL DESK — LIVE</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-status-watch">{pendingCount} new</span>
            <span className="text-env-sky">{reviewCount} reviewing</span>
          </div>
        </div>

        {/* Filters + search */}
        <div className="p-4 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card space-y-3">
          <div className="flex items-center gap-2 bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-apple-muted shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title, place or number..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-apple-muted dark:placeholder:text-eco-500"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  filter === f.id
                    ? 'bg-apple-text text-white dark:bg-eco-50 dark:text-eco-950'
                    : 'bg-apple-subtle dark:bg-eco-800 text-apple-secondary dark:text-eco-300 hover:bg-apple-hover dark:hover:bg-eco-750'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Queue list */}
        <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
          {filtered.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl text-sm text-apple-muted dark:text-eco-400">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No claims in this view.
            </div>
          )}
          {filtered.map(claim => (
            <button
              key={claim.id}
              onClick={() => setSelectedId(claim.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedId === claim.id
                  ? 'bg-env-emerald/5 border-env-emerald/40 shadow-apple-sm'
                  : 'bg-white dark:bg-eco-900 border-apple-border dark:border-eco-700/80 hover:shadow-apple-card'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-apple-muted dark:text-eco-400">{claim.trackingNumber}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge(claim.status)}`}>
                  {claim.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-sm font-semibold text-apple-text dark:text-eco-50 leading-snug line-clamp-2">{claim.title}</div>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-apple-muted dark:text-eco-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{claim.locationName}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(claim.submittedAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">
                  {claim.evidence.length > 0 && <><Camera className="w-3 h-3" />{claim.evidence.length}</>}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="xl:col-span-7">
        {!selected ? (
          <div className="h-full min-h-[420px] flex flex-col items-center justify-center p-10 bg-white dark:bg-eco-900 border border-dashed border-apple-border dark:border-eco-700 rounded-3xl text-center">
            <Eye className="w-10 h-10 text-apple-muted dark:text-eco-500 mb-3" />
            <div className="font-semibold text-apple-text dark:text-eco-100">Select a claim to review</div>
            <div className="text-sm text-apple-secondary dark:text-eco-300 mt-1 max-w-sm">
              You will see the full story, evidence files, and can verify or reject with one action.
            </div>
          </div>
        ) : (
          <div className="space-y-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-3xl shadow-apple-card p-6 sm:p-7">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-apple-border dark:border-eco-750 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-env-emerald">{selected.trackingNumber}</span>
                  <span className="font-mono text-xs text-apple-muted dark:text-eco-400">ticket: {selected.ticketNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge(selected.status)}`}>
                    {statusLabel(selected.status)}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mt-2 text-apple-text dark:text-eco-50">{selected.title}</h3>
                <div className="flex items-center gap-4 text-xs text-apple-muted dark:text-eco-400 mt-1.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{selected.locationName}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(selected.submittedAt).toLocaleString()}</span>
                  <span>urgency: <strong className={
                    selected.urgency === 'HIGH' ? 'text-status-critical' : selected.urgency === 'MEDIUM' ? 'text-status-watch' : 'text-status-healthy'
                  }>{selected.urgency}</strong></span>
                </div>
              </div>
            </div>

            {/* Details */}
            <p className="text-sm text-apple-secondary dark:text-eco-300 leading-relaxed bg-apple-subtle dark:bg-eco-850 p-4 rounded-xl">
              {selected.details}
            </p>

            {/* Evidence */}
            <div>
              <div className="text-xs font-mono uppercase text-apple-muted dark:text-eco-400 font-semibold mb-2">
                Evidence ({selected.evidence.length})
              </div>
              {selected.evidence.length === 0 ? (
                <div className="text-xs text-apple-muted dark:text-eco-400 italic">No files attached (e.g. USSD report).</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selected.evidence.map(ev => {
                    const Icon = EvidenceIcon[ev.kind];
                    return (
                      <div key={ev.id} className="p-3 border border-apple-border dark:border-eco-700 rounded-xl flex flex-col gap-1.5 bg-apple-subtle dark:bg-eco-850">
                        {ev.previewUrl && ev.kind === 'PHOTO' ? (
                          <img src={ev.previewUrl} alt={ev.fileName} className="w-full h-20 object-cover rounded-lg" />
                        ) : (
                          <div className="h-20 rounded-lg bg-white dark:bg-eco-800 flex items-center justify-center">
                            <Icon className="w-7 h-7 text-env-emerald" />
                          </div>
                        )}
                        <div className="text-[11px] font-semibold truncate">{ev.fileName}</div>
                        <div className="text-[10px] text-apple-muted dark:text-eco-400">{ev.kind.toLowerCase()} • {(ev.sizeBytes / 1024 / 1024).toFixed(1)} MB</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action log */}
            <div>
              <div className="text-xs font-mono uppercase text-apple-muted dark:text-eco-400 font-semibold mb-2">Action history</div>
              <div className="space-y-1.5">
                {selected.controllerActionLog.map(a => (
                  <div key={a.id} className="flex items-start gap-2 text-xs text-apple-secondary dark:text-eco-300">
                    <span className="font-mono text-apple-muted dark:text-eco-500 shrink-0">{new Date(a.at).toLocaleDateString()}</span>
                    <span className="font-semibold text-apple-text dark:text-eco-100">{a.action.replace('_', ' ')}</span>
                    {a.note && <span className="text-apple-muted dark:text-eco-400">— {a.note}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Review note input */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-mono uppercase text-apple-muted dark:text-eco-400 font-semibold mb-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Reviewer note (optional)
              </label>
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Confirmed with county water office..."
                className="w-full bg-apple-subtle dark:bg-eco-850 border border-apple-border dark:border-eco-700 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-env-emerald placeholder:text-apple-muted dark:placeholder:text-eco-500"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-apple-border dark:border-eco-750">
              {selected.status === 'SUBMITTED' && (
                <button
                  onClick={() => doAction('START_REVIEW')}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-status-watch/10 text-status-watch border border-status-watch/30 rounded-xl text-sm font-bold hover:bg-status-watch/20 transition-all"
                >
                  <Eye className="w-4 h-4" /> Start review
                </button>
              )}
              {(selected.status === 'SUBMITTED' || selected.status === 'UNDER_REVIEW') && (
                <>
                  <button
                    onClick={() => doAction('VERIFY')}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-env-emerald text-white rounded-xl text-sm font-bold hover:bg-env-forest transition-all shadow-apple-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verify as true
                  </button>
                  <button
                    onClick={() => doAction('REJECT')}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-status-critical/10 text-status-critical border border-status-critical/30 rounded-xl text-sm font-bold hover:bg-status-critical/20 transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </>
              )}
              {selected.status === 'VERIFIED' && (
                <button
                  onClick={() => doAction('AWARD')}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-env-emerald text-white rounded-xl text-sm font-bold hover:bg-env-forest transition-all shadow-apple-sm"
                >
                  <Award className="w-4 h-4" /> Send GreenPoints
                </button>
              )}
              {selected.status === 'REWARDED' && (
                <div className="flex items-center gap-2 text-sm font-semibold text-env-emerald">
                  <Award className="w-4 h-4" /> {selected.pointsAwarded} points sent — wallet now {pointsWallet.balance} pts
                </div>
              )}
              {selected.status === 'REJECTED' && (
                <div className="text-sm text-apple-muted dark:text-eco-400">No further action available.</div>
              )}
            </div>

            {actionMsg && (
              <div className="p-3 bg-env-emerald/10 border border-env-emerald/30 rounded-xl text-sm text-env-emerald font-semibold flex items-center gap-2 animate-in fade-in">
                <Signal className="w-4 h-4" /> {actionMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
