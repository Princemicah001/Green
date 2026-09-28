import { NextRequest, NextResponse } from 'next/server';
import { ClimateProvider } from '@/lib/providers/climateProvider';
import { SatelliteProvider } from '@/lib/providers/satelliteProvider';
import { LocationRepository } from '@/lib/repositories/locationRepository';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('locationId') || 'nairobi';

  const locRepo = LocationRepository.getInstance();
  const location = locRepo.getById(locationId);

  const climateProvider = ClimateProvider.getInstance();
  const satelliteProvider = SatelliteProvider.getInstance();

  const [climate, satellite] = await Promise.all([
    climateProvider.fetchRegionalClimate(locationId),
    satelliteProvider.getObservation(locationId),
  ]);

  return NextResponse.json({
    status: 'success',
    locationId,
    locationName: location?.name || locationId,
    environmentMode: 'DEMO ENVIRONMENT',
    signals: location?.signals,
    assessment: location?.assessment,
    telemetry: {
      climate,
      satellite,
    },
  });
}
