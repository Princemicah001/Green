'use client';

import React from 'react';
import { useSentinel } from '@/lib/store/sentinelStore';
import { Play, RotateCcw, Clapperboard } from 'lucide-react';

const scenarioStepLabels = [
  'Ready: Nairobi initial',
  'Step 1: Community surge',
  'Step 2: Heat spike (critical)',
  'Step 3: Mitigated response',
];

export default function DemoScenarioBar() {
  const { demoStep, runNextDemoStep, resetDemoScenario } = useSentinel();

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl px-4 py-3 shadow-apple-card">
      <span className="flex items-center gap-1.5 text-xs font-mono text-apple-secondary dark:text-eco-400 uppercase tracking-wider font-semibold">
        <Clapperboard className="w-3.5 h-3.5" /> Guided demo:
      </span>
      <span className="font-sans text-apple-text dark:text-eco-100 text-xs font-semibold">
        {scenarioStepLabels[demoStep] || 'Scenario complete'}
      </span>

      <button
        onClick={runNextDemoStep}
        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-env-emerald hover:bg-env-forest text-white rounded-full font-sans text-xs font-semibold shadow-sm transition-all active:scale-95"
      >
        <Play className="w-3 h-3 fill-current" />
        <span>{demoStep === 0 ? 'Start' : demoStep >= 3 ? 'Reset' : 'Next step'}</span>
      </button>

      {demoStep > 0 && demoStep < 3 && (
        <button
          onClick={resetDemoScenario}
          className="p-1.5 text-apple-muted dark:text-eco-400 hover:text-apple-text dark:hover:text-eco-100 transition-colors"
          title="Reset scenario"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
