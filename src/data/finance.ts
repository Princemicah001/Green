import { GreenFinanceProfile } from '@/types';

export const GREEN_FINANCE_PROFILES: Record<string, GreenFinanceProfile> = {
  nairobi: {
    locationId: 'nairobi',
    locationName: 'Nairobi Metropolitan & Rift Infrastructure Basin',
    resourceEfficiencyScore: 78,
    environmentalTrendRating: 'B+',
    verifiedObservationsCount: 143,
    esgAuditabilityScore: 94,
    waterRiskIndex: 68,
    carbonIntensityGPerKwh: 142, // Clean geothermal mix
    eligibleInstruments: [
      'Sustainability-Linked Infrastructure Loan (SLIL)',
      'Water Resilience Resilience Bond (WRB)',
      'IFC Performance Standard 6 Compliant Facility',
      'Parametric Heat-Index Contingent Credit',
    ],
    lastAuditDate: '2026-08-15',
  },
  mombasa: {
    locationId: 'mombasa',
    locationName: 'Mombasa Coastal & Subsea Hub',
    resourceEfficiencyScore: 89,
    environmentalTrendRating: 'A',
    verifiedObservationsCount: 28,
    esgAuditabilityScore: 96,
    waterRiskIndex: 32,
    carbonIntensityGPerKwh: 168,
    eligibleInstruments: [
      'Blue Economy Coastal Resilience Facility',
      'Green Data Center Transition Bond',
    ],
    lastAuditDate: '2026-09-01',
  },
  lodwar: {
    locationId: 'lodwar',
    locationName: 'Lodwar / Turkwel Basin',
    resourceEfficiencyScore: 54,
    environmentalTrendRating: 'C',
    verifiedObservationsCount: 89,
    esgAuditabilityScore: 91,
    waterRiskIndex: 92,
    carbonIntensityGPerKwh: 95,
    eligibleInstruments: [
      'Multilateral Climate Adaptation Grant',
      'Arid Zone Aquifer Protection Facility',
    ],
    lastAuditDate: '2026-07-20',
  },
};
