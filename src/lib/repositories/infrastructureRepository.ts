import { FacilityTelemetry } from '@/types';
import { INITIAL_FACILITIES } from '@/data/facilities';

export class InfrastructureRepository {
  private static instance: InfrastructureRepository;
  private facilities: Map<string, FacilityTelemetry>;

  private constructor() {
    this.facilities = new Map();
    INITIAL_FACILITIES.forEach(fac => {
      this.facilities.set(fac.id, { ...fac });
    });
    this.loadFromStorage();
  }

  public static getInstance(): InfrastructureRepository {
    if (!InfrastructureRepository.instance) {
      InfrastructureRepository.instance = new InfrastructureRepository();
    }
    return InfrastructureRepository.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('eco_shield_facilities');
      if (stored) {
        const parsed: FacilityTelemetry[] = JSON.parse(stored);
        parsed.forEach(f => this.facilities.set(f.id, f));
      }
    } catch {
      // Storage fallback
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const list = Array.from(this.facilities.values());
      localStorage.setItem('eco_shield_facilities', JSON.stringify(list));
    } catch {
      // Storage fallback
    }
  }

  public getAll(): FacilityTelemetry[] {
    return Array.from(this.facilities.values());
  }

  public getById(id: string): FacilityTelemetry | undefined {
    return this.facilities.get(id);
  }

  public getByLocation(locationId: string): FacilityTelemetry[] {
    return Array.from(this.facilities.values()).filter(f => f.locationId === locationId);
  }

  public updateTelemetry(id: string, updates: Partial<FacilityTelemetry>): FacilityTelemetry | undefined {
    const fac = this.facilities.get(id);
    if (!fac) return undefined;

    const updated: FacilityTelemetry = {
      ...fac,
      ...updates,
      lastTelemetryAt: new Date().toISOString(),
    };

    this.facilities.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  public resetToDefault(): void {
    this.facilities.clear();
    INITIAL_FACILITIES.forEach(fac => {
      this.facilities.set(fac.id, { ...fac });
    });
    this.saveToStorage();
  }
}
