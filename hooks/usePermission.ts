'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { checkPermission, canAccessDepartmentRoute, AppModule } from '@/lib/permissions/rbac';
import { PermissionAction, Department } from '@/types/auth';

export function usePermission() {
  const { user } = useAuth();

  const can = (action: PermissionAction, module: AppModule): boolean => {
    return checkPermission(user, action, module);
  };

  const canAccessDepartment = (dept: Department): boolean => {
    return canAccessDepartmentRoute(user, dept);
  };

  return {
    can,
    canAccessDepartment,
    isSuperAdmin: user?.role === 'super_admin',
    isManager: user?.role === 'department_manager',
    isEmployee: user?.role === 'employee',
    userDepartment: user?.department,
    userRole: user?.role,
    userId: user?.id,
  };
}
