import { RegistrationProject, RegistrationStatus, KYCDocument } from '@/types/registration';
import { INITIAL_PROJECTS } from '@/lib/mock-data/projects.seed';
import { getStoredData, setStoredData } from './storage';
import { auditService } from './auditService';
import { authService } from './authService';

const PROJECTS_KEY = 'solarcrm_registration_projects';

export const registrationService = {
  getProjects: (assignedEmployeeId?: string): RegistrationProject[] => {
    const projects = getStoredData<RegistrationProject[]>(PROJECTS_KEY, INITIAL_PROJECTS);
    if (!assignedEmployeeId) return projects;
    return projects.filter((p) => p.assignedEmployeeId === assignedEmployeeId);
  },

  getProjectById: (id: string): RegistrationProject | undefined => {
    return registrationService.getProjects().find((p) => p.id === id || p.projectId === id);
  },

  saveProject: (project: Partial<RegistrationProject> & { customerName: string; phone: string }): RegistrationProject => {
    const projects = getStoredData<RegistrationProject[]>(PROJECTS_KEY, INITIAL_PROJECTS);
    const session = authService.getCurrentSession();
    const now = new Date().toISOString().split('T')[0];

    let saved: RegistrationProject;
    if (project.id) {
      const idx = projects.findIndex((p) => p.id === project.id);
      const prev = projects[idx];
      saved = { ...prev, ...project, updatedAt: now } as RegistrationProject;
      projects[idx] = saved;

      if (session) {
        auditService.log({
          userId: session.user.id,
          userName: session.user.name,
          userRole: session.user.role,
          department: 'registration',
          action: 'UPDATE',
          module: 'REGISTRATION',
          recordId: saved.projectId,
          summary: `Updated registration project details for ${saved.customerName}`,
          beforeValue: `Status: ${prev.status}`,
          afterValue: `Status: ${saved.status}`,
        });
      }
    } else {
      const count = projects.length + 1;
      const projectCode = `SOL-2026-${String(count).padStart(4, '0')}`;
      saved = {
        id: `proj-${Date.now()}`,
        projectId: projectCode,
        leadId: project.leadId,
        customerName: project.customerName,
        phone: project.phone,
        email: project.email || '',
        siteAddress: project.siteAddress || '',
        city: project.city || 'Pune',
        state: project.state || 'Maharashtra',
        pincode: project.pincode || '411001',
        consumerNumber: project.consumerNumber || `DISCOM-${Math.floor(100000 + Math.random() * 900000)}`,
        discomName: project.discomName || 'MSEDCL',
        sanctionedLoadKW: project.sanctionedLoadKW || 6,
        proposedCapacityKW: project.proposedCapacityKW || 5,
        status: project.status || 'Pending',
        documents: project.documents || [],
        assignedEmployeeId: project.assignedEmployeeId || 'user-reg-emp1',
        assignedEmployeeName: project.assignedEmployeeName || 'Vikram Singh',
        managerId: 'user-reg-mgr',
        createdAt: now,
        updatedAt: now,
        missingDocumentsCount: (project.documents?.length || 0) < 4 ? 4 - (project.documents?.length || 0) : 0,
      };
      projects.unshift(saved);

      if (session) {
        auditService.log({
          userId: session.user.id,
          userName: session.user.name,
          userRole: session.user.role,
          department: 'registration',
          action: 'CREATE',
          module: 'REGISTRATION',
          recordId: saved.projectId,
          summary: `Created new project registration ${saved.projectId} for ${saved.customerName}`,
        });
      }
    }

    setStoredData(PROJECTS_KEY, projects);
    return saved;
  },

  updateStatus: (id: string, status: RegistrationStatus): RegistrationProject | null => {
    const projects = getStoredData<RegistrationProject[]>(PROJECTS_KEY, INITIAL_PROJECTS);
    const idx = projects.findIndex((p) => p.id === id || p.projectId === id);
    if (idx === -1) return null;

    const prev = projects[idx].status;
    projects[idx].status = status;
    projects[idx].updatedAt = new Date().toISOString().split('T')[0];
    setStoredData(PROJECTS_KEY, projects);

    const session = authService.getCurrentSession();
    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'registration',
        action: 'STATUS_CHANGE',
        module: 'REGISTRATION',
        recordId: projects[idx].projectId,
        summary: `Changed registration status for ${projects[idx].customerName}`,
        beforeValue: prev,
        afterValue: status,
      });
    }

    return projects[idx];
  },

  uploadDocument: (projectId: string, doc: Omit<KYCDocument, 'id' | 'uploadDate'>): RegistrationProject | null => {
    const projects = getStoredData<RegistrationProject[]>(PROJECTS_KEY, INITIAL_PROJECTS);
    const idx = projects.findIndex((p) => p.id === projectId || p.projectId === projectId);
    if (idx === -1) return null;

    const newDoc: KYCDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Pending Review',
    };

    projects[idx].documents = [newDoc, ...projects[idx].documents];
    projects[idx].missingDocumentsCount = Math.max(0, 4 - projects[idx].documents.length);
    projects[idx].updatedAt = new Date().toISOString().split('T')[0];
    setStoredData(PROJECTS_KEY, projects);

    return projects[idx];
  },

  verifyDocument: (projectId: string, docId: string, status: 'Verified' | 'Rejected', rejectionReason?: string): RegistrationProject | null => {
    const projects = getStoredData<RegistrationProject[]>(PROJECTS_KEY, INITIAL_PROJECTS);
    const idx = projects.findIndex((p) => p.id === projectId || p.projectId === projectId);
    if (idx === -1) return null;

    const docIdx = projects[idx].documents.findIndex((d) => d.id === docId);
    if (docIdx === -1) return null;

    projects[idx].documents[docIdx].status = status;
    projects[idx].documents[docIdx].rejectionReason = rejectionReason;
    projects[idx].updatedAt = new Date().toISOString().split('T')[0];
    setStoredData(PROJECTS_KEY, projects);

    return projects[idx];
  },

  deleteProject: (id: string): boolean => {
    const projects = getStoredData<RegistrationProject[]>(PROJECTS_KEY, INITIAL_PROJECTS);
    const target = projects.find((p) => p.id === id || p.projectId === id);
    if (!target) return false;

    setStoredData(PROJECTS_KEY, projects.filter((p) => p.id !== id && p.projectId !== id));
    return true;
  },

  exportToCSV: (projects: RegistrationProject[]): void => {
    const headers = ['Project ID', 'Customer Name', 'Phone', 'Consumer No', 'DISCOM', 'Sanctioned kW', 'Proposed kW', 'Status', 'Assigned To', 'Missing Docs'];
    const rows = projects.map((p) => [
      p.projectId,
      `"${p.customerName}"`,
      `"${p.phone}"`,
      `"${p.consumerNumber}"`,
      `"${p.discomName}"`,
      p.sanctionedLoadKW,
      p.proposedCapacityKW,
      `"${p.status}"`,
      `"${p.assignedEmployeeName}"`,
      p.missingDocumentsCount,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `registration_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
