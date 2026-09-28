import { Claim, ClaimStatus, ControllerAction } from '@/types';
import { INITIAL_CLAIMS } from '@/data/claimsSeed';

const STORAGE_KEY = 'eco_shield_claims';

/**
 * Claim Repository
 * Persists citizen claims (complaints) and their tracking lifecycle.
 */
export class ClaimRepository {
  private static instance: ClaimRepository;
  private claims: Claim[];

  private constructor() {
    this.claims = [...INITIAL_CLAIMS];
    this.loadFromStorage();
  }

  public static getInstance(): ClaimRepository {
    if (!ClaimRepository.instance) {
      ClaimRepository.instance = new ClaimRepository();
    }
    return ClaimRepository.instance;
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.claims = JSON.parse(stored);
      }
    } catch {
      // Storage fallback
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.claims));
    } catch {
      // Storage fallback
    }
  }

  public getAll(): Claim[] {
    return [...this.claims];
  }

  public getById(id: string): Claim | undefined {
    return this.claims.find(c => c.id === id);
  }

  public getByTrackingNumber(trackingNumber: string): Claim | undefined {
    const needle = trackingNumber.trim().toUpperCase();
    return this.claims.find(c => c.trackingNumber.toUpperCase() === needle);
  }

  public getByTicketNumber(ticketNumber: string): Claim | undefined {
    const needle = ticketNumber.trim().toUpperCase();
    return this.claims.find(c => c.ticketNumber.toUpperCase() === needle);
  }

  public getByStatus(status: ClaimStatus): Claim[] {
    return this.claims.filter(c => c.status === status);
  }

  public addClaim(claim: Claim): void {
    this.claims.unshift(claim);
    this.saveToStorage();
  }

  public updateStatus(id: string, status: ClaimStatus, pointsAwarded?: number): Claim | undefined {
    const claim = this.claims.find(c => c.id === id);
    if (!claim) return undefined;
    claim.status = status;
    if (status === 'UNDER_REVIEW') claim.reviewedAt = new Date().toISOString();
    if (status === 'VERIFIED') claim.verifiedAt = new Date().toISOString();
    if (status === 'REWARDED') claim.rewardedAt = new Date().toISOString();
    if (pointsAwarded !== undefined) claim.pointsAwarded = pointsAwarded;
    this.saveToStorage();
    return claim;
  }

  public appendAction(id: string, action: ControllerAction): Claim | undefined {
    const claim = this.claims.find(c => c.id === id);
    if (!claim) return undefined;
    claim.controllerActionLog.unshift(action);
    this.saveToStorage();
    return claim;
  }

  public resetToDefault(): void {
    this.claims = [...INITIAL_CLAIMS];
    this.saveToStorage();
  }
}
