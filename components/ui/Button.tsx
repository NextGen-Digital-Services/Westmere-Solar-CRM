'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
    md: 'text-sm px-4 py-2 min-h-[44px] gap-2',
    lg: 'text-base px-5 py-2.5 min-h-[48px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white focus:ring-[var(--primary)] shadow-sm active:translate-y-0.5',
    secondary:
      'bg-[var(--surface-raised)] hover:bg-[var(--border-color)] text-[var(--text-main)] border border-[var(--border-color)] active:translate-y-0.5',
    outline:
      'border border-[var(--border-color)] bg-transparent hover:bg-[var(--surface-raised)] text-[var(--text-main)] active:translate-y-0.5',
    ghost:
      'bg-transparent hover:bg-[var(--surface-raised)] text-[var(--text-main)]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm active:translate-y-0.5',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
