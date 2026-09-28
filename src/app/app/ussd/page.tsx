'use client';

import React from 'react';
import UssdPhoneSimulator from '@/components/ussd/UssdPhoneSimulator';
import {
  Smartphone, MessageSquareText, TicketCheck, Wallet, Gift, Radio,
} from 'lucide-react';

const USSD_CODE = '*384*EC#';

const MENU_PREVIEW = [
  { icon: MessageSquareText, label: 'Report a problem', desc: 'Step-by-step menus, no internet needed' },
  { icon: TicketCheck, label: 'Earn points', desc: 'Enter your ticket number from a verified report' },
  { icon: Wallet, label: 'Check GreenPoints', desc: 'Hear your balance instantly' },
  { icon: Gift, label: 'Redeem rewards', desc: 'Swap points for solar lamps, pumps and more' },
];

export default function UssdPage() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-apple-border dark:border-eco-750 pb-5">
        <div className="text-xs font-mono uppercase tracking-widest text-apple-muted dark:text-eco-400 font-semibold">
          Works on any phone — no internet needed
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-apple-text dark:text-eco-50 tracking-tight mt-1 flex flex-wrap items-center gap-3">
          <span>Green Line</span>
          <span className="font-mono bg-env-emerald/10 text-env-emerald px-3 py-1 rounded-xl text-xl sm:text-2xl">{USSD_CODE}</span>
        </h1>
        <p className="text-sm sm:text-base text-apple-secondary dark:text-eco-300 font-sans mt-2 max-w-3xl">
          Dial the code on any feature phone and a simple menu walks you through reporting a problem,
          checking progress, or collecting GreenPoints with your ticket number. Try the real menus below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Phone Simulator */}
        <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-24">
          <UssdPhoneSimulator />
        </div>

        {/* Explanation Side */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-4.5 h-4.5 text-env-emerald" />
              <span className="font-bold text-apple-text dark:text-eco-50">What you can do on the Green Line</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MENU_PREVIEW.map(m => (
                <div key={m.label} className="p-4 bg-apple-subtle dark:bg-eco-850 rounded-xl flex items-start gap-3">
                  <m.icon className="w-5 h-5 text-env-emerald shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-apple-text dark:text-eco-100">{m.label}</div>
                    <div className="text-xs text-apple-secondary dark:text-eco-300 mt-0.5 leading-relaxed">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-4.5 h-4.5 text-env-emerald" />
              <span className="font-bold text-apple-text dark:text-eco-50">Try this journey</span>
            </div>
            {[
              { step: 1, text: 'Press 1 to report a problem — pick the kind, how bad, where, then describe it.' },
              { step: 2, text: 'You get a tracking number on screen. Press 2 anytime to check progress.' },
              { step: 3, text: 'When reviewers verify it, press 3 and enter your ticket number — points land in your wallet.' },
              { step: 4, text: 'Press 5 to redeem points for a solar lamp, pump or seed pack — a voucher code appears on screen.' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-env-emerald/10 text-env-emerald text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </span>
                <span className="text-sm text-apple-secondary dark:text-eco-300 leading-relaxed">{s.text}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-env-emerald/5 border border-env-emerald/20 rounded-2xl text-xs sm:text-sm text-apple-secondary dark:text-eco-300 leading-relaxed">
            <strong className="text-apple-text dark:text-eco-100">No smartphone? No problem.</strong> The Green Line runs on the same
            network as voice calls. Data stays private, and your ticket number is all you need to collect rewards — even from a borrowed phone.
          </div>
        </div>
      </div>
    </div>
  );
}
