import { NextRequest, NextResponse } from 'next/server';
import { ClaimRepository } from '@/lib/repositories/claimRepository';
import { PointsRepository } from '@/lib/repositories/pointsRepository';
import { ClaimProvider } from '@/lib/providers/claimProvider';
import { GIFT_CATALOG } from '@/data/gifts';

export async function GET() {
  const pointsRepo = PointsRepository.getInstance();
  return NextResponse.json({
    status: 'success',
    wallet: pointsRepo.getWallet(),
  });
}

/**
 * POST /api/points
 * Body: { ticketNumber } — earn points for a verified claim (USSD parity).
 * Body: { giftId }       — redeem a gift against the wallet balance.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pointsRepo = PointsRepository.getInstance();
    const provider = ClaimProvider.getInstance();

    // ── Earn via ticket number ─────────────────────────────────
    if (body.ticketNumber) {
      const repo = ClaimRepository.getInstance();
      const claim = provider.findClaimByRef(repo.getAll(), body.ticketNumber);

      if (!claim) {
        return NextResponse.json({ status: 'error', message: 'Ticket number not found.' }, { status: 404 });
      }
      if (claim.status === 'REWARDED') {
        return NextResponse.json({ status: 'error', message: 'This ticket was already rewarded.' }, { status: 409 });
      }
      if (claim.status !== 'VERIFIED') {
        return NextResponse.json(
          { status: 'error', message: `Report is not verified yet (status: ${claim.status}).` },
          { status: 409 }
        );
      }

      const points = provider.computePoints(claim.urgency, claim.evidence.length);
      const txn = pointsRepo.earn(points, claim.ticketNumber, `Verified claim: ${claim.title}`);
      repo.updateStatus(claim.id, 'REWARDED', points);

      return NextResponse.json({
        status: 'success',
        message: `+${points} GreenPoints added to your wallet.`,
        transaction: txn,
        balance: pointsRepo.getWallet().balance,
      }, { status: 201 });
    }

    // ── Redeem a gift ──────────────────────────────────────────
    if (body.giftId) {
      const gift = GIFT_CATALOG.find(g => g.id === body.giftId);
      if (!gift) {
        return NextResponse.json({ status: 'error', message: 'Gift not found in catalog.' }, { status: 404 });
      }
      const txn = pointsRepo.redeem(gift.costPoints, gift.id, `Redeemed: ${gift.name}`);
      if (!txn) {
        const balance = pointsRepo.getWallet().balance;
        return NextResponse.json(
          { status: 'error', message: `Not enough points. ${gift.name} costs ${gift.costPoints}; balance is ${balance}.` },
          { status: 409 }
        );
      }
      return NextResponse.json({
        status: 'success',
        message: `Redeemed ${gift.name}. Voucher: GR-${gift.id.toUpperCase().slice(0, 4)}-XXXX`,
        transaction: txn,
        balance: pointsRepo.getWallet().balance,
      }, { status: 201 });
    }

    return NextResponse.json(
      { status: 'error', message: 'Provide either ticketNumber (earn) or giftId (redeem).' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', message: 'Internal processing failure', detail: message },
      { status: 500 }
    );
  }
}
