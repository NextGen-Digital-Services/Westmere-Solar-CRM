import { Department } from './auth';

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  department: Department | 'system';
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOGIN' | 'STATUS_CHANGE';
  module: string;
  recordId: string;
  summary: string;
  beforeValue?: string;
  afterValue?: string;
  timestamp: string;
}
