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

  return (
    <div className="bg-eco-900 border border-eco-700 rounded p-6 text-eco-50 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-eco-750 pb-4 mb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-eco-400 font-bold">
            Temporal Intelligence Replay
          </span>
          <h3 className="text-base font-bold text-eco-50 mt-1">
            Environmental Time Machine • {selectedLocation.name}
          </h3>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="p-2 bg-eco-800 hover:bg-eco-750 disabled:opacity-40 text-eco-200 rounded transition-colors"
            title="Step Back"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-eco-50 hover:bg-eco-200 text-eco-950 font-bold rounded text-xs md:text-sm transition-colors"
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
            className="p-2 bg-eco-800 hover:bg-eco-750 disabled:opacity-40 text-eco-200 rounded transition-colors"
            title="Step Forward"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="p-2 bg-eco-800 hover:bg-eco-750 text-eco-400 hover:text-eco-200 rounded transition-colors"
            title="Reset to January"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Step Timeline Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-eco-400" />
            <span className="text-sm font-bold text-eco-50">{activeStep.month} ({activeStep.dateStr})</span>
          </div>
          <span className={`text-xs uppercase font-mono px-2.5 py-1 rounded border font-bold ${
            activeStep.status === 'CRITICAL' ? 'text-status-critical-text border-status-critical-border bg-status-critical-subtle' :
            activeStep.status === 'STRESSED' ? 'text-status-stressed-text border-status-stressed-border bg-status-stressed-subtle' :
            activeStep.status === 'WATCH' ? 'text-status-watch-text border-status-watch-border bg-status-watch-subtle' :
            'text-status-healthy-text border-status-healthy-border bg-status-healthy-subtle'
          }`}>
            {activeStep.status}
          </span>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-6 gap-2">
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
                className={`py-2.5 px-1.5 text-center rounded border transition-colors ${
                  isCurrent
                    ? 'bg-eco-750 border-eco-500 text-eco-50 font-bold shadow'
                    : isPast
                    ? 'bg-eco-850 border-eco-700 text-eco-300 font-medium'
                    : 'bg-eco-900 border-eco-800 text-eco-500 hover:text-eco-300 font-normal'
                }`}
              >
                <div className="text-xs truncate font-medium">{st.month.split(' ')[0]}</div>
                <div className="text-sm font-bold mt-0.5">{st.overallStress}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Synchronized Metrics Snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-eco-950 border border-eco-750 rounded p-5 text-sm">
        <div>
          <div className="text-xs text-eco-400 uppercase font-semibold">Overall Stress</div>
          <div className="text-3xl font-bold text-eco-50 mt-1">{activeStep.overallStress} <span className="text-sm text-eco-500 font-normal">/ 100</span></div>
          <div className="text-xs text-eco-300 mt-1">Status: <strong className="text-eco-100 font-semibold">{activeStep.status}</strong></div>
        </div>

        <div>
          <div className="text-xs text-eco-400 uppercase font-semibold">Water Stress</div>
          <div className="text-3xl font-bold text-eco-100 mt-1">{activeStep.waterStress} <span className="text-xs text-eco-500 font-normal">/ 100</span></div>
          <div className="text-xs text-eco-300 mt-1">Rainfall: {activeStep.rainfallDeviationPct > 0 ? '+' : ''}{activeStep.rainfallDeviationPct}%</div>
        </div>

        <div>
          <div className="text-xs text-eco-400 uppercase font-semibold">Heat Stress</div>
          <div className="text-3xl font-bold text-eco-100 mt-1">{activeStep.heatStress} <span className="text-xs text-eco-500 font-normal">/ 100</span></div>
          <div className="text-xs text-eco-300 mt-1">Temp: {activeStep.temperatureC}°C</div>
        </div>

        <div>
          <div className="text-xs text-eco-400 uppercase font-semibold">Community Signal</div>
          <div className="text-3xl font-bold text-eco-100 mt-1">{activeStep.communitySignal} <span className="text-xs text-eco-500 font-normal">/ 100</span></div>
          <div className="text-xs text-eco-300 mt-1">Cooling: +{activeStep.coolingDemandDeltaPct}%</div>
        </div>
      </div>
    </div>
  );
}
