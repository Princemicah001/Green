'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import { ClaimProvider } from '@/lib/providers/claimProvider';
import { GIFT_CATALOG } from '@/data/gifts';
import { ClaimCategory } from '@/types';
import { Signal, Battery } from 'lucide-react';

interface UssdPhoneSimulatorProps {
  /** Ticket number to preselect in the "Earn points" flow */
  presetTicket?: string;
}

type Mode = 'menu' | 'input' | 'end';
type ScreenId =
  | 'MAIN'
  | 'REPORT_KIND'
  | 'REPORT_URGENCY'
  | 'REPORT_PLACE'
  | 'REPORT_TITLE'
  | 'REPORT_DETAILS'
  | 'REPORT_CONFIRM'
  | 'CHECK_ENTER'
  | 'EARN_ENTER'
  | 'REDEEM_LIST'
  | 'REDEEM_CONFIRM';

const USSD_CODE = '*384*EC#';

const KIND_OPTIONS: Array<{ id: ClaimCategory; label: string }> = [
  { id: 'WATER', label: 'Water problem' },
  { id: 'ENERGY', label: 'Power problem' },
  { id: 'POLLUTION', label: 'Pollution' },
  { id: 'FLOODING', label: 'Flooding' },
  { id: 'WASTE', label: 'Waste dumping' },
  { id: 'OTHER', label: 'Other' },
];

const URGENCY_OPTIONS: Array<{ id: 'LOW' | 'MEDIUM' | 'HIGH'; label: string }> = [
  { id: 'HIGH', label: 'Urgent' },
  { id: 'MEDIUM', label: 'Serious' },
  { id: 'LOW', label: 'Can wait' },
];

export default function UssdPhoneSimulator({ presetTicket }: UssdPhoneSimulatorProps) {
  const {
    claims, locations, submitClaim, awardClaimPoints, pointsWallet, redeemGift,
  } = useSentinel();
  const provider = ClaimProvider.getInstance();

  const [screen, setScreen] = useState<ScreenId>('MAIN');
  const [mode, setMode] = useState<Mode>('menu');
  const [lines, setLines] = useState<string[]>([]);
  const [inputBuf, setInputBuf] = useState('');
  const [ctx, setCtx] = useState<Record<string, string>>({});
  const [hasPreset, setHasPreset] = useState(!!presetTicket);

  const giftPage = useRef(0);

  // Boot to main menu (or straight to earn screen when preset ticket given)
  useEffect(() => {
    if (presetTicket) {
      setCtx({ ticket: presetTicket });
      goTo('EARN_ENTER');
    } else {
      goTo('MAIN');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetTicket]);

  const render = (id: ScreenId) => {
    switch (id) {
      case 'MAIN':
        setLines([
          'ECO-SHIELD GREEN',
          '1. Report a problem',
          '2. Check my report',
          '3. Earn points (ticket)',
          '4. My GreenPoints',
          '5. Redeem points',
          '6. Latest updates',
          '0. Exit',
        ]);
        setMode('menu');
        break;

      case 'REPORT_KIND':
        setLines([
          'What kind of problem?',
          ...KIND_OPTIONS.map((k, i) => `${i + 1}. ${k.label}`),
        ]);
        setMode('menu');
        break;

      case 'REPORT_URGENCY':
        setLines([
          'How bad is it?',
          ...URGENCY_OPTIONS.map((u, i) => `${i + 1}. ${u.label}`),
        ]);
        setMode('menu');
        break;

      case 'REPORT_PLACE':
        setLines([
          'Where is it?',
          ...locations.slice(0, 8).map((l, i) => `${i + 1}. ${l.name}`),
        ]);
        setMode('menu');
        break;

      case 'REPORT_TITLE':
        setLines(['Describe the problem', 'in one short line:']);
        setMode('input');
        break;

      case 'REPORT_DETAILS':
        setLines(['Add more detail', '(what you see, since when):']);
        setMode('input');
        break;

      case 'REPORT_CONFIRM': {
        const loc = locations.find(l => l.id === ctx.locationId);
        const kind = KIND_OPTIONS.find(k => k.id === ctx.category)?.label;
        const urg = URGENCY_OPTIONS.find(u => u.id === ctx.urgency)?.label;
        setLines([
          'Check your report:',
          `Place: ${loc?.name ?? '-'}`,
          `Kind: ${kind ?? '-'}`,
          `How bad: ${urg ?? '-'}`,
          `What: ${ctx.title?.slice(0, 26) ?? '-'}`,
          '',
          '1. Send report',
          '2. Cancel',
        ]);
        setMode('menu');
        break;
      }

      case 'CHECK_ENTER':
        setLines(['Enter your tracking', 'number e.g. EC-48213:']);
        setMode('input');
        break;

      case 'EARN_ENTER':
        setLines(['Enter the ticket number', 'from your verified', 'report e.g. TK-90411:']);
        setMode('input');
        break;

      case 'REDEEM_LIST': {
        const page = giftPage.current;
        const start = page * 5;
        const slice = GIFT_CATALOG.slice(start, start + 5);
        setLines([
          `GreenPoints: ${pointsWallet.balance}`,
          ...slice.map((g, i) => `${i + 1}. ${g.name} (${g.costPoints})`),
          ...(GIFT_CATALOG.length > start + 5 ? ['8. Next items'] : []),
          '0. Back',
        ]);
        setMode('menu');
        break;
      }

      case 'REDEEM_CONFIRM': {
        const gift = GIFT_CATALOG.find(g => g.id === ctx.giftId);
        setLines([
          `${gift?.name}`,
          `Cost: ${gift?.costPoints} pts`,
          `You have: ${pointsWallet.balance} pts`,
          '',
          '1. Confirm redeem',
          '2. Cancel',
        ]);
        setMode('menu');
        break;
      }
    }
  };

  const goTo = (id: ScreenId) => {
    setScreen(id);
    setInputBuf('');
    render(id);
  };

  const end = (msg: string) => {
    setLines(msg.split('\n'));
    setMode('end');
  };

  const handleCheckReport = (refInput: string) => {
    const claim = provider.findClaimByRef(claims, refInput);
    if (!claim) {
      end(`Report not found.\nCheck the number and\ntry again.\n\nDial again to retry.`);
      return;
    }
    const statusText = provider.statusText(claim.status);
    end([
      `Report ${claim.trackingNumber}`,
      `"${claim.title.slice(0, 30)}"`,
      '',
      `Status:`,
      statusText,
      ...(claim.status === 'VERIFIED' && claim.ticketNumber
        ? ['', `Your ticket: ${claim.ticketNumber}`, 'Choose "Earn points"', 'to collect reward!']
        : []),
      ...(claim.status === 'REWARDED'
        ? ['', `+${claim.pointsAwarded} pts already sent.`]
        : []),
    ].join('\n'));
  };

  const handleEarnPoints = (ticketInput: string) => {
    const ticket = provider.normalizeRef(ticketInput);
    const claim = claims.find(c => c.ticketNumber.toUpperCase() === ticket);
    if (!claim) {
      end(`Ticket not found.\nUse the TK number from\nyour verified report.`);
      return;
    }
    if (claim.status !== 'VERIFIED') {
      end(
        claim.status === 'REWARDED'
          ? `This ticket was already\nrewarded (+${claim.pointsAwarded} pts).`
          : `This report is not\nverified yet.\nStatus: ${provider.statusText(claim.status)}`
      );
      return;
    }
    // Award
    awardClaimPoints(claim.id);
    const pts = provider.computePoints(claim.urgency, claim.evidence.length);
    end([
      `CONGRATULATIONS!`,
      '',
      `+${pts} GreenPoints added`,
      `to your wallet.`,
      '',
      `Ref: ${claim.ticketNumber}`,
      `New balance shown in`,
      `option 4.`,
    ].join('\n'));
  };

  const handleRedeemChoice = (key: string) => {
    const page = giftPage.current;
    const start = page * 5;
    const slice = GIFT_CATALOG.slice(start, start + 5);
    const idx = parseInt(key, 10) - 1;
    if (key === '8' && GIFT_CATALOG.length > start + 5) {
      giftPage.current = page + 1;
      goTo('REDEEM_LIST');
      return;
    }
    if (key === '0') {
      giftPage.current = 0;
      goTo('MAIN');
      return;
    }
    const gift = slice[idx];
    if (!gift) return;
    setCtx(prev => ({ ...prev, giftId: gift.id }));
    // Must defer render until ctx is applied — use direct lines
    setLines([
      `${gift.name}`,
      `Cost: ${gift.costPoints} pts`,
      `You have: ${pointsWallet.balance} pts`,
      '',
      '1. Confirm redeem',
      '2. Cancel',
    ]);
    setScreen('REDEEM_CONFIRM');
    setMode('menu');
    setInputBuf('');
  };

  const handleRedeemConfirm = (key: string) => {
    if (key === '2') {
      giftPage.current = 0;
      goTo('MAIN');
      return;
    }
    if (key !== '1') return;
    const gift = GIFT_CATALOG.find(g => g.id === ctx.giftId);
    if (!gift) { goTo('MAIN'); return; }
    const ok = redeemGift(gift);
    end(
      ok
        ? `REDEEMED!\n\n${gift.name}\n-${gift.costPoints} pts\n\nVoucher code:\nGR-${gift.id.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}\n\nShow this SMS at the\npickup point.`
        : `Not enough points.\n\n${gift.name} costs\n${gift.costPoints} pts.\nYou have ${pointsWallet.balance}.`
    );
  };

  const handleReportSend = async (key: string) => {
    if (key === '2') { goTo('MAIN'); return; }
    if (key !== '1') return;
    const loc = locations.find(l => l.id === ctx.locationId) || locations[0];
    if (!loc) return;
    await submitClaim({
      locationId: loc.id,
      locationName: loc.name,
      title: ctx.title || 'USSD report',
      details: ctx.details || 'Reported via *384*EC# feature phone.',
      category: (ctx.category as ClaimCategory) || 'OTHER',
      urgency: (ctx.urgency as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM',
      evidence: [],
    }).then((claim) => {
      end([
        `REPORT SENT. Thank you!`,
        '',
        `Tracking number:`,
        claim.trackingNumber,
        '',
        'Save it. Use option 2',
        'anytime to check.',
        'If verified, a ticket',
        'number earns points.',
      ].join('\n'));
    });
  };

  const processMenu = (key: string) => {
    switch (screen) {
      case 'MAIN': {
        switch (key) {
          case '1': goTo('REPORT_KIND'); break;
          case '2': goTo('CHECK_ENTER'); break;
          case '3': goTo('EARN_ENTER'); break;
          case '4': {
            const w = pointsWallet;
            end([
              `MY GREENPOINTS`,
              `Balance: ${w.balance} pts`,
              `Lifetime earned: ${w.totalEarned}`,
              `Lifetime redeemed: ${w.totalRedeemed}`,
              '',
              w.balance > 0 ? 'Use option 5 to spend!' : 'Earn points by reporting.',
            ].join('\n'));
            break;
          }
          case '5': giftPage.current = 0; goTo('REDEEM_LIST'); break;
          case '6': {
            const recent = claims.slice(0, 3);
            end([
              'LATEST UPDATES',
              ...recent.map(c => `- ${c.locationName}: ${c.status === 'VERIFIED' || c.status === 'REWARDED' ? 'report verified' : c.status === 'UNDER_REVIEW' ? 'under review' : 'new report received'}`),
              '',
              'Thank you for helping!',
            ].join('\n'));
            break;
          }
          case '0': end('Thank you for caring\nfor the environment.\nGoodbye.'); break;
          default: goTo('MAIN');
        }
        break;
      }
      case 'REPORT_KIND': {
        const k = KIND_OPTIONS[parseInt(key, 10) - 1];
        if (!k) { goTo('REPORT_KIND'); return; }
        setCtx(p => ({ ...p, category: k.id }));
        goTo('REPORT_URGENCY');
        break;
      }
      case 'REPORT_URGENCY': {
        const u = URGENCY_OPTIONS[parseInt(key, 10) - 1];
        if (!u) { goTo('REPORT_URGENCY'); return; }
        setCtx(p => ({ ...p, urgency: u.id }));
        goTo('REPORT_PLACE');
        break;
      }
      case 'REPORT_PLACE': {
        const l = locations[parseInt(key, 10) - 1];
        if (!l) { goTo('REPORT_PLACE'); return; }
        setCtx(p => ({ ...p, locationId: l.id }));
        goTo('REPORT_TITLE');
        break;
      }
      case 'REPORT_CONFIRM': {
        handleReportSend(key);
        break;
      }
      case 'REDEEM_LIST': handleRedeemChoice(key); break;
      case 'REDEEM_CONFIRM': handleRedeemConfirm(key); break;
      default: goTo('MAIN');
    }
  };

  const submitInput = () => {
    const val = inputBuf.trim();
    if (!val) return;
    switch (screen) {
      case 'REPORT_TITLE':
        setCtx(p => ({ ...p, title: val }));
        goTo('REPORT_DETAILS');
        break;
      case 'REPORT_DETAILS':
        setCtx(p => ({ ...p, details: val }));
        goTo('REPORT_CONFIRM');
        break;
      case 'CHECK_ENTER': handleCheckReport(val); break;
      case 'EARN_ENTER': handleEarnPoints(val); break;
      default: break;
    }
  };

  const press = (key: string) => {
    if (mode === 'end') { goTo('MAIN'); return; }
    if (mode === 'menu') { processMenu(key); return; }
    // input mode
    if (key === 'DEL') { setInputBuf(p => p.slice(0, -1)); return; }
    if (key === 'OK') { submitInput(); return; }
    setInputBuf(p => (p + key).slice(0, 24));
  };

  // Auto-fire preset ticket once user reaches EARN screen with preset
  useEffect(() => {
    if (hasPreset && presetTicket && screen === 'EARN_ENTER') {
      setInputBuf(presetTicket);
      setHasPreset(false);
    }
  }, [hasPreset, presetTicket, screen]);

  const KEYS: Array<string[]> = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      {/* Feature Phone Body */}
      <div className="w-[300px] bg-slate-800 dark:bg-slate-900 rounded-[2.5rem] p-3 shadow-apple-hover border border-slate-700">
        {/* Speaker + brand */}
        <div className="flex items-center justify-between px-6 pt-2 pb-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">ECO-TEL</span>
          </div>
          <div className="w-10 h-1.5 bg-slate-700 rounded-full" />
          <div className="flex items-center gap-1 text-slate-400">
            <Battery className="w-4 h-4" />
            <span className="text-[10px] font-mono">86%</span>
          </div>
        </div>

        {/* Screen */}
        <div className="bg-[#c7e000] bg-gradient-to-b from-[#d4f022] to-[#b3cc00] rounded-xl px-3 py-3 h-56 overflow-hidden shadow-inner">
          <div className="h-full flex flex-col font-mono text-[13px] leading-[1.35] text-slate-900">
            <div className="flex-1 whitespace-pre-wrap overflow-hidden">
              {lines.map((l, i) => (
                <div key={i} className={i === 0 ? 'font-bold border-b border-slate-900/30 pb-1 mb-1' : ''}>
                  {l || '\u00A0'}
                </div>
              ))}
            </div>
            {mode === 'input' && (
              <div className="border-t-2 border-slate-900/50 pt-1.5 flex items-center bg-black/10 rounded px-1">
                <span className="truncate flex-1">{inputBuf || <span className="opacity-50">type...</span>}</span>
                <span className="w-2 h-4 bg-slate-900 animate-pulse" />
              </div>
            )}
            {mode === 'end' && (
              <div className="text-center text-[11px] font-bold pt-1 opacity-70">press any key</div>
            )}
          </div>
        </div>

        {/* Keypad */}
        <div className="px-2 pt-3 pb-1 space-y-2">
          {KEYS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-2">
              {row.map(k => (
                <button
                  key={k}
                  onClick={() => press(k)}
                  className="h-11 rounded-full bg-slate-200 hover:bg-white active:bg-slate-300 active:scale-95 text-slate-900 font-bold text-base shadow-md transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => press('DEL')}
              className="h-10 rounded-full bg-orange-400 hover:bg-orange-300 active:scale-95 text-slate-900 font-bold text-xs shadow-md transition-all"
            >
              CLEAR
            </button>
            <button
              onClick={() => press('OK')}
              className="h-10 rounded-full bg-env-emerald hover:bg-env-leaf active:scale-95 text-white font-bold text-xs shadow-md transition-all"
            >
              OK
            </button>
            <button
              onClick={() => goTo('MAIN')}
              className="h-10 rounded-full bg-slate-400 hover:bg-slate-300 active:scale-95 text-slate-900 font-bold text-xs shadow-md transition-all"
            >
              MENU
            </button>
          </div>
        </div>
      </div>

      {/* Session helper text */}
      <div className="text-center text-xs text-apple-secondary dark:text-eco-300 max-w-[300px] leading-relaxed">
        Simulating <span className="font-mono font-bold text-env-emerald">{USSD_CODE}</span> — the same menus run on any feature phone, no internet needed.
      </div>
    </div>
  );
}
