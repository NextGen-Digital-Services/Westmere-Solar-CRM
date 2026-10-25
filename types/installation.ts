export type InstallationStatus =
  | 'Scheduled'
  | 'Team Dispatched'
  | 'Structure Assembled'
  | 'Panels Mounted'
  | 'Inverter Connected'
  | 'Commissioned'
  | 'Delayed';

export interface InstallationChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  notes?: string;
}

export interface CompletionPhoto {
  id: string;
  title: string;
  url: string;
  uploadedAt: string;
}

export interface InstallationTask {
  id: string;
  projectId: string;
  customerName: string;
  siteAddress: string;
  systemCapacityKW: number;
  scheduledDate: string;
  leadTechnician: string;
  teamMembers: string[];
  status: InstallationStatus;
  isDelayed: boolean;
  delayDays?: number;
  delayReason?: string;
  checklist: InstallationChecklistItem[];
  photos: CompletionPhoto[];
  completionDate?: string;
  supervisorNotes?: string;
  updatedAt: string;
}
