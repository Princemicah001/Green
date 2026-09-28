'use client';

import React, { useState, useEffect } from 'react';
import { HistoryRepository } from '@/lib/repositories/historyRepository';
import { useSentinel } from '@/lib/store/sentinelStore';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function TimeMachineReplay() {
  const { selectedLocation, selectedLocationId } = useSentinel();
  const historyRepo = HistoryRepository.getInstance();
  const steps = historyRepo.getTimeMachineSteps(selectedLocationId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed] = useState(1800); // 1.8 seconds per step

  const activeStep = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, playbackSpeed]);

  const statusBadge = 
    activeStep.status === 'CRITICAL' ? 'bg-status-critical/10 text-status-critical border-status-critical/30' :
    activeStep.status === 'STRESSED' ? 'bg-status-stressed/10 text-status-stressed border-status-stressed/30' :
    activeStep.status === 'WATCH' ? 'bg-status-watch/10 text-status-watch border-status-watch/30' :
    'bg-status-healthy/10 text-status-healthy border-status-healthy/30';

  return (
    <div className="bg-white dark:bg-eco-900 border border-apple-border dark:border-eco-700/80 rounded-2xl shadow-apple-card p-6 sm:p-7 text-apple-text dark:text-eco-50 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-apple-border dark:border-eco-750 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-apple-muted dark:text-eco-400 font-semibold font-mono">
            Temporal Intelligence Replay
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-apple-text dark:text-eco-50 mt-1">
            Environmental Time Machine • {selectedLocation.name}
          </h3>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="p-2 bg-apple-subtle hover:bg-apple-hover dark:bg-eco-800 dark:hover:bg-eco-750 disabled:opacity-40 text-apple-secondary dark:text-eco-200 rounded-xl transition-all border border-apple-border dark:border-eco-700"
            title="Step Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-5 py-2 bg-env-emerald hover:bg-env-forest text-white font-medium rounded-xl text-sm transition-all shadow-apple-sm active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Replay</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === steps.length - 1}
            className="p-2 bg-apple-subtle hover:bg-apple-hover dark:bg-eco-800 dark:hover:bg-eco-750 disabled:opacity-40 text-apple-secondary dark:text-eco-200 rounded-xl transition-all border border-apple-border dark:border-eco-700"
            title="Step Forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="p-2 bg-apple-subtle hover:bg-apple-hover dark:bg-eco-800 dark:hover:bg-eco-750 text-apple-muted dark:text-eco-400 rounded-xl transition-all border border-apple-border dark:border-eco-700 ml-1"
            title="Reset to January"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Timeline Indicator */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-env-emerald" />
            <span className="text-base font-bold text-apple-text dark:text-eco-50">{activeStep.month} ({activeStep.dateStr})</span>
          </div>
          <span className={`text-xs uppercase font-mono px-3 py-1 rounded-full border font-bold ${statusBadge}`}>
            {activeStep.status}
          </span>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {steps.map((st, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(idx);
                }}
                className={`py-3 px-2 text-center rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-env-emerald text-white border-env-emerald font-bold shadow-apple-sm scale-[1.02]'
                    : isPast
                    ? 'bg-apple-subtle/80 dark:bg-eco-850 border-apple-border dark:border-eco-700 text-apple-text dark:text-eco-200 font-medium'
                    : 'bg-white dark:bg-eco-900 border-apple-border/60 dark:border-eco-800 text-apple-muted dark:text-eco-500 hover:bg-apple-subtle font-normal'
                }`}
              >
                <div className="text-xs truncate font-medium">{st.month.split(' ')[0]}</div>
                <div className="text-base font-bold font-mono mt-0.5">{st.overallStress}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Synchronized Metrics Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-apple-subtle/50 dark:bg-eco-950 border border-apple-border dark:border-eco-750 rounded-2xl p-5 text-sm">
        <div>
          <div className="text-xs text-apple-muted dark:text-eco-400 uppercase font-semibold font-mono">Overall Stress</div>
          <div className="text-3xl font-bold font-mono text-apple-text dark:text-eco-50 mt-1">{activeStep.overallStress} <span className="text-sm text-apple-muted dark:text-eco-500 font-normal">/ 100</span></div>
          <div className="text-xs text-apple-secondary dark:text-eco-300 mt-1">Status: <strong className="text-apple-text dark:text-eco-100 font-semibold">{activeStep.status}</strong></div>
        </div>

        <div>
          <div className="text-xs text-apple-muted dark:text-eco-400 uppercase font-semibold font-mono">Water Stress</div>
          <div className="text-3xl font-bold font-mono text-apple-text dark:text-eco-100 mt-1">{activeStep.waterStress} <span className="text-xs text-apple-muted dark:text-eco-500 font-normal">/ 100</span></div>
          <div className="text-xs text-apple-secondary dark:text-eco-300 mt-1">Rainfall: {activeStep.rainfallDeviationPct > 0 ? '+' : ''}{activeStep.rainfallDeviationPct}%</div>
        </div>

        <div>
          <div className="text-xs text-apple-muted dark:text-eco-400 uppercase font-semibold font-mono">Heat Stress</div>
          <div className="text-3xl font-bold font-mono text-apple-text dark:text-eco-100 mt-1">{activeStep.heatStress} <span className="text-xs text-apple-muted dark:text-eco-500 font-normal">/ 100</span></div>
          <div className="text-xs text-apple-secondary dark:text-eco-300 mt-1">Surface: {activeStep.temperatureC}°C</div>
        </div>

        <div>
          <div className="text-xs text-apple-muted dark:text-eco-400 uppercase font-semibold font-mono">Energy Load</div>
          <div className="text-3xl font-bold font-mono text-apple-text dark:text-eco-100 mt-1">{activeStep.energyStress} <span className="text-xs text-apple-muted dark:text-eco-500 font-normal">/ 100</span></div>
          <div className="text-xs text-apple-secondary dark:text-eco-300 mt-1">Community: {activeStep.communitySignal} signals</div>
        </div>
      </div>
    </div>
  );
}
