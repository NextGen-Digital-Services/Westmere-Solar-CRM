import { Department } from './auth';

export type NotificationType =
  | 'low_stock'
  | 'payment_due'
  | 'pending_approval'
  | 'overdue_task'
  | 'inspection_pending'
  | 'subsidy_update'
  | 'kyc_rejected';

export interface NotificationItem {
  id: string;
  department: Department;
  type: NotificationType;
  title: string;
  message: string;
  recordId?: string;
  linkUrl: string;
  isRead: boolean;
  createdAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
