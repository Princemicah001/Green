import { HistoricalObservation } from '@/types';

export const NAIROBI_TIME_MACHINE_STEPS: HistoricalObservation[] = [
  {
    id: 'nbo-hist-1',
    timestamp: '2026-01-15T12:00:00Z',
    month: 'January',
    dateStr: '15 Jan 2026',
    waterStress: 34,
    energyStress: 38,
    heatStress: 36,
    communitySignal: 28,
    overallStress: 35,
    status: 'HEALTHY',
    temperatureC: 25.4,
    rainfallDeviationPct: 12,
    coolingDemandDeltaPct: -4,
  },
  {
    id: 'nbo-hist-2',
    timestamp: '2026-02-15T12:00:00Z',
    month: 'February',
    dateStr: '15 Feb 2026',
    waterStress: 38,
    energyStress: 42,
    heatStress: 41,
    communitySignal: 34,
    overallStress: 39,
    status: 'HEALTHY',
    temperatureC: 26.8,
    rainfallDeviationPct: 4,
    coolingDemandDeltaPct: 2,
  },
  {
    id: 'nbo-hist-3',
    timestamp: '2026-03-15T12:00:00Z',
    month: 'March',
    dateStr: '15 Mar 2026',
    waterStress: 49,
    energyStress: 46,
    heatStress: 54,
    communitySignal: 44,
    overallStress: 48,
    status: 'WATCH',
    temperatureC: 28.5,
    rainfallDeviationPct: -6,
    coolingDemandDeltaPct: 7,
  },
  {
    id: 'nbo-hist-4',
    timestamp: '2026-04-15T12:00:00Z',
    month: 'April',
    dateStr: '15 Apr 2026',
    waterStress: 64,
    energyStress: 55,
    heatStress: 68,
    communitySignal: 56,
    overallStress: 61,
    status: 'STRESSED',
    temperatureC: 30.1,
    rainfallDeviationPct: -14,
    coolingDemandDeltaPct: 13,
  },
  {
    id: 'nbo-hist-5',
    timestamp: '2026-05-15T12:00:00Z',
    month: 'May',
    dateStr: '15 May 2026',
    waterStress: 72,
    energyStress: 61,
    heatStress: 79,
    communitySignal: 66,
    overallStress: 68,
    status: 'STRESSED',
    temperatureC: 31.4,
    rainfallDeviationPct: -18,
    coolingDemandDeltaPct: 17,
  },
  {
    id: 'nbo-hist-6',
    timestamp: '2026-06-15T12:00:00Z',
    month: 'June (Projected / Simulated)',
    dateStr: '15 Jun 2026',
    waterStress: 84,
    energyStress: 69,
    heatStress: 86,
    communitySignal: 74,
    overallStress: 78,
    status: 'CRITICAL',
    temperatureC: 32.8,
    rainfallDeviationPct: -27,
    coolingDemandDeltaPct: 24,
  },
];

export interface HistoricalSeriesPoint {
  date: string;
  waterStress: number;
  energyStress: number;
  heatStress: number;
  communitySignal: number;
  overallStress: number;
  baseline: number;
}

export function generate90DaySeries(baseStress: number, trend: 'INCREASING' | 'STABLE' | 'DECREASING'): HistoricalSeriesPoint[] {
  const points: HistoricalSeriesPoint[] = [];
  const totalDays = 90;
  const baseline = 48;

  for (let i = totalDays; i >= 0; i -= 3) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const progress = (totalDays - i) / totalDays; // 0 to 1

    let delta = 0;
    if (trend === 'INCREASING') {
      delta = (progress * 26) - 13;
    } else if (trend === 'DECREASING') {
      delta = 10 - (progress * 15);
    } else {
      delta = Math.sin(progress * Math.PI * 4) * 4;
    }

    const overall = Math.min(95, Math.max(20, Math.round(baseStress - 10 + delta)));
    const water = Math.min(100, Math.max(15, Math.round(overall * 1.05 + Math.sin(i) * 3)));
    const heat = Math.min(100, Math.max(15, Math.round(overall * 1.1 + Math.cos(i) * 4)));
    const energy = Math.min(100, Math.max(15, Math.round(overall * 0.9 + Math.sin(i * 0.5) * 2)));
    const community = Math.min(100, Math.max(10, Math.round(overall * 0.95 + Math.cos(i * 0.8) * 3)));

    points.push({
      date: dateStr,
      waterStress: water,
      energyStress: energy,
      heatStress: heat,
      communitySignal: community,
      overallStress: overall,
      baseline,
    });
  }

  return points;
}
