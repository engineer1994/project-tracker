import { Card } from '../common';
import type { DashboardStats } from '../../types';
import styles from './StatsOverview.module.css';

interface StatsOverviewProps {
  stats: DashboardStats;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  variant: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

function StatCard({ label, value, icon, variant }: StatCardProps) {
  return (
    <Card className={`${styles.statCard} ${styles[variant]}`} padding="md">
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statInfo}>
        <span className={styles.statValue}>{value}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </Card>
  );
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className={styles.grid}>
      <StatCard
        label="Total Projects"
        value={stats.total}
        variant="default"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        }
      />
      <StatCard
        label="In Progress"
        value={stats.inProgress}
        variant="primary"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        variant="success"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        }
      />
      <StatCard
        label="At Risk"
        value={stats.atRisk}
        variant="warning"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        }
      />
      <StatCard
        label="Delayed"
        value={stats.delayed}
        variant="danger"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      />
    </div>
  );
}
