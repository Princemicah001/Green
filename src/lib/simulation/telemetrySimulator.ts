import { EnvironmentalSignals, FacilityTelemetry } from '@/types';

/**
 * Realistic Telemetry Simulator
 * 
 * Simulates real-world environmental dynamics with bounded continuous variance.
 * Prevents erratic value jumps; implements thermal inertia and thermodynamic correlation.
 */
export class TelemetrySimulator {
  /**
   * Applies subtle continuous jitter (ambient thermal flutter, diurnal oscillation)
   */
  public static simulateAmbientFlutter(signals: EnvironmentalSignals): EnvironmentalSignals {
    // Temperature flutter: max +/- 0.1°C
    const tempDelta = Number((Math.random() * 0.2 - 0.1).toFixed(1));
    const newTemp = Number(Math.max(15, Math.min(45, signals.temperatureC + tempDelta)).toFixed(1));

    // Water stress flutter: +/- 0 or 1 point
    const waterDelta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const newWater = Math.max(0, Math.min(100, signals.waterStress + waterDelta));

    // Energy stress flutter
    const energyDelta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const newEnergy = Math.max(0, Math.min(100, signals.energyStress + energyDelta));

    return {
      ...signals,
      temperatureC: newTemp,
      waterStress: newWater,
      energyStress: newEnergy,
    };
  }

  /**
   * Simulates a progressive Heat Wave Event (Demonstration Scenario Step)
   * Temperature rises gradually, causing cooling surge and water demand escalation.
   */
  public static applyHeatSpike(signals: EnvironmentalSignals): EnvironmentalSignals {
    const elevatedTemp = Number((signals.temperatureC + 1.4).toFixed(1)); // 31.4 -> 32.8
    const elevatedHeatStress = Math.min(95, signals.heatStress + 5);      // e.g. 79 -> 84
    const elevatedCooling = signals.coolingDemandDeltaPct + 7;             // e.g. 17% -> 24%
    const elevatedEnergy = Math.min(90, signals.energyStress + 6);        // e.g. 61 -> 67

    return {
      ...signals,
      temperatureC: elevatedTemp,
      heatStress: elevatedHeatStress,
      coolingDemandDeltaPct: elevatedCooling,
      energyStress: elevatedEnergy,
    };
  }

  /**
   * Simulates a Community Water Strain Event (Demonstration Scenario Step)
   * A cluster of community water reports raises the community signal and regional water stress.
   */
  public static applyCommunityWaterSurge(signals: EnvironmentalSignals): EnvironmentalSignals {
    const newCommunitySignal = Math.min(96, signals.communitySignal + 8); // 66 -> 74
    const newWaterStress = Math.min(96, signals.waterStress + 5);         // 72 -> 77
    const newCount = signals.communityObservationsCount + 12;

    return {
      ...signals,
      communitySignal: newCommunitySignal,
      waterStress: newWaterStress,
      communityObservationsCount: newCount,
    };
  }

  /**
   * Applies facility telemetry gradual changes based on ambient temperature
   */
  public static updateFacilityTelemetry(facility: FacilityTelemetry, ambientTemp: number): FacilityTelemetry {
    // Cooling demand tracks ambient temperature
    const tempAboveBaseline = Math.max(0, ambientTemp - 25);
    const targetCooling = Math.min(98, Math.round(50 + tempAboveBaseline * 4.5));
    // Soft interpolation toward target
    const currentCooling = facility.coolingDemandPct;
    const interpolatedCooling = Math.round(currentCooling + (targetCooling - currentCooling) * 0.2);

    return {
      ...facility,
      ambientTempC: ambientTemp,
      coolingDemandPct: interpolatedCooling,
      lastTelemetryAt: new Date().toISOString(),
    };
  }
}
