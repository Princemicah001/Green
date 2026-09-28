import { FacilityTelemetry } from '@/types';
import { INITIAL_FACILITIES } from '@/data/facilities';

/**
 * Infrastructure Provider Adapter
 * 
 * Abstraction layer for data center BMS (Building Management Systems) and SCADA telemetry.
 * Normalizes power, cooling, water consumption, and compute load metrics.
 */
export class InfrastructureProvider {
  private static instance: InfrastructureProvider;
  private facilities: FacilityTelemetry[] = [...INITIAL_FACILITIES];

  public static getInstance(): InfrastructureProvider {
    if (!InfrastructureProvider.instance) {
      InfrastructureProvider.instance = new InfrastructureProvider();
    }
    return InfrastructureProvider.instance;
  }

  public async getFacilitiesByLocation(locationId: string): Promise<FacilityTelemetry[]> {
    return this.facilities.filter(f => f.locationId === locationId);
  }

  public async getAllFacilities(): Promise<FacilityTelemetry[]> {
    return [...this.facilities];
  }

  public async updateTelemetry(id: string, updates: Partial<FacilityTelemetry>): Promise<FacilityTelemetry | null> {
    const idx = this.facilities.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.facilities[idx] = {
      ...this.facilities[idx],
      ...updates,
      lastTelemetryAt: new Date().toISOString(),
    };
    return this.facilities[idx];
  }
}
