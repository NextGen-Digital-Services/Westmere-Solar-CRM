'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { DemoCredentialsPanel } from '@/components/auth/DemoCredentialsPanel';

export default function LoginPage() {
  const [email, setEmail] = useState('superadmin@solarcrm.demo');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { success } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success && res.session) {
        success(`Welcome back, ${res.session.user.name}`);
        if (res.session.user.role === 'super_admin') {
          router.push('/admin');
        } else {
          router.push(`/${res.session.user.department || 'sales'}`);
        }
      } else {
        setError(res.error || 'Authentication failed.');
      }
    }, 400);
  };

  const handleSelectDemo = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-md">
            <Sun className="w-6 h-6 text-amber-400" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-main)]">
            ELIOS SOLARIS
          </span>
        </div>
        <p className="mt-2 text-center text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">
          Department-Wise Photovoltaic Enterprise CRM
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--surface)] border border-[var(--border-color)] py-8 px-6 shadow-xl rounded-2xl sm:px-10 space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-[#2D1616] border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@solarcrm.demo"
                  className="w-full bg-[var(--surface-raised)] text-[var(--text-main)] border border-[var(--border-color)] rounded-xl pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-main)] mb-1 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[var(--surface-raised)] text-[var(--text-main)] border border-[var(--border-color)] rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 p-1 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[var(--border-color)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--text-muted)]">Remember this workstation</span>
              </label>
              <span className="text-[var(--gold)] font-medium">Demo Mode Active</span>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
              Sign In to CRM
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <DemoCredentialsPanel onSelect={handleSelectDemo} />
        </div>
      </div>
    </div>
  );
}
