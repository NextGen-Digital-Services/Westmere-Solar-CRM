'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, Department } from '@/types/auth';
import { authService } from '@/lib/services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, pass: string) => { success: boolean; session?: Session; error?: string };
  logout: () => void;
  switchDepartment: (dept?: Department) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  login: () => ({ success: false }),
  logout: () => {},
  switchDepartment: () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadSession = useCallback(() => {
    const active = authService.getCurrentSession();
    setSession(active);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = (email: string, pass: string) => {
    const res = authService.login(email, pass);
    if (res.success && res.session) {
      setSession(res.session);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setSession(null);
    router.push('/login');
  };

  const switchDepartment = (dept?: Department) => {
    authService.switchDepartmentForSuperAdmin(dept);
    const updated = authService.getCurrentSession();
    setSession(updated);
  };

  const refreshUser = () => {
    const current = authService.getCurrentSession();
    if (current) {
      const freshUser = authService.getUserById(current.user.id);
      if (freshUser) {
        current.user = freshUser;
        setSession({ ...current });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        isLoading,
        login,
        logout,
        switchDepartment,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
