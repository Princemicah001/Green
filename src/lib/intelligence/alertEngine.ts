import { EnvironmentalSignals, SentinelAlert, AlertSeverity } from '@/types';

/**
 * Alert Intelligence Engine
 * 
 * Analyzes cross-domain stress signals and evaluates multi-variate threshold breaches.
 * Synthesizes restrained, actionable alerts for operational monitoring.
 */
export function evaluateAlertRules(
  locationId: string,
  locationName: string,
  signals: EnvironmentalSignals,
  previousSignals?: EnvironmentalSignals
): SentinelAlert[] {
  const alerts: SentinelAlert[] = [];
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const baseId = `alt-${Date.now()}`;

  // Water Stress Threshold Rule
  if (signals.waterStress >= 70) {
    alerts.push({
      id: `${baseId}-wat`,
      timestamp: now.toISOString(),
      timeFormatted,
      severity: signals.waterStress >= 80 ? 'CRITICAL' : 'HIGH',
      title: `${locationName} water stress exceeded operational threshold`,
      description: `Observed water stress index reached ${signals.waterStress}/100. Aquifer depletion indicators and localized distribution constraints flagged.`,
      locationId,
      locationName,
      category: 'WATER',
    });
  }

  // Heat Anomaly Rule
  if (signals.heatStress >= 75 || signals.temperatureC >= 31.0) {
    alerts.push({
      id: `${baseId}-heat`,
      timestamp: now.toISOString(),
      timeFormatted,
      severity: signals.heatStress >= 82 ? 'CRITICAL' : 'HIGH',
      title: `Heat anomaly detected in ${locationName} regional basin`,
      description: `Surface temperature anomaly +${(signals.temperatureC - 27.5).toFixed(1)}°C above 10-year seasonal baseline. Cooling loads elevated by ${signals.coolingDemandDeltaPct > 0 ? '+' : ''}${signals.coolingDemandDeltaPct}%.`,
      locationId,
      locationName,
      category: 'HEAT',
    });
  }

  // Community Signal Rule
  if (signals.communitySignal >= 70 || (previousSignals && (signals.communitySignal - previousSignals.communitySignal) >= 6)) {
    alerts.push({
      id: `${baseId}-comm`,
      timestamp: now.toISOString(),
      timeFormatted,
      severity: 'HIGH',
      title: `Community observations increased in ${locationName}`,
      description: `Cluster of ${signals.communityObservationsCount} verified community telemetry submissions received. Dominant pattern indicates localized municipal resource strain.`,
      locationId,
      locationName,
      category: 'COMMUNITY',
    });
  }

  return alerts;
}
