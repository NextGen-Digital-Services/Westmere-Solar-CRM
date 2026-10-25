import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className = '', id, ...props }: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-[var(--surface)] text-[var(--text-main)] border rounded-xl px-3.5 py-2.5 text-sm transition-colors placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
          error ? 'border-rose-500 ring-rose-200' : 'border-[var(--border-color)]'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{helperText}</p>
      ) : null}
    </div>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-[var(--surface)] text-[var(--text-main)] border rounded-xl px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
          error ? 'border-rose-500' : 'border-[var(--border-color)]'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
}
