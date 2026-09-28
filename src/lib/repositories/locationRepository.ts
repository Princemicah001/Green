import { LocationTwin, EnvironmentalSignals } from '@/types';
import { INITIAL_LOCATIONS } from '@/data/locations';
import { calculateEnvironmentalStress } from '@/lib/intelligence/stressEngine';

/**
 * Location Repository
 * 
 * Manages environmental digital twins, updates stress assessments in real time,
 * and synchronizes with local persistence.
 */
export class LocationRepository {
  private static instance: LocationRepository;
  private locations: Map<string, LocationTwin>;

  private constructor() {
    this.locations = new Map();
    // Initialize with demo locations
    INITIAL_LOCATIONS.forEach(loc => {
      this.locations.set(loc.id, { ...loc });
    });
    this.loadFromStorage();
  }

  public static getInstance(): LocationRepository {
    if (!LocationRepository.instance) {
      LocationRepository.instance = new LocationRepository();
    }
    return LocationRepository.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('eco_shield_locations');
      if (stored) {
        const parsed: LocationTwin[] = JSON.parse(stored);
        parsed.forEach(loc => this.locations.set(loc.id, loc));
      }
    } catch {
      // LocalStorage unavailable, fallback to memory
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const list = Array.from(this.locations.values());
      localStorage.setItem('eco_shield_locations', JSON.stringify(list));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  public getAll(): LocationTwin[] {
    return Array.from(this.locations.values());
  }

  public getById(id: string): LocationTwin | undefined {
    return this.locations.get(id);
  }

  public getPrimaryDemoLocation(): LocationTwin {
    return this.locations.get('nairobi') || Array.from(this.locations.values())[0];
  }

  public updateSignals(id: string, updates: Partial<EnvironmentalSignals>): LocationTwin | undefined {
    const loc = this.locations.get(id);
    if (!loc) return undefined;

    const mergedSignals: EnvironmentalSignals = {
      ...loc.signals,
      ...updates,
    };

    const newAssessment = calculateEnvironmentalStress(mergedSignals, undefined, loc.trend90d);

    const updated: LocationTwin = {
      ...loc,
      signals: mergedSignals,
      overallStress: newAssessment.overallStress,
      status: newAssessment.status,
      assessment: newAssessment,
      lastUpdated: new Date().toISOString(),
    };

    this.locations.set(id, updated);
    this.saveToStorage();
    return updated;
  }

  public resetToDefault(): void {
    this.locations.clear();
    INITIAL_LOCATIONS.forEach(loc => {
      this.locations.set(loc.id, { ...loc });
    });
    this.saveToStorage();
  }
}
