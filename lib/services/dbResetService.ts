import { removeStoredData } from './storage';
import { auditService } from './auditService';
import { authService } from './authService';

export const dbResetService = {
  resetAllData: (): void => {
    const keys = [
      'solarcrm_leads',
      'solarcrm_quotations',
      'solarcrm_registration_projects',
      'solarcrm_payments',
      'solarcrm_inventory_stock',
      'solarcrm_inventory_movements',
      'solarcrm_installations',
      'solarcrm_electrical_inspections',
      'solarcrm_subsidies',
      'solarcrm_audit_logs',
      'solarcrm_notifications',
      'solarcrm_users',
    ];

    const session = authService.getCurrentSession();
    keys.forEach((key) => removeStoredData(key));

    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: 'system',
        action: 'UPDATE',
        module: 'SYSTEM',
        recordId: 'DATABASE_RESET',
        summary: 'Super Admin reset all CRM mock data to factory seeds',
      });
    }

    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },
};
