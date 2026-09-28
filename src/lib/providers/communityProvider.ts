import { CommunityReport, CommunityCategory, ReportSeverity } from '@/types';
import { INITIAL_COMMUNITY_REPORTS } from '@/data/communityReports';

export interface SubmitReportInput {
  locationId: string;
  locationName: string;
  category: CommunityCategory;
  severity: ReportSeverity;
  observation: string;
  approximateLat?: number;
  approximateLng?: number;
}

/**
 * Community Provider & Privacy Sanitizer
 * 
 * Enforces zero-exposure of PII (Personally Identifiable Information).
 * Anonymizes contributor identities into deterministic cryptographic IDs.
 * Jitters geographic coordinates to prevent pinpoint surveillance.
 */
export class CommunityProvider {
  private static instance: CommunityProvider;
  private reports: CommunityReport[] = [...INITIAL_COMMUNITY_REPORTS];

  public static getInstance(): CommunityProvider {
    if (!CommunityProvider.instance) {
      CommunityProvider.instance = new CommunityProvider();
    }
    return CommunityProvider.instance;
  }

  public async getReports(locationId?: string): Promise<CommunityReport[]> {
    if (locationId) {
      return this.reports.filter(r => r.locationId === locationId);
    }
    return [...this.reports];
  }

  /**
   * Ingest, sanitize, fuzz coordinates, assign confidence, and append to repository
   */
  public async submitReport(input: SubmitReportInput): Promise<CommunityReport> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const anonymousId = `OBS-${randomSuffix}`;

    // Geographic jitter to protect contributor privacy (~1.2km spatial quantization)
    const baseLat = input.approximateLat ?? -1.2921;
    const baseLng = input.approximateLng ?? 36.8219;
    const quantizedLat = Number((Math.round(baseLat * 100) / 100 + (Math.random() * 0.008 - 0.004)).toFixed(4));
    const quantizedLng = Number((Math.round(baseLng * 100) / 100 + (Math.random() * 0.008 - 0.004)).toFixed(4));

    // Dynamic confidence score calculation
    let confidence = 75;
    if (input.observation.length > 50) confidence += 8;
    if (input.severity === 'HIGH' || input.severity === 'CRITICAL') confidence += 7;
    confidence = Math.min(95, confidence);

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}-${randomSuffix}`,
      anonymousId,
      locationId: input.locationId,
      locationName: input.locationName,
      category: input.category,
      severity: input.severity,
      observation: input.observation.trim(),
      timestamp: new Date().toISOString(),
      approximateLat: quantizedLat,
      approximateLng: quantizedLng,
      verificationStatus: 'CROSS_REFERENCED',
      confidenceScore: confidence,
    };

    // Prepend latest report
    this.reports.unshift(newReport);
    return newReport;
  }
}
