import { User, PermissionAction, Department } from '@/types/auth';

export type AppModule = Department | 'users' | 'activity_logs' | 'reports';

export function checkPermission(
  user: User | null | undefined,
  action: PermissionAction,
  module: AppModule
): boolean {
  if (!user) return false;

  // Super Admin can do everything
  if (user.role === 'super_admin') return true;

  // Check department isolation: if module is a department, user must belong to that department
  const departmentModules: AppModule[] = [
    'sales',
    'registration',
    'finance',
    'inventory',
    'installation',
    'electrical',
    'subsidy',
  ];

  if (departmentModules.includes(module) && user.department !== module) {
    return false;
  }

  // Activity logs / reports: Managers can view own department's
  if (module === 'activity_logs' || module === 'reports') {
    if (action === 'view') return true;
    return false;
  }

  // Users module is Super Admin only
  if (module === 'users') {
    return false;
  }

  // Check custom user permissions if explicitly specified
  if (user.permissions && user.permissions.length > 0) {
    const modPerm = user.permissions.find((p) => p.module === module);
    if (modPerm) {
      return modPerm.actions.includes(action);
    }
  }

  // Default permissions if not overridden:
  if (user.role === 'department_manager') {
    return true; // Managers have all actions for their department
  }

  if (user.role === 'employee') {
    // Employees by default have view, create, edit; delete and approve require explicit permission
    if (action === 'view' || action === 'create' || action === 'edit') {
      return true;
    }
    return false;
  }

  return false;
}

export function canAccessDepartmentRoute(
  user: User | null | undefined,
  targetDepartment: Department
): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  return user.department === targetDepartment;
}
