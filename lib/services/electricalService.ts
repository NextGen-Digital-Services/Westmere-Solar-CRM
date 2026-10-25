import { ElectricalInspection, InspectionStatus } from '@/types/electrical';
import { INITIAL_INSPECTIONS } from '@/lib/mock-data/inspections.seed';
import { getStoredData, setStoredData } from './storage';
import { auditService } from './auditService';
import { authService } from './authService';

const INSPECTIONS_KEY = 'solarcrm_electrical_inspections';

export const electricalService = {
  getInspections: (): ElectricalInspection[] => {
    return getStoredData<ElectricalInspection[]>(INSPECTIONS_KEY, INITIAL_INSPECTIONS);
  },

  getInspectionById: (id: string): ElectricalInspection | undefined => {
    return electricalService.getInspections().find((i) => i.id === id || i.projectId === id);
  },

  saveInspection: (data: Partial<ElectricalInspection> & { projectId: string; customerName: string }): ElectricalInspection => {
    const inspections = getStoredData<ElectricalInspection[]>(INSPECTIONS_KEY, INITIAL_INSPECTIONS);
    const session = authService.getCurrentSession();
    const now = new Date().toISOString().split('T')[0];

    let saved: ElectricalInspection;
    if (data.id) {
      const idx = inspections.findIndex((i) => i.id === data.id);
      saved = { ...inspections[idx], ...data } as ElectricalInspection;
      inspections[idx] = saved;
    } else {
      saved = {
        id: `elec-${Date.now()}`,
        projectId: data.projectId,
        customerName: data.customerName,
        capacityKW: data.capacityKW || 5,
        inspectionDate: data.inspectionDate || now,
        inspectorName: data.inspectorName || session?.user.name || 'Rakesh Patil',
        inspectorId: data.inspectorId || session?.user.id || 'user-ele-emp1',
        earthingResistanceOhms: data.earthingResistanceOhms || 2.5,
        status: data.status || 'Pending',
        checklist: data.checklist || [],
        defects: data.defects || [],
        managerApproval: { isApproved: false },
        completionCertificateIssued: false,
        notes: data.notes || '',
      };
      inspections.unshift(saved);
    }

    setStoredData(INSPECTIONS_KEY, inspections);

    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'electrical',
        action: data.id ? 'UPDATE' : 'CREATE',
        module: 'ELECTRICAL',
        recordId: saved.projectId,
        summary: `${data.id ? 'Updated' : 'Created'} electrical safety inspection for ${saved.customerName}`,
      });
    }

    return saved;
  },

  updateCheckItemStatus: (
    inspectionId: string,
    itemId: string,
    status: 'Pass' | 'Fail' | 'Pending'
  ): ElectricalInspection | null => {
    const inspections = getStoredData<ElectricalInspection[]>(INSPECTIONS_KEY, INITIAL_INSPECTIONS);
    const idx = inspections.findIndex((i) => i.id === inspectionId || i.projectId === inspectionId);
    if (idx === -1) return null;

    const itemIdx = inspections[idx].checklist.findIndex((c) => c.id === itemId);
    if (itemIdx === -1) return null;

    inspections[idx].checklist[itemIdx].status = status;
    const allPass = inspections[idx].checklist.every((c) => c.status === 'Pass');
    const hasFail = inspections[idx].checklist.some((c) => c.status === 'Fail');

    if (hasFail) {
      inspections[idx].status = 'Failed';
    } else if (allPass) {
      inspections[idx].status = 'Passed';
    } else {
      inspections[idx].status = 'Pending';
    }

    setStoredData(INSPECTIONS_KEY, inspections);
    return inspections[idx];
  },

  approveInspection: (inspectionId: string, comments?: string): ElectricalInspection | null => {
    const inspections = getStoredData<ElectricalInspection[]>(INSPECTIONS_KEY, INITIAL_INSPECTIONS);
    const idx = inspections.findIndex((i) => i.id === inspectionId || i.projectId === inspectionId);
    if (idx === -1) return null;

    const session = authService.getCurrentSession();
    const now = new Date().toISOString().split('T')[0];

    inspections[idx].managerApproval = {
      isApproved: true,
      approvedBy: session?.user.name || 'Arvind Swamy',
      approvedAt: now,
      comments: comments || 'Technical verification and earth continuity approved.',
    };
    inspections[idx].completionCertificateIssued = true;
    inspections[idx].status = 'Passed';

    setStoredData(INSPECTIONS_KEY, inspections);

    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'electrical',
        action: 'APPROVE',
        module: 'ELECTRICAL',
        recordId: inspections[idx].projectId,
        summary: `Electrical manager sign-off approved for ${inspections[idx].customerName}`,
      });
    }

    return inspections[idx];
  },

  addDefect: (
    inspectionId: string,
    defect: { description: string; severity: 'Critical' | 'Major' | 'Minor'; correctiveActionRequired: string }
  ): ElectricalInspection | null => {
    const inspections = getStoredData<ElectricalInspection[]>(INSPECTIONS_KEY, INITIAL_INSPECTIONS);
    const idx = inspections.findIndex((i) => i.id === inspectionId || i.projectId === inspectionId);
    if (idx === -1) return null;

    inspections[idx].defects.push({
      id: `def-${Date.now()}`,
      description: defect.description,
      severity: defect.severity,
      correctiveActionRequired: defect.correctiveActionRequired,
      resolved: false,
    });
    inspections[idx].status = 'Failed';

    setStoredData(INSPECTIONS_KEY, inspections);
    return inspections[idx];
  },

  resolveDefect: (inspectionId: string, defectId: string): ElectricalInspection | null => {
    const inspections = getStoredData<ElectricalInspection[]>(INSPECTIONS_KEY, INITIAL_INSPECTIONS);
    const idx = inspections.findIndex((i) => i.id === inspectionId || i.projectId === inspectionId);
    if (idx === -1) return null;

    const defIdx = inspections[idx].defects.findIndex((d) => d.id === defectId);
    if (defIdx === -1) return null;

    inspections[idx].defects[defIdx].resolved = true;
    inspections[idx].defects[defIdx].resolvedAt = new Date().toISOString().split('T')[0];

    const allResolved = inspections[idx].defects.every((d) => d.resolved);
    if (allResolved) {
      inspections[idx].status = 'Re-inspected';
    }

    setStoredData(INSPECTIONS_KEY, inspections);
    return inspections[idx];
  },

  exportToCSV: (inspections: ElectricalInspection[]): void => {
    const headers = ['Inspection ID', 'Project ID', 'Customer Name', 'Capacity kW', 'Date', 'Inspector', 'Earth Ohms', 'Status', 'Approved'];
    const rows = inspections.map((i) => [
      i.id,
      i.projectId,
      `"${i.customerName}"`,
      i.capacityKW,
      i.inspectionDate,
      `"${i.inspectorName}"`,
      i.earthingResistanceOhms,
      `"${i.status}"`,
      i.managerApproval.isApproved ? 'YES' : 'NO',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `electrical_inspections_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
