import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
}

export function Card({ children, hoverLift = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-5 shadow-sm transition-all duration-200 ${
        hoverLift ? 'hover:-translate-y-0.5 hover:shadow-md' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = '',
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="font-serif text-lg font-semibold text-[var(--text-main)] tracking-tight">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
