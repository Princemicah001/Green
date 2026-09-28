import { HistoricalObservation } from '@/types';
import { HistoricalSeriesPoint, NAIROBI_TIME_MACHINE_STEPS, generate90DaySeries } from '@/data/history';

export class HistoryRepository {
  private static instance: HistoryRepository;

  public static getInstance(): HistoryRepository {
    if (!HistoryRepository.instance) {
      HistoryRepository.instance = new HistoryRepository();
    }
    return HistoryRepository.instance;
  }

  public getTimeMachineSteps(locationId: string): HistoricalObservation[] {
    if (locationId === 'nairobi') {
      return [...NAIROBI_TIME_MACHINE_STEPS];
    }
    // Return generalized time machine steps for other locations
    return NAIROBI_TIME_MACHINE_STEPS.map(step => ({
      ...step,
      id: `${locationId}-${step.id}`,
    }));
  }

  public getSeriesForLocation(locationId: string, baseStress: number, trend: 'INCREASING' | 'STABLE' | 'DECREASING'): HistoricalSeriesPoint[] {
    return generate90DaySeries(baseStress, trend);
  }
}
