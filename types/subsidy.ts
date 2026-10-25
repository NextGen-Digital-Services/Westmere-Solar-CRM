export type SubsidyStatus =
  | 'Pending'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Disbursed';

export interface SubsidyCheckItem {
  id: string;
  name: string;
  isAvailable: boolean;
  remarks?: string;
}

export interface SubsidyApplication {
  id: string;
  projectId: string;
  customerName: string;
  consumerNumber: string;
  nationalPortalRef: string; // e.g. SURYA-MH-2026-8891
  schemeName: 'PM Surya Ghar: Muft Bijli Yojana';
  systemCapacityKW: number;
  eligibleSubsidyAmountINR: number;
  submissionDate: string;
  status: SubsidyStatus;
  checklist: SubsidyCheckItem[];
  missingDocuments: string[];
  disbursementStatus: 'Pending Verification' | 'Sanctioned' | 'Transferred' | 'Rejected';
  disbursedAmountINR: number;
  disbursementDate?: string;
  bankAccountLast4?: string;
  discomApprovalDate?: string;
  lastUpdated: string;
}
