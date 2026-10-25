import { InstallationTask, InstallationStatus, CompletionPhoto } from '@/types/installation';
import { INITIAL_INSTALLATIONS } from '@/lib/mock-data/installations.seed';
import { getStoredData, setStoredData } from './storage';
import { auditService } from './auditService';
import { authService } from './authService';

const INSTALLATIONS_KEY = 'solarcrm_installations';

export const installationService = {
  getTasks: (): InstallationTask[] => {
    return getStoredData<InstallationTask[]>(INSTALLATIONS_KEY, INITIAL_INSTALLATIONS);
  },

  getTaskById: (id: string): InstallationTask | undefined => {
    return installationService.getTasks().find((t) => t.id === id || t.projectId === id);
  },

  saveTask: (task: Partial<InstallationTask> & { projectId: string; customerName: string }): InstallationTask => {
    const tasks = getStoredData<InstallationTask[]>(INSTALLATIONS_KEY, INITIAL_INSTALLATIONS);
    const session = authService.getCurrentSession();
    const now = new Date().toISOString().split('T')[0];

    let saved: InstallationTask;
    if (task.id) {
      const idx = tasks.findIndex((t) => t.id === task.id);
      saved = { ...tasks[idx], ...task, updatedAt: now } as InstallationTask;
      tasks[idx] = saved;
    } else {
      saved = {
        id: `inst-${Date.now()}`,
        projectId: task.projectId,
        customerName: task.customerName,
        siteAddress: task.siteAddress || '',
        systemCapacityKW: task.systemCapacityKW || 5,
        scheduledDate: task.scheduledDate || now,
        leadTechnician: task.leadTechnician || 'Manoj Tiwari',
        teamMembers: task.teamMembers || ['S. Rathore', 'A. Gokhale'],
        status: task.status || 'Scheduled',
        isDelayed: false,
        checklist: task.checklist || [],
        photos: task.photos || [],
        supervisorNotes: task.supervisorNotes || '',
        updatedAt: now,
      };
      tasks.unshift(saved);
    }

    setStoredData(INSTALLATIONS_KEY, tasks);

    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'installation',
        action: task.id ? 'UPDATE' : 'CREATE',
        module: 'INSTALLATION',
        recordId: saved.projectId,
        summary: `${task.id ? 'Updated' : 'Scheduled'} installation for ${saved.customerName}`,
      });
    }

    return saved;
  },

  updateStatus: (id: string, status: InstallationStatus): InstallationTask | null => {
    const tasks = getStoredData<InstallationTask[]>(INSTALLATIONS_KEY, INITIAL_INSTALLATIONS);
    const idx = tasks.findIndex((t) => t.id === id || t.projectId === id);
    if (idx === -1) return null;

    const prev = tasks[idx].status;
    tasks[idx].status = status;
    if (status === 'Commissioned') {
      tasks[idx].completionDate = new Date().toISOString().split('T')[0];
    }
    tasks[idx].updatedAt = new Date().toISOString().split('T')[0];
    setStoredData(INSTALLATIONS_KEY, tasks);

    const session = authService.getCurrentSession();
    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'installation',
        action: 'STATUS_CHANGE',
        module: 'INSTALLATION',
        recordId: tasks[idx].projectId,
        summary: `Updated installation workflow stage to ${status}`,
        beforeValue: prev,
        afterValue: status,
      });
    }

    return tasks[idx];
  },

  toggleChecklistItem: (taskId: string, checkId: string): InstallationTask | null => {
    const tasks = getStoredData<InstallationTask[]>(INSTALLATIONS_KEY, INITIAL_INSTALLATIONS);
    const idx = tasks.findIndex((t) => t.id === taskId || t.projectId === taskId);
    if (idx === -1) return null;

    const itemIdx = tasks[idx].checklist.findIndex((c) => c.id === checkId);
    if (itemIdx === -1) return null;

    tasks[idx].checklist[itemIdx].completed = !tasks[idx].checklist[itemIdx].completed;
    tasks[idx].updatedAt = new Date().toISOString().split('T')[0];
    setStoredData(INSTALLATIONS_KEY, tasks);
    return tasks[idx];
  },

  addPhoto: (taskId: string, photo: { title: string; url: string }): InstallationTask | null => {
    const tasks = getStoredData<InstallationTask[]>(INSTALLATIONS_KEY, INITIAL_INSTALLATIONS);
    const idx = tasks.findIndex((t) => t.id === taskId || t.projectId === taskId);
    if (idx === -1) return null;

    const newPhoto: CompletionPhoto = {
      id: `photo-${Date.now()}`,
      title: photo.title,
      url: photo.url,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    tasks[idx].photos.push(newPhoto);
    setStoredData(INSTALLATIONS_KEY, tasks);
    return tasks[idx];
  },

  logDelay: (taskId: string, delayDays: number, reason: string): InstallationTask | null => {
    const tasks = getStoredData<InstallationTask[]>(INSTALLATIONS_KEY, INITIAL_INSTALLATIONS);
    const idx = tasks.findIndex((t) => t.id === taskId || t.projectId === taskId);
    if (idx === -1) return null;

    tasks[idx].isDelayed = true;
    tasks[idx].delayDays = delayDays;
    tasks[idx].delayReason = reason;
    tasks[idx].status = 'Delayed';
    tasks[idx].updatedAt = new Date().toISOString().split('T')[0];
    setStoredData(INSTALLATIONS_KEY, tasks);

    return tasks[idx];
  },

  exportToCSV: (tasks: InstallationTask[]): void => {
    const headers = ['Task ID', 'Project ID', 'Customer Name', 'Capacity kW', 'Scheduled Date', 'Technician', 'Status', 'Delayed', 'Delay Reason'];
    const rows = tasks.map((t) => [
      t.id,
      t.projectId,
      `"${t.customerName}"`,
      t.systemCapacityKW,
      t.scheduledDate,
      `"${t.leadTechnician}"`,
      `"${t.status}"`,
      t.isDelayed ? `YES (${t.delayDays} days)` : 'NO',
      `"${t.delayReason || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `installations_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
