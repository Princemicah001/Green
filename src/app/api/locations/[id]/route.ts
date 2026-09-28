import { NextRequest, NextResponse } from 'next/server';
import { LocationRepository } from '@/lib/repositories/locationRepository';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const repo = LocationRepository.getInstance();
  const location = repo.getById(params.id);

  if (!location) {
    return NextResponse.json(
      { status: 'error', message: `Location with ID '${params.id}' not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: 'success',
    environmentMode: 'DEMO ENVIRONMENT',
    data: location,
  });
}
