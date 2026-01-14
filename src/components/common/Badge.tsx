import { type ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    dot ? styles.withDot : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}

// Convenience components for specific use cases
export function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const variants: Record<typeof priority, BadgeVariant> = {
    high: 'danger',
    medium: 'warning',
    low: 'success',
  };

  const labels: Record<typeof priority, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <Badge variant={variants[priority]} size="sm">
      {labels[priority]}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: 'on_track' | 'at_risk' | 'delayed' }) {
  const variants: Record<typeof status, BadgeVariant> = {
    on_track: 'success',
    at_risk: 'warning',
    delayed: 'danger',
  };

  const labels: Record<typeof status, string> = {
    on_track: 'On Track',
    at_risk: 'At Risk',
    delayed: 'Delayed',
  };

  return (
    <Badge variant={variants[status]} size="sm" dot>
      {labels[status]}
    </Badge>
  );
}
