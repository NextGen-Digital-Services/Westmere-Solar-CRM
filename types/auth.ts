export type Department =
  | 'sales'
  | 'registration'
  | 'finance'
  | 'inventory'
  | 'installation'
  | 'electrical'
  | 'subsidy';

export type Role = 'super_admin' | 'department_manager' | 'employee';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve';

export interface UserPermission {
  module: Department | 'users' | 'activity_logs' | 'reports';
  actions: PermissionAction[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: Department;
  managerId?: string;
  avatar?: string;
  phone: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  permissions?: UserPermission[];
}

export interface Session {
  user: User;
  token: string;
  loginTime: string;
}
