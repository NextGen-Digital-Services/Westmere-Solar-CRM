import { ActivityLog } from '@/types/audit';
import { INITIAL_AUDIT_LOGS } from '@/lib/mock-data/audit.seed';
import { getStoredData, setStoredData } from './storage';
import { Department } from '@/types/auth';

const STORAGE_KEY = 'solarcrm_audit_logs';

export const auditService = {
  getAll: (dept?: Department, currentUserId?: string): ActivityLog[] => {
    const logs = getStoredData<ActivityLog[]>(STORAGE_KEY, INITIAL_AUDIT_LOGS);
    if (!dept) return logs;
    return logs.filter((log) => log.department === dept || log.department === 'system');
  },

  log: (params: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog => {
    const logs = getStoredData<ActivityLog[]>(STORAGE_KEY, INITIAL_AUDIT_LOGS);
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: ActivityLog = {
      ...params,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
    };
    const updated = [newLog, ...logs];
    setStoredData(STORAGE_KEY, updated);
    return newLog;
  },
};
