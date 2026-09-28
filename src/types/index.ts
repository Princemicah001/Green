export type EnvironmentalStatus = 'HEALTHY' | 'WATCH' | 'STRESSED' | 'CRITICAL';

export type StressContributor = 'Heat Stress' | 'Water Stress' | 'Energy Demand' | 'Community Signal' | 'Climate Anomaly';

export interface LocationGeo {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  region: string;
  isDemoPrimary?: boolean;
}

export interface EnvironmentalSignals {
  waterStress: number;     // 0 - 100
  energyStress: number;    // 0 - 100
  heatStress: number;      // 0 - 100
  communitySignal: number; // 0 - 100
  climateAnomaly: number;  // 0 - 100
  temperatureC: number;
  rainfallDeviationPct: number; // e.g. -18%
  coolingDemandDeltaPct: number; // e.g. +17%
  communityObservationsCount: number;
}

export interface StressAssessment {
  overallStress: number; // 0 - 100
  status: EnvironmentalStatus;
  confidence: number;    // 0 - 100
  primaryContributors: StressContributor[];
  rateOfChange: 'INCREASING' | 'STABLE' | 'DECREASING';
  calculatedAt: string;
}

export interface LocationTwin extends LocationGeo {
  status: EnvironmentalStatus;
  overallStress: number;
  signals: EnvironmentalSignals;
  assessment: StressAssessment;
  trend90d: number[];
  facilitiesCount: number;
  activeAlertsCount: number;
  lastUpdated: string;
}

export interface FacilityTelemetry {
  id: string;
  name: string;
  code: string;
  locationId: string;
  locationName: string;
  type: 'Cloud Data Centre' | 'Geothermal Compute Hub' | 'Subsea Cable Landing' | 'Hydro Edge Station';
  status: 'OPERATIONAL' | 'OPTIMIZED' | 'STRESSED' | 'DEGRADED';
  computeLoadPct: number;
  powerMW: number;
  waterConsumptionMLDay: number;
  coolingDemandPct: number;
  ambientTempC: number;
  gridStabilityPct: number;
  pue: number; // Power Usage Effectiveness (e.g. 1.18)
  mitigationActive: boolean;
  lastTelemetryAt: string;
}

export type CommunityCategory = 
  | 'WATER'
  | 'ENERGY'
  | 'HEAT'
  | 'FLOODING'
  | 'POLLUTION'
  | 'NOISE'
  | 'OTHER';

export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CommunityReport {
  id: string;
  anonymousId: string; // e.g. "OBS-8492" (never expose personal info)
  locationId: string;
  locationName: string;
  category: CommunityCategory;
  severity: ReportSeverity;
  observation: string;
  timestamp: string;
  approximateLat: number;
  approximateLng: number;
  verificationStatus: 'RECEIVED' | 'VALIDATED' | 'CROSS_REFERENCED';
  confidenceScore: number; // e.g. 84%
}

export type AlertSeverity = 'INFO' | 'HIGH' | 'CRITICAL';

export interface SentinelAlert {
  id: string;
  timestamp: string;
  timeFormatted: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  locationId: string;
  locationName: string;
  category: 'WATER' | 'HEAT' | 'ENERGY' | 'COMMUNITY' | 'INFRASTRUCTURE';
  acknowledged?: boolean;
}

export interface HistoricalObservation {
  id: string;
  timestamp: string;
  month: string;
  dateStr: string;
  waterStress: number;
  energyStress: number;
  heatStress: number;
  communitySignal: number;
  overallStress: number;
  status: EnvironmentalStatus;
  temperatureC: number;
  rainfallDeviationPct: number;
  coolingDemandDeltaPct: number;
}

export interface MitigationPlan {
  id: string;
  locationId: string;
  facilityId: string;
  recommendedActions: string[];
  before: {
    waterConsumptionMLDay: number;
    powerMW: number;
    coolingDemandPct: number;
    overallStress: number;
  };
  after: {
    waterConsumptionMLDay: number;
    powerMW: number;
    coolingDemandPct: number;
    overallStress: number;
  };
  waterSavingsPct: number;
  coolingReductionPct: number;
  stressReductionPoints: number;
  isSimulated: true;
  appliedAt?: string;
}

export interface GreenFinanceProfile {
  locationId: string;
  locationName: string;
  resourceEfficiencyScore: number; // 0 - 100
  environmentalTrendRating: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  verifiedObservationsCount: number;
  esgAuditabilityScore: number;    // 0 - 100
  waterRiskIndex: number;          // 0 - 100 (lower is better)
  carbonIntensityGPerKwh: number;
  eligibleInstruments: string[];
  lastAuditDate: string;
}

export interface SystemStatusState {
  dataIngestion: 'OPERATIONAL' | 'DEGRADED';
  climatePipeline: 'OPERATIONAL' | 'DEGRADED';
  communityPipeline: 'OPERATIONAL' | 'DEGRADED';
  intelligenceEngine: 'OPERATIONAL' | 'DEGRADED';
  infrastructureTelemetry: 'OPERATIONAL' | 'DEGRADED';
  lastHeartbeat: string;
  environmentMode: 'DEMO ENVIRONMENT';
}
