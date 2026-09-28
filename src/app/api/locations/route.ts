import { NextResponse } from 'next/server';
import { LocationRepository } from '@/lib/repositories/locationRepository';

export async function GET() {
  const repo = LocationRepository.getInstance();
  const locations = repo.getAll();
  return NextResponse.json({
    status: 'success',
    count: locations.length,
    environmentMode: 'DEMO ENVIRONMENT',
    data: locations,
  });
}
