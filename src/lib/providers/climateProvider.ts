/**
 * Climate Provider Adapter
 * 
 * Abstraction layer for upstream climate APIs (e.g., ECMWF ERA5, Copernicus, NOAA GFS).
 * In production, connects via authenticated HTTP client.
 * In demonstration mode, delivers standardized normalized climate telemetry.
 */

export interface ClimateTelemetryData {
  locationId: string;
  surfaceTemperatureC: number;
  temperatureAnomalyC: number;
  precipitationDeficitPct: number;
  soilMoistureDeficitPct: number;
  droughtSeverityIndex: number; // 0 - 100
  windSpeedKmh: number;
  solarIrradianceWm2: number;
  timestamp: string;
  source: string;
}

export class ClimateProvider {
  private static instance: ClimateProvider;

  public static getInstance(): ClimateProvider {
    if (!ClimateProvider.instance) {
      ClimateProvider.instance = new ClimateProvider();
    }
    return ClimateProvider.instance;
  }

  public async fetchRegionalClimate(locationId: string): Promise<ClimateTelemetryData> {
    // In production: fetch from ECMWF CDS / NOAA API
    const isNairobi = locationId === 'nairobi';
    return {
      locationId,
      surfaceTemperatureC: isNairobi ? 31.4 : 28.5,
      temperatureAnomalyC: isNairobi ? 3.9 : 1.2,
      precipitationDeficitPct: isNairobi ? -18 : -4,
      soilMoistureDeficitPct: isNairobi ? -22 : -6,
      droughtSeverityIndex: isNairobi ? 64 : 32,
      windSpeedKmh: 14.2,
      solarIrradianceWm2: 840,
      timestamp: new Date().toISOString(),
      source: 'ERA5-Reanalysis / Sentinel-3 SLSTR (Simulated Adapter)',
    };
  }
}
