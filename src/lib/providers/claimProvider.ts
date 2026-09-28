import { Claim, ClaimCategory, ClaimEvidence, ClaimStatus } from '@/types';

export interface SubmitClaimInput {
  locationId: string;
  locationName: string;
  title: string;
  details: string;
  category: ClaimCategory;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  evidence: Array<Omit<ClaimEvidence, 'previewUrl'>>;
}

/**
 * Claim Provider
 * Issues tracking & ticket numbers and computes reward points.
 * Pure domain logic — no storage.
 */
export class ClaimProvider {
  private static instance: ClaimProvider;

  public static getInstance(): ClaimProvider {
    if (!ClaimProvider.instance) {
      ClaimProvider.instance = new ClaimProvider();
    }
    return ClaimProvider.instance;
  }

  /** Format a tracking number: EC-xxxxx (5 digits) */
  public generateTrackingNumber(): string {
    return `EC-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  /** Format a ticket number: TK-xxxxx (5 digits) */
  public generateTicketNumber(): string {
    return `TK-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  /**
   * GreenPoints for a verified claim: base by urgency, +8 per evidence item,
   * capped at 250.
   */
  public computePoints(urgency: 'LOW' | 'MEDIUM' | 'HIGH', evidenceCount: number): number {
    const base = urgency === 'HIGH' ? 100 : urgency === 'MEDIUM' ? 70 : 50;
    return Math.min(250, base + evidenceCount * 8);
  }

  /** First status a fresh claim enters. */
  public initialStatus(): ClaimStatus {
    return 'SUBMITTED';
  }

  /** Human-readable status text used across UI and USSD. */
  public statusText(status: ClaimStatus): string {
    switch (status) {
      case 'SUBMITTED': return 'Received — waiting for a reviewer';
      case 'UNDER_REVIEW': return 'Under review — being checked';
      case 'VERIFIED': return 'Verified — true and actioned';
      case 'REWARDED': return 'Verified & rewarded — points sent';
      case 'REJECTED': return 'Not verified — could not be confirmed';
      default: return status;
    }
  }

  /** Normalize a tracking/ticket string a user typed (accept lowercase, spaces). */
  public normalizeRef(ref: string): string {
    return ref.trim().toUpperCase().replace(/\s+/g, '');
  }

  /** Look up a claim by tracking or ticket number. */
  public findClaimByRef(claims: Claim[], ref: string): Claim | undefined {
    const n = this.normalizeRef(ref);
    return claims.find(c => c.trackingNumber.toUpperCase() === n || c.ticketNumber.toUpperCase() === n);
  }

  /** Category labels shared by web + USSD menus. */
  public categoryLabel(category: ClaimCategory): string {
    switch (category) {
      case 'WATER': return 'Water problem';
      case 'ENERGY': return 'Power problem';
      case 'HEAT': return 'Heat / hot weather';
      case 'FLOODING': return 'Flooding';
      case 'POLLUTION': return 'Pollution';
      case 'WASTE': return 'Waste / dumping';
      default: return 'Other';
    }
  }

  /** Urgency labels shared by web + USSD menus. */
  public urgencyLabel(urgency: 'LOW' | 'MEDIUM' | 'HIGH'): string {
    switch (urgency) {
      case 'HIGH': return 'Urgent — needs quick action';
      case 'MEDIUM': return 'Serious — should be fixed';
      default: return 'Can wait a bit';
    }
  }
}
