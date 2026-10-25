import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'terracotta'
  | 'gold';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    success:
      'bg-emerald-50 dark:bg-[#182B21] text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning:
      'bg-amber-50 dark:bg-[#2B2312] text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger:
      'bg-rose-50 dark:bg-[#2D1616] text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    info:
      'bg-sky-50 dark:bg-[#13222D] text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    neutral:
      'bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border-color)]',
    terracotta:
      'bg-[#FBF0EB] dark:bg-[#2D1D16] text-[#B5552F] dark:text-[#D4784F] border-[#EACCC0] dark:border-[#523326]',
    gold:
      'bg-[#F7F3EB] dark:bg-[#2A2418] text-[#B8945A] dark:text-[#CFAE76] border-[#DFD5C1] dark:border-[#4E412A]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
