import { NextRequest, NextResponse } from 'next/server';
import { AlertRepository } from '@/lib/repositories/alertRepository';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('locationId');

  const repo = AlertRepository.getInstance();
  const alerts = locationId ? repo.getByLocation(locationId) : repo.getAll();

  return NextResponse.json({
    status: 'success',
    count: alerts.length,
    environmentMode: 'DEMO ENVIRONMENT',
    data: alerts,
  });
}
