import React from 'react';
import { clsx } from 'clsx';

interface SectionCardProps {
  title?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  hoverable = false
}) => {
  return (
    <div
      className={clsx(
        "rounded-2xl p-5 border border-slate-200 bg-white shadow-sm text-slate-900",
        hoverable && "glass-panel-hover cursor-pointer",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
