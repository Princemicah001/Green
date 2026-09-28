import { EnvironmentalSignals, EnvironmentalStatus, StressAssessment, StressContributor } from '@/types';

export interface StressWeights {
  heat: number;
  water: number;
  community: number;
  energy: number;
  anomaly: number;
}

export const DEFAULT_WEIGHTS: StressWeights = {
  heat: 0.30,
  water: 0.30,
  community: 0.20,
  energy: 0.15,
  anomaly: 0.05,
};

/**
 * Environmental Stress Engine
 * 
 * Computes multi-domain environmental stress index using standardized weighted aggregation.
 * Evaluates primary contributors and assigns deterministic environmental operational status.
 */
export function calculateEnvironmentalStress(
  signals: EnvironmentalSignals,
  weights: StressWeights = DEFAULT_WEIGHTS,
  historicalTrend?: number[]
): StressAssessment {
  const heatWeighted = signals.heatStress * weights.heat;
  const waterWeighted = signals.waterStress * weights.water;
  const communityWeighted = signals.communitySignal * weights.community;
  const energyWeighted = signals.energyStress * weights.energy;
  const anomalyWeighted = signals.climateAnomaly * weights.anomaly;

  const rawStress = heatWeighted + waterWeighted + communityWeighted + energyWeighted + anomalyWeighted;
  const overallStress = Math.min(100, Math.max(0, Math.round(rawStress)));

  // Determine operational status
  let status: EnvironmentalStatus = 'HEALTHY';
  if (overallStress >= 75) {
    status = 'CRITICAL';
  } else if (overallStress >= 60) {
    status = 'STRESSED';
  } else if (overallStress >= 40) {
    status = 'WATCH';
  } else {
    status = 'HEALTHY';
  }

  // Rank primary contributors by weighted contribution
  const contributions: { name: StressContributor; value: number }[] = [
    { name: 'Heat Stress', value: heatWeighted },
    { name: 'Water Stress', value: waterWeighted },
    { name: 'Community Signal', value: communityWeighted },
    { name: 'Energy Demand', value: energyWeighted },
    { name: 'Climate Anomaly', value: anomalyWeighted },
  ];

  contributions.sort((a, b) => b.value - a.value);
  const primaryContributors = contributions.slice(0, 3).map(c => c.name);

  // Confidence computation based on signal density and observation count
  const observationBonus = Math.min(10, Math.floor(signals.communityObservationsCount / 15));
  const baseConfidence = 84;
  const confidence = Math.min(98, baseConfidence + observationBonus);

  // Rate of change from recent trend if available
  let rateOfChange: 'INCREASING' | 'STABLE' | 'DECREASING' = 'STABLE';
  if (historicalTrend && historicalTrend.length >= 2) {
    const recent = historicalTrend[historicalTrend.length - 1];
    const prev = historicalTrend[historicalTrend.length - 2];
    const diff = recent - prev;
    if (diff > 2) rateOfChange = 'INCREASING';
    else if (diff < -2) rateOfChange = 'DECREASING';
  }

  return {
    overallStress,
    status,
    confidence,
    primaryContributors,
    rateOfChange,
    calculatedAt: new Date().toISOString(),
  };
}
