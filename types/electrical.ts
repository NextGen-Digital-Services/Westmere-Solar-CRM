export type InspectionStatus = 'Pending' | 'Passed' | 'Failed' | 'Re-inspected';

export interface ElectricalCheckItem {
  id: string;
  category: 'Safety' | 'Wiring' | 'Inverter' | 'Earthing' | 'Grid';
  description: string;
  status: 'Pass' | 'Fail' | 'Pending';
  remarks?: string;
}

export interface DefectItem {
  id: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  correctiveActionRequired: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface ElectricalInspection {
  id: string;
  projectId: string;
  customerName: string;
  capacityKW: number;
  inspectionDate: string;
  inspectorName: string;
  inspectorId: string;
  earthingResistanceOhms: number;
  status: InspectionStatus;
  checklist: ElectricalCheckItem[];
  defects: DefectItem[];
  managerApproval: {
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: string;
    comments?: string;
  };
  completionCertificateIssued: boolean;
  notes?: string;
}
