import { NextRequest, NextResponse } from 'next/server';
import { HistoryRepository } from '@/lib/repositories/historyRepository';
import { LocationRepository } from '@/lib/repositories/locationRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const historyRepo = HistoryRepository.getInstance();
  const locRepo = LocationRepository.getInstance();
  const location = locRepo.getById(params.id);

  const baseStress = location?.overallStress ?? 68;
  const trend = location?.assessment.rateOfChange ?? 'INCREASING';

  const timeMachineSteps = historyRepo.getTimeMachineSteps(params.id);
  const series90d = historyRepo.getSeriesForLocation(params.id, baseStress, trend);

  return NextResponse.json({
    status: 'success',
    locationId: params.id,
    locationName: location?.name || params.id,
    environmentMode: 'DEMO ENVIRONMENT',
    timeMachineSteps,
    series90d,
  });
}
