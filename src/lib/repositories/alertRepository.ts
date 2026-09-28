import { SentinelAlert } from '@/types';
import { INITIAL_ALERTS } from '@/data/alerts';

export class AlertRepository {
  private static instance: AlertRepository;
  private alerts: SentinelAlert[];

  private constructor() {
    this.alerts = [...INITIAL_ALERTS];
    this.loadFromStorage();
  }

  public static getInstance(): AlertRepository {
    if (!AlertRepository.instance) {
      AlertRepository.instance = new AlertRepository();
    }
    return AlertRepository.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('eco_shield_alerts');
      if (stored) {
        this.alerts = JSON.parse(stored);
      }
    } catch {
      // Storage fallback
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('eco_shield_alerts', JSON.stringify(this.alerts));
    } catch {
      // Storage fallback
    }
  }

  public getAll(): SentinelAlert[] {
    return [...this.alerts];
  }

  public getByLocation(locationId: string): SentinelAlert[] {
    return this.alerts.filter(a => a.locationId === locationId);
  }

  public addAlert(alert: SentinelAlert): void {
    // Avoid exact duplicate titles within same hour
    const exists = this.alerts.some(a => a.title === alert.title && a.locationId === alert.locationId);
    if (!exists) {
      this.alerts.unshift(alert);
      this.saveToStorage();
    }
  }

  public acknowledgeAlert(id: string): void {
    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.alerts[idx].acknowledged = true;
      this.saveToStorage();
    }
  }

  public resetToDefault(): void {
    this.alerts = [...INITIAL_ALERTS];
    this.saveToStorage();
  }
}
