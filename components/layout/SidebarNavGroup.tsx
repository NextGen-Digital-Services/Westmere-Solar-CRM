'use client';

import React from 'react';
import Link from 'next/link';

interface NavItemProps {
  href: string;
  label: string;
  icon: any;
  active: boolean;
}

export function NavItem({ href, label, icon: Icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
        active
          ? 'bg-[var(--primary)] text-white shadow-xs'
          : 'text-[var(--text-main)] hover:bg-[var(--surface-raised)]'
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[var(--text-muted)]'}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
}
