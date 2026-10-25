'use client';

import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { PermissionAction } from '@/types/auth';
import { AppModule } from '@/lib/permissions/rbac';

interface CanProps {
  I: PermissionAction;
  a: AppModule;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ I, a, children, fallback = null }: CanProps) {
  const { can } = usePermission();

  if (can(I, a)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
