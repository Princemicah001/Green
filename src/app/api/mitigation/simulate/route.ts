import { NextRequest, NextResponse } from 'next/server';
import { InfrastructureRepository } from '@/lib/repositories/infrastructureRepository';
import { LocationRepository } from '@/lib/repositories/locationRepository';
import { generateMitigationPlan } from '@/lib/intelligence/mitigationEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { facilityId } = body;

    const infraRepo = InfrastructureRepository.getInstance();
    const locRepo = LocationRepository.getInstance();

    const facility = facilityId ? infraRepo.getById(facilityId) : infraRepo.getAll()[0];
    if (!facility) {
      return NextResponse.json(
        { status: 'error', message: 'No facility found to simulate mitigation' },
        { status: 404 }
      );
    }

    const location = locRepo.getById(facility.locationId) || locRepo.getPrimaryDemoLocation();
    const plan = generateMitigationPlan(facility, location.overallStress);

    return NextResponse.json({
      status: 'success',
      simulationNotice: 'SIMULATION ONLY: No physical infrastructure actuations dispatched without operational operator signing.',
      plan,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', message: 'Mitigation simulation failed', detail: message },
      { status: 500 }
    );
  }
}
