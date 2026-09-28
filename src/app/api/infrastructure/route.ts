import { NextRequest, NextResponse } from 'next/server';
import { InfrastructureRepository } from '@/lib/repositories/infrastructureRepository';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('locationId');

  const repo = InfrastructureRepository.getInstance();
  const facilities = locationId ? repo.getByLocation(locationId) : repo.getAll();

  return NextResponse.json({
    status: 'success',
    count: facilities.length,
    environmentMode: 'DEMO ENVIRONMENT',
    data: facilities,
  });
}
