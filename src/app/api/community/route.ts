import { NextRequest, NextResponse } from 'next/server';
import { ReportRepository } from '@/lib/repositories/reportRepository';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('locationId');

  const repo = ReportRepository.getInstance();
  const reports = locationId ? repo.getByLocation(locationId) : repo.getAll();

  return NextResponse.json({
    status: 'success',
    count: reports.length,
    environmentMode: 'DEMO ENVIRONMENT',
    privacyStandard: 'PII-Sanitized / Cryptographic Anonymous Identifiers',
    data: reports,
  });
}
