'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  LocationTwin, 
  FacilityTelemetry, 
  CommunityReport, 
  SentinelAlert, 
  MitigationPlan,
  SystemStatusState,
  EnvironmentalSignals
} from '@/types';
import { LocationRepository } from '@/lib/repositories/locationRepository';
import { ReportRepository } from '@/lib/repositories/reportRepository';
import { InfrastructureRepository } from '@/lib/repositories/infrastructureRepository';
import { AlertRepository } from '@/lib/repositories/alertRepository';
import { generateMitigationPlan } from '@/lib/intelligence/mitigationEngine';
import { evaluateAlertRules } from '@/lib/intelligence/alertEngine';
import { TelemetrySimulator } from '@/lib/simulation/telemetrySimulator';
import { SubmitReportInput } from '@/lib/providers/communityProvider';

interface SentinelContextType {
  selectedLocationId: string;
  selectedLocation: LocationTwin;
  locations: LocationTwin[];
  facilities: FacilityTelemetry[];
  locationFacilities: FacilityTelemetry[];
  communityReports: CommunityReport[];
  locationReports: CommunityReport[];
  alerts: SentinelAlert[];
  locationAlerts: SentinelAlert[];
  mitigationPlan: MitigationPlan | null;
  systemStatus: SystemStatusState;
  
  // Actions
  setSelectedLocationId: (id: string) => void;
  submitCommunityReport: (input: SubmitReportInput) => Promise<CommunityReport>;
  triggerHeatSpike: (locationId?: string) => void;
  simulateMitigationResponse: (facilityId: string) => MitigationPlan;
  acknowledgeAlert: (alertId: string) => void;
  resetAllDemoData: () => void;
  
  // Theme & Layout
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Demonstration Scenario
  demoStep: number; // 0: Initial, 1: Community surge, 2: Heat spike (Critical), 3: Mitigated
  runNextDemoStep: () => void;
  resetDemoScenario: () => void;
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

export function SentinelProvider({ children }: { children: ReactNode }) {
  const locRepo = LocationRepository.getInstance();
  const repRepo = ReportRepository.getInstance();
  const infraRepo = InfrastructureRepository.getInstance();
  const alertRepo = AlertRepository.getInstance();

  const [selectedLocationId, setSelectedLocationId] = useState<string>('nairobi');
  const [locations, setLocations] = useState<LocationTwin[]>([]);
  const [facilities, setFacilities] = useState<FacilityTelemetry[]>([]);
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([]);
  const [alerts, setAlerts] = useState<SentinelAlert[]>([]);
  const [mitigationPlan, setMitigationPlan] = useState<MitigationPlan | null>(null);
  const [demoStep, setDemoStep] = useState<number>(0);

  const [systemStatus] = useState<SystemStatusState>({
    dataIngestion: 'OPERATIONAL',
    climatePipeline: 'OPERATIONAL',
    communityPipeline: 'OPERATIONAL',
    intelligenceEngine: 'OPERATIONAL',
    infrastructureTelemetry: 'OPERATIONAL',
    lastHeartbeat: new Date().toISOString(),
    environmentMode: 'DEMO ENVIRONMENT',
  });

  // Theme state: defaults to 'light' for clean Apple aesthetic
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('eco_shield_theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {
        // Fallback
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  // Sync state from repositories & theme on mount
  useEffect(() => {
    setLocations(locRepo.getAll());
    setFacilities(infraRepo.getAll());
    setCommunityReports(repRepo.getAll());
    setAlerts(alertRepo.getAll());

    if (typeof window !== 'undefined') {
      try {
        const storedTheme = localStorage.getItem('eco_shield_theme') as 'light' | 'dark' | null;
        const initialTheme = storedTheme || 'light';
        setThemeState(initialTheme);
        if (initialTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {
        // Fallback
      }
    }
  }, []);

  const selectedLocation = locations.find(l => l.id === selectedLocationId) || locations[0] || locRepo.getPrimaryDemoLocation();
  const locationFacilities = facilities.filter(f => f.locationId === selectedLocationId);
  const locationReports = communityReports.filter(r => r.locationId === selectedLocationId);
  const locationAlerts = alerts.filter(a => a.locationId === selectedLocationId);

  // Subtle continuous ambient flutter
  useEffect(() => {
    const interval = setInterval(() => {
      setLocations(prevLocations => {
        return prevLocations.map(loc => {
          if (loc.id !== selectedLocationId) return loc;
          const jitteredSignals = TelemetrySimulator.simulateAmbientFlutter(loc.signals);
          const updated = locRepo.updateSignals(loc.id, jitteredSignals);
          return updated || loc;
        });
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [selectedLocationId]);

  // Submit Community Report: triggers full cascade
  const submitCommunityReport = useCallback(async (input: SubmitReportInput): Promise<CommunityReport> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReport: CommunityReport = {
      id: `rep-${Date.now()}-${randomSuffix}`,
      anonymousId: `OBS-${randomSuffix}`,
      locationId: input.locationId,
      locationName: input.locationName,
      category: input.category,
      severity: input.severity,
      observation: input.observation.trim(),
      timestamp: new Date().toISOString(),
      approximateLat: input.approximateLat ?? selectedLocation.latitude,
      approximateLng: input.approximateLng ?? selectedLocation.longitude,
      verificationStatus: 'CROSS_REFERENCED',
      confidenceScore: input.severity === 'CRITICAL' ? 95 : 88,
    };

    repRepo.addReport(newReport);
    setCommunityReports(repRepo.getAll());

    // Cascade: Increase community signal and recalculate stress
    const currentLoc = locRepo.getById(input.locationId);
    if (currentLoc) {
      const signalDelta = input.severity === 'CRITICAL' ? 6 : (input.severity === 'HIGH' ? 4 : 2);
      const newCommunitySignal = Math.min(98, currentLoc.signals.communitySignal + signalDelta);
      const newObsCount = currentLoc.signals.communityObservationsCount + 1;

      const updated = locRepo.updateSignals(input.locationId, {
        communitySignal: newCommunitySignal,
        communityObservationsCount: newObsCount,
      });

      if (updated) {
        setLocations(locRepo.getAll());

        // Check if alerts should fire
        const newAlerts = evaluateAlertRules(input.locationId, input.locationName, updated.signals, currentLoc.signals);
        newAlerts.forEach(a => alertRepo.addAlert(a));
        setAlerts(alertRepo.getAll());
      }
    }

    return newReport;
  }, [selectedLocation]);

  // Trigger Heat Spike
  const triggerHeatSpike = useCallback((targetLocationId?: string) => {
    const locId = targetLocationId || selectedLocationId;
    const loc = locRepo.getById(locId);
    if (!loc) return;

    const previousSignals = { ...loc.signals };
    const spikedSignals = TelemetrySimulator.applyHeatSpike(loc.signals);
    const updated = locRepo.updateSignals(locId, spikedSignals);

    if (updated) {
      setLocations(locRepo.getAll());

      // Update connected facility cooling demand
      const facs = infraRepo.getByLocation(locId);
      facs.forEach(fac => {
        const elevatedCooling = Math.min(96, fac.coolingDemandPct + 14);
        infraRepo.updateTelemetry(fac.id, {
          coolingDemandPct: elevatedCooling,
          ambientTempC: spikedSignals.temperatureC,
        });
      });
      setFacilities(infraRepo.getAll());

      // Evaluate new alerts
      const generatedAlerts = evaluateAlertRules(locId, loc.name, updated.signals, previousSignals);
      generatedAlerts.forEach(a => alertRepo.addAlert(a));
      setAlerts(alertRepo.getAll());
    }
  }, [selectedLocationId]);

  // Simulate Mitigation Response
  const simulateMitigationResponse = useCallback((facilityId: string): MitigationPlan => {
    const facility = infraRepo.getById(facilityId) || facilities[0];
    const loc = locRepo.getById(facility.locationId) || selectedLocation;

    const plan = generateMitigationPlan(facility, loc.overallStress);
    setMitigationPlan(plan);

    // Apply simulated adjustments to facility
    infraRepo.updateTelemetry(facility.id, {
      waterConsumptionMLDay: plan.after.waterConsumptionMLDay,
      powerMW: plan.after.powerMW,
      coolingDemandPct: plan.after.coolingDemandPct,
      mitigationActive: true,
    });
    setFacilities(infraRepo.getAll());

    // Relieve regional stress
    const relievedSignals: Partial<EnvironmentalSignals> = {
      waterStress: Math.max(30, loc.signals.waterStress - 12),
      energyStress: Math.max(30, loc.signals.energyStress - 8),
      coolingDemandDeltaPct: Math.max(2, loc.signals.coolingDemandDeltaPct - 14),
    };
    locRepo.updateSignals(loc.id, relievedSignals);
    setLocations(locRepo.getAll());

    return plan;
  }, [facilities, selectedLocation]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    alertRepo.acknowledgeAlert(alertId);
    setAlerts(alertRepo.getAll());
  }, []);

  const resetAllDemoData = useCallback(() => {
    locRepo.resetToDefault();
    repRepo.resetToDefault();
    infraRepo.resetToDefault();
    alertRepo.resetToDefault();
    setLocations(locRepo.getAll());
    setFacilities(infraRepo.getAll());
    setCommunityReports(repRepo.getAll());
    setAlerts(alertRepo.getAll());
    setMitigationPlan(null);
    setDemoStep(0);
    setSelectedLocationId('nairobi');
  }, []);

  // Guided Demonstration Scenario Runner (Section 45)
  const runNextDemoStep = useCallback(() => {
    if (demoStep === 0) {
      // Step 1: Community surge (Community signal 66 -> 74)
      setSelectedLocationId('nairobi');
      const loc = locRepo.getById('nairobi');
      if (loc) {
        const surgedSignals = TelemetrySimulator.applyCommunityWaterSurge(loc.signals);
        locRepo.updateSignals('nairobi', surgedSignals);
        setLocations(locRepo.getAll());

        // Add verified community report
        const rep: CommunityReport = {
          id: `rep-demo-${Date.now()}`,
          anonymousId: 'OBS-9104',
          locationId: 'nairobi',
          locationName: 'Nairobi (Industrial Corridor)',
          category: 'WATER',
          severity: 'HIGH',
          observation: 'Municipal borehole water pressure dropped significantly across commercial zone. Cooling intake tanks at 40% capacity.',
          timestamp: new Date().toISOString(),
          approximateLat: -1.3020,
          approximateLng: 36.8480,
          verificationStatus: 'CROSS_REFERENCED',
          confidenceScore: 94,
        };
        repRepo.addReport(rep);
        setCommunityReports(repRepo.getAll());
      }
      setDemoStep(1);
    } else if (demoStep === 1) {
      // Step 2: Environmental Heat Spike (Heat 79 -> 84, Overall stress 68 -> 78, Status -> CRITICAL)
      setSelectedLocationId('nairobi');
      triggerHeatSpike('nairobi');
      setDemoStep(2);
    } else if (demoStep === 2) {
      // Step 3: Mitigation simulation (Simulate Response: Water -18%, Cooling -14%, Stress 78 -> 65)
      const primaryFacility = facilities.find(f => f.locationId === 'nairobi') || facilities[0];
      if (primaryFacility) {
        simulateMitigationResponse(primaryFacility.id);
      }
      setDemoStep(3);
    } else {
      // Loop or reset
      resetAllDemoData();
    }
  }, [demoStep, facilities, triggerHeatSpike, simulateMitigationResponse, resetAllDemoData]);

  const resetDemoScenario = useCallback(() => {
    resetAllDemoData();
  }, [resetAllDemoData]);

  return (
    <SentinelContext.Provider
      value={{
        selectedLocationId,
        selectedLocation,
        locations,
        facilities,
        locationFacilities,
        communityReports,
        locationReports,
        alerts,
        locationAlerts,
        mitigationPlan,
        systemStatus,
        setSelectedLocationId,
        submitCommunityReport,
        triggerHeatSpike,
        simulateMitigationResponse,
        acknowledgeAlert,
        resetAllDemoData,
        theme,
        setTheme,
        toggleTheme,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        demoStep,
        runNextDemoStep,
        resetDemoScenario,
      }}
    >
      {children}
    </SentinelContext.Provider>
  );
}

export function useSentinel() {
  const context = useContext(SentinelContext);
  if (!context) {
    throw new Error('useSentinel must be used within a SentinelProvider');
  }
  return context;
}
