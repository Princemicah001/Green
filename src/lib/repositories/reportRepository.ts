import { CommunityReport } from '@/types';
import { INITIAL_COMMUNITY_REPORTS } from '@/data/communityReports';

export class ReportRepository {
  private static instance: ReportRepository;
  private reports: CommunityReport[];

  private constructor() {
    this.reports = [...INITIAL_COMMUNITY_REPORTS];
    this.loadFromStorage();
  }

  public static getInstance(): ReportRepository {
    if (!ReportRepository.instance) {
      ReportRepository.instance = new ReportRepository();
    }
    return ReportRepository.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('eco_shield_reports');
      if (stored) {
        this.reports = JSON.parse(stored);
      }
    } catch {
      // Storage fallback
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('eco_shield_reports', JSON.stringify(this.reports));
    } catch {
      // Storage fallback
    }
  }

  public getAll(): CommunityReport[] {
    return [...this.reports];
  }

  public getByLocation(locationId: string): CommunityReport[] {
    return this.reports.filter(r => r.locationId === locationId);
  }

  public addReport(report: CommunityReport): void {
    this.reports.unshift(report);
    this.saveToStorage();
  }

  public resetToDefault(): void {
    this.reports = [...INITIAL_COMMUNITY_REPORTS];
    this.saveToStorage();
  }
}
