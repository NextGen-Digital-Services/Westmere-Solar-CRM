import { SubsidyApplication, SubsidyStatus } from '@/types/subsidy';
import { INITIAL_SUBSIDIES } from '@/lib/mock-data/subsidies.seed';
import { getStoredData, setStoredData } from './storage';
import { auditService } from './auditService';
import { authService } from './authService';

const SUBSIDIES_KEY = 'solarcrm_subsidies';

export const subsidyService = {
  getSubsidies: (): SubsidyApplication[] => {
    return getStoredData<SubsidyApplication[]>(SUBSIDIES_KEY, INITIAL_SUBSIDIES);
  },

  getSubsidyById: (id: string): SubsidyApplication | undefined => {
    return subsidyService.getSubsidies().find((s) => s.id === id || s.projectId === id || s.nationalPortalRef === id);
  },

  saveSubsidy: (data: Partial<SubsidyApplication> & { projectId: string; customerName: string }): SubsidyApplication => {
    const subsidies = getStoredData<SubsidyApplication[]>(SUBSIDIES_KEY, INITIAL_SUBSIDIES);
    const session = authService.getCurrentSession();
    const now = new Date().toISOString().split('T')[0];

    const capacity = data.systemCapacityKW || 3;
    const subsidyAmt = capacity === 1 ? 30000 : capacity === 2 ? 60000 : 78000;

    let saved: SubsidyApplication;
    if (data.id) {
      const idx = subsidies.findIndex((s) => s.id === data.id);
      saved = { ...subsidies[idx], ...data, lastUpdated: now } as SubsidyApplication;
      subsidies[idx] = saved;
    } else {
      const count = subsidies.length + 1;
      saved = {
        id: `sub-${Date.now()}`,
        projectId: data.projectId,
        customerName: data.customerName,
        consumerNumber: data.consumerNumber || `DISCOM-${Math.floor(700000 + Math.random() * 200000)}`,
        nationalPortalRef: `SURYA-MH-2026-${String(8800 + count).padStart(5, '0')}`,
        schemeName: 'PM Surya Ghar: Muft Bijli Yojana',
        systemCapacityKW: capacity,
        eligibleSubsidyAmountINR: subsidyAmt,
        submissionDate: now,
        status: data.status || 'Submitted',
        checklist: data.checklist || [
          { id: 'sub-c1', name: 'National Portal Registration Reference', isAvailable: true },
          { id: 'sub-c2', name: 'DISCOM Net Meter Installation Certificate', isAvailable: true },
          { id: 'sub-c3', name: 'Vendor Commissioning Agreement Uploaded', isAvailable: true },
          { id: 'sub-c4', name: 'Bank Details Verified with Aadhaar NPCI Link', isAvailable: true },
        ],
        missingDocuments: [],
        disbursementStatus: 'Pending Verification',
        disbursedAmountINR: 0,
        lastUpdated: now,
      };
      subsidies.unshift(saved);
    }

    setStoredData(SUBSIDIES_KEY, subsidies);

    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'subsidy',
        action: data.id ? 'UPDATE' : 'CREATE',
        module: 'SUBSIDY',
        recordId: saved.nationalPortalRef,
        summary: `${data.id ? 'Updated' : 'Submitted'} PM Surya Ghar claim for ${saved.customerName}`,
      });
    }

    return saved;
  },

  updateStatus: (id: string, status: SubsidyStatus): SubsidyApplication | null => {
    const subsidies = getStoredData<SubsidyApplication[]>(SUBSIDIES_KEY, INITIAL_SUBSIDIES);
    const idx = subsidies.findIndex((s) => s.id === id || s.projectId === id);
    if (idx === -1) return null;

    const prev = subsidies[idx].status;
    subsidies[idx].status = status;
    if (status === 'Disbursed') {
      subsidies[idx].disbursementStatus = 'Transferred';
      subsidies[idx].disbursedAmountINR = subsidies[idx].eligibleSubsidyAmountINR;
      subsidies[idx].disbursementDate = new Date().toISOString().split('T')[0];
    } else if (status === 'Approved') {
      subsidies[idx].disbursementStatus = 'Sanctioned';
    } else if (status === 'Rejected') {
      subsidies[idx].disbursementStatus = 'Rejected';
    }
    subsidies[idx].lastUpdated = new Date().toISOString().split('T')[0];
    setStoredData(SUBSIDIES_KEY, subsidies);

    const session = authService.getCurrentSession();
    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'subsidy',
        action: 'STATUS_CHANGE',
        module: 'SUBSIDY',
        recordId: subsidies[idx].nationalPortalRef,
        summary: `Changed subsidy status for ${subsidies[idx].customerName}`,
        beforeValue: prev,
        afterValue: status,
      });
    }

    return subsidies[idx];
  },

  exportToCSV: (subsidies: SubsidyApplication[]): void => {
    const headers = ['Project ID', 'Customer Name', 'Consumer No', 'Portal Ref', 'Capacity kW', 'Eligible (INR)', 'Disbursed (INR)', 'Status', 'Disbursement Status'];
    const rows = subsidies.map((s) => [
      s.projectId,
      `"${s.customerName}"`,
      `"${s.consumerNumber}"`,
      s.nationalPortalRef,
      s.systemCapacityKW,
      s.eligibleSubsidyAmountINR,
      s.disbursedAmountINR,
      `"${s.status}"`,
      `"${s.disbursementStatus}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subsidy_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
