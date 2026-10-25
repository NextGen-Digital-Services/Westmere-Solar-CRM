'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from './Button';

export function AccessDenied({ departmentName }: { departmentName?: string }) {
  const { user } = useAuth();
  const userHome = user?.role === 'super_admin' ? '/admin' : `/${user?.department || 'sales'}`;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in-50 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-[#2D1616] border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-5">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-2">
        Access Denied — Strict Department Isolation
      </span>

      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-main)] max-w-md">
        Restricted to {departmentName || 'Authorized'} Department Personnel
      </h1>

      <p className="text-sm text-[var(--text-muted)] mt-3 max-w-md leading-relaxed">
        Your current account is authenticated under the{' '}
        <strong className="text-[var(--text-main)] uppercase">{user?.department || 'current'}</strong>{' '}
        division with role <strong className="text-[var(--text-main)]">{user?.role}</strong>. You do
        not possess access credentials for this module.
      </p>

      <div className="mt-7 flex flex-wrap gap-3 justify-center">
        <Link href={userHome}>
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-2" />
            Return to My Department ({user?.department || 'Dashboard'})
          </Button>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 min-h-[44px] rounded-xl border border-[var(--border-color)] text-sm font-medium hover:bg-[var(--surface-raised)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
}
