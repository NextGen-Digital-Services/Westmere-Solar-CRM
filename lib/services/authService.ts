import { User, Session, UserPermission, Role, Department } from '@/types/auth';
import { INITIAL_USERS } from '@/lib/mock-data/users.seed';
import { getStoredData, setStoredData, removeStoredData } from './storage';
import { auditService } from './auditService';

const USERS_KEY = 'solarcrm_users';
const SESSION_KEY = 'solarcrm_session';

export const authService = {
  getUsers: (): User[] => {
    return getStoredData<User[]>(USERS_KEY, INITIAL_USERS);
  },

  getUserById: (id: string): User | undefined => {
    return authService.getUsers().find((u) => u.id === id);
  },

  getCurrentSession: (): Session | null => {
    return getStoredData<Session | null>(SESSION_KEY, null);
  },

  login: (email: string, password: string): { success: boolean; session?: Session; error?: string } => {
    const users = authService.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'User with this email not found.' };
    }
    if (user.status === 'inactive') {
      return { success: false, error: 'Account is deactivated. Contact Super Admin.' };
    }
    if (password !== 'Demo@123') {
      return { success: false, error: 'Invalid password. (Use Demo@123 for demo)' };
    }

    const session: Session = {
      user,
      token: `demo-token-${Date.now()}`,
      loginTime: new Date().toISOString(),
    };
    setStoredData(SESSION_KEY, session);

    auditService.log({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      department: user.department || 'system',
      action: 'LOGIN',
      module: 'AUTH',
      recordId: user.id,
      summary: `User logged into system`,
    });

    return { success: true, session };
  },

  logout: (): void => {
    const session = authService.getCurrentSession();
    if (session) {
      auditService.log({
        userId: session.user.id,
        userName: session.user.name,
        userRole: session.user.role,
        department: session.user.department || 'system',
        action: 'STATUS_CHANGE',
        module: 'AUTH',
        recordId: session.user.id,
        summary: `User logged out`,
      });
    }
    removeStoredData(SESSION_KEY);
  },

  saveUser: (user: Partial<User> & { name: string; email: string; role: Role }): User => {
    const users = authService.getUsers();
    let savedUser: User;
    if (user.id) {
      const idx = users.findIndex((u) => u.id === user.id);
      savedUser = { ...users[idx], ...user } as User;
      users[idx] = savedUser;
    } else {
      savedUser = {
        id: `user-${Date.now()}`,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone || '+91 98000 00000',
        status: user.status || 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        permissions: user.permissions || [],
      };
      users.push(savedUser);
    }
    setStoredData(USERS_KEY, users);

    // Update active session if it is current user
    const session = authService.getCurrentSession();
    if (session && session.user.id === savedUser.id) {
      session.user = savedUser;
      setStoredData(SESSION_KEY, session);
    }

    return savedUser;
  },

  updateUserPermissions: (userId: string, permissions: UserPermission[]): User | null => {
    const users = authService.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return null;

    users[idx].permissions = permissions;
    setStoredData(USERS_KEY, users);

    const session = authService.getCurrentSession();
    if (session && session.user.id === userId) {
      session.user.permissions = permissions;
      setStoredData(SESSION_KEY, session);
    }

    return users[idx];
  },

  switchDepartmentForSuperAdmin: (department?: Department): void => {
    const session = authService.getCurrentSession();
    if (!session || session.user.role !== 'super_admin') return;
    session.user.department = department;
    setStoredData(SESSION_KEY, session);
  },
};
