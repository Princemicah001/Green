import { Claim, PointsTransaction } from '@/types';
import { INITIAL_CLAIMS } from '@/data/claimsSeed';

const STORAGE_KEY = 'eco_shield_points';

/**
 * GreenPoints Repository
 * Single wallet for the whole app: earns on verified claims, spends on rewards.
 */
export class PointsRepository {
  private static instance: PointsRepository;
  private balance: number;
  private totalEarned: number;
  private totalRedeemed: number;
  private history: PointsTransaction[];

  private constructor() {
    // Seed wallet so the demo shows a real redemption journey already in motion
    this.balance = 0;
    this.totalEarned = 0;
    this.totalRedeemed = 0;
    this.history = [];
    this.loadFromStorage();
  }

  public static getInstance(): PointsRepository {
    if (!PointsRepository.instance) {
      PointsRepository.instance = new PointsRepository();
    }
    return PointsRepository.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.balance = parsed.balance ?? 0;
        this.totalEarned = parsed.totalEarned ?? 0;
        this.totalRedeemed = parsed.totalRedeemed ?? 0;
        this.history = parsed.history ?? [];
        return;
      }
    } catch {
      // Storage fallback
    }
    // First-run demo seed: reward already given for the REWARDED claim
    const rewarded = INITIAL_CLAIMS.find(c => c.status === 'REWARDED' && c.pointsAwarded);
    if (rewarded && rewarded.pointsAwarded) {
      this.balance = rewarded.pointsAwarded;
      this.totalEarned = rewarded.pointsAwarded;
      this.history = [{
        id: 'txn-seed-1',
        type: 'EARNED',
        amount: rewarded.pointsAwarded,
        description: 'Verified claim (drainage flooding)',
        ref: rewarded.ticketNumber,
        at: rewarded.rewardedAt ?? new Date().toISOString(),
      }];
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        balance: this.balance,
        totalEarned: this.totalEarned,
        totalRedeemed: this.totalRedeemed,
        history: this.history,
      }));
    } catch {
      // Storage fallback
    }
  }

  public getWallet() {
    return {
      balance: this.balance,
      totalEarned: this.totalEarned,
      totalRedeemed: this.totalRedeemed,
      history: [...this.history],
    };
  }

  public earn(amount: number, ref: string, description: string): PointsTransaction {
    const txn: PointsTransaction = {
      id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'EARNED',
      amount,
      description,
      ref,
      at: new Date().toISOString(),
    };
    this.balance += amount;
    this.totalEarned += amount;
    this.history.unshift(txn);
    this.saveToStorage();
    return txn;
  }

  public redeem(amount: number, ref: string, description: string): PointsTransaction | null {
    if (this.balance < amount) return null;
    const txn: PointsTransaction = {
      id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'REDEEMED',
      amount,
      description,
      ref,
      at: new Date().toISOString(),
    };
    this.balance -= amount;
    this.totalRedeemed += amount;
    this.history.unshift(txn);
    this.saveToStorage();
    return txn;
  }

  public hasEarnedForTicket(ticketNumber: string): boolean {
    const needle = ticketNumber.trim().toUpperCase();
    return this.history.some(t => t.type === 'EARNED' && t.ref.toUpperCase() === needle);
  }

  /** Award points for a verified claim exactly once. Returns null if already rewarded. */
  public awardForClaim(claim: Claim): PointsTransaction | null {
    if (claim.status === 'REWARDED' || !claim.pointsAwarded) return null;
    if (this.hasEarnedForTicket(claim.ticketNumber)) return null;
    return this.earn(
      claim.pointsAwarded,
      claim.ticketNumber,
      `Verified claim: ${claim.title}`,
    );
  }

  public resetToDefault(): void {
    this.balance = 0;
    this.totalEarned = 0;
    this.totalRedeemed = 0;
    this.history = [];
    // Re-run the first-run seed
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    this.loadFromStorage();
  }
}
