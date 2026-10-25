'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] flex items-center justify-center ${className}`}>
        <span className="w-4 h-4" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] text-[var(--text-main)] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${className}`}
      aria-label="Toggle light/dark theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--primary)]" />
      )}
    </button>
  );
}
