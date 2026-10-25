export type RegistrationStatus = 'Pending' | 'Submitted' | 'Approved' | 'Rejected';

export type DocumentType =
  | 'Electricity Bill'
  | 'Aadhaar Card'
  | 'Property Tax Receipt'
  | 'Rooftop Photo'
  | 'Cancelled Cheque';

export interface KYCDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'Verified' | 'Pending Review' | 'Rejected';
  rejectionReason?: string;
  fileUrl?: string;
}

export interface RegistrationProject {
  id: string;
  projectId: string; // e.g. SOL-2026-0001
  leadId?: string;
  customerName: string;
  phone: string;
  email: string;
  siteAddress: string;
  city: string;
  state: string;
  pincode: string;
  consumerNumber: string;
  discomName: string;
  sanctionedLoadKW: number;
  proposedCapacityKW: number;
  status: RegistrationStatus;
  documents: KYCDocument[];
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  managerId: string;
  createdAt: string;
  updatedAt: string;
  missingDocumentsCount: number;
}
