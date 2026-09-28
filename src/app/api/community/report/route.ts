import { NextRequest, NextResponse } from 'next/server';
import { CommunityProvider, SubmitReportInput } from '@/lib/providers/communityProvider';
import { LocationRepository } from '@/lib/repositories/locationRepository';
import { AlertRepository } from '@/lib/repositories/alertRepository';
import { evaluateAlertRules } from '@/lib/intelligence/alertEngine';

export async function POST(request: NextRequest) {
  try {
    const body: SubmitReportInput = await request.json();

    if (!body.locationId || !body.category || !body.severity || !body.observation) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields: locationId, category, severity, observation' },
        { status: 400 }
      );
    }

    const provider = CommunityProvider.getInstance();
    const newReport = await provider.submitReport(body);

    // Cascade update to location repository
    const locRepo = LocationRepository.getInstance();
    const loc = locRepo.getById(body.locationId);
    if (loc) {
      const signalDelta = body.severity === 'CRITICAL' ? 6 : (body.severity === 'HIGH' ? 4 : 2);
      const updated = locRepo.updateSignals(body.locationId, {
        communitySignal: Math.min(98, loc.signals.communitySignal + signalDelta),
        communityObservationsCount: loc.signals.communityObservationsCount + 1,
      });

      if (updated) {
        const alertRepo = AlertRepository.getInstance();
        const alerts = evaluateAlertRules(body.locationId, body.locationName, updated.signals, loc.signals);
        alerts.forEach(a => alertRepo.addAlert(a));
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Community observation verified, sanitized, and ingested into Sentinel Intelligence Engine.',
      report: newReport,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', message: 'Internal processing failure', detail: message },
      { status: 500 }
    );
  }
}
