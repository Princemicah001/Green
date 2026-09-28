import { NextRequest, NextResponse } from 'next/server';
import { calculateEnvironmentalStress, StressWeights, DEFAULT_WEIGHTS } from '@/lib/intelligence/stressEngine';
import { EnvironmentalSignals } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signals: EnvironmentalSignals = body.signals;
    const weights: StressWeights = body.weights || DEFAULT_WEIGHTS;

    if (!signals) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required object: signals' },
        { status: 400 }
      );
    }

    const assessment = calculateEnvironmentalStress(signals, weights);

    return NextResponse.json({
      status: 'success',
      assessment,
      appliedWeights: weights,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { status: 'error', message: 'Stress calculation failed', detail: message },
      { status: 500 }
    );
  }
}
