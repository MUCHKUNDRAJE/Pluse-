import React from 'react';
import { clsx } from 'clsx';

export type UrgencyStatus = 'critical' | 'unavailable' | 'in-progress' | 'limited' | 'available' | 'complete' | string;

interface StatusBadgeProps {
  status: UrgencyStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className,
  icon
}) => {
  const normalizedStatus = status.toLowerCase();

  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-300';

  if (['critical', 'unavailable', 'red', 'high'].includes(normalizedStatus)) {
    colorStyles = 'bg-red-50 text-red-700 border-red-300 shadow-sm';
  } else if (['in-progress', 'limited', 'yellow', 'medium', 'en route', 'dispatched'].includes(normalizedStatus)) {
    colorStyles = 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm';
  } else if (['available', 'complete', 'green', 'low', 'picked up', 'arrived', 'ready'].includes(normalizedStatus)) {
    colorStyles = 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm';
  }

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs border font-semibold rounded-full',
    md: 'px-3 py-1 text-sm border font-bold rounded-full',
    lg: 'px-4 py-1.5 text-base border-2 font-extrabold rounded-full'
  }[size];

  const displayLabel = label || status.toUpperCase();

  return (
    <span className={clsx("inline-flex items-center gap-1.5 font-mono uppercase transition-all duration-200", colorStyles, sizeStyles, className)}>
      <span className={clsx("w-2 h-2 rounded-full animate-pulse", {
        'bg-red-600': ['critical', 'unavailable', 'red', 'high'].includes(normalizedStatus),
        'bg-amber-500': ['in-progress', 'limited', 'yellow', 'medium', 'en route', 'dispatched'].includes(normalizedStatus),
        'bg-emerald-600': ['available', 'complete', 'green', 'low', 'picked up', 'arrived', 'ready'].includes(normalizedStatus),
        'bg-slate-500': !['critical', 'unavailable', 'red', 'high', 'in-progress', 'limited', 'yellow', 'medium', 'en route', 'dispatched', 'available', 'complete', 'green', 'low', 'picked up', 'arrived', 'ready'].includes(normalizedStatus)
      })} />
      {icon}
      <span>{displayLabel}</span>
    </span>
  );
};
