import { NextRequest, NextResponse } from 'next/server';
import { ClaimRepository } from '@/lib/repositories/claimRepository';
import { ClaimProvider, SubmitClaimInput } from '@/lib/providers/claimProvider';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const ref = searchParams.get('ref');

  const repo = ClaimRepository.getInstance();

  if (ref) {
    const claim = provider_find(repo, ref);
    if (!claim) {
      return NextResponse.json({ status: 'error', message: 'No claim matches that tracking or ticket number.' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', data: claim });
  }

  let claims = repo.getAll();
  if (status) claims = claims.filter(c => c.status === status);

  return NextResponse.json({
    status: 'success',
    count: claims.length,
    data: claims,
  });
}

function provider_find(repo: ClaimRepository, ref: string) {
  const provider = ClaimProvider.getInstance();
  const byRef = provider.findClaimByRef(repo.getAll(), ref);
  return byRef ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubmitClaimInput = await request.json();
    if (!body.locationId || !body.title || !body.details || !body.category) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields: locationId, title, details, category' },
        { status: 400 }
      );
    }

    const provider = ClaimProvider.getInstance();
    const repo = ClaimRepository.getInstance();
    const evidence = (body.evidence || []).map((ev, i) => ({ ...ev, id: `ev-${Date.now()}-${i}` }));

    const newClaim = {
      id: `claim-${Date.now()}`,
      trackingNumber: provider.generateTrackingNumber(),
      ticketNumber: provider.generateTicketNumber(),
      locationId: body.locationId,
      locationName: body.locationName || body.locationId,
      title: body.title,
      details: body.details,
      category: body.category,
      urgency: body.urgency || 'MEDIUM',
      evidence,
      status: 'SUBMITTED' as const,
      submittedAt: new Date().toISOString(),
      controllerActionLog: [
        { id: `ca-${Date.now()}`, action: 'RECEIVED' as const, at: new Date().toISOString() },
      ],
    };

    repo.addClaim(newClaim);

    return NextResponse.json({
      status: 'success',
      message: 'Claim received. Keep the tracking number to follow progress.',
      claim: { trackingNumber: newClaim.trackingNumber, ticketNumber: newClaim.ticketNumber, status: newClaim.status },
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', message: 'Internal processing failure', detail: message },
      { status: 500 }
    );
  }
}
