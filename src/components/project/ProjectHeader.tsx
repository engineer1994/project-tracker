import { useNavigate } from 'react-router-dom';
import { Button, PriorityBadge, StatusBadge, Badge, ProgressBar } from '../common';
import type { Project, ScheduleStatus } from '../../types';
import { formatDate, getScheduleStatus, getDaysRemainingText } from '../../utils/dateUtils';
import { calculateProjectProgress, getStatusLabel } from '../../utils/progressCalc';
import styles from './ProjectHeader.module.css';

interface ProjectHeaderProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectHeader({ project, onEdit, onDelete }: ProjectHeaderProps) {
  const navigate = useNavigate();
  const progress = calculateProjectProgress(project.tasks);
  const scheduleStatus: ScheduleStatus = project.status === 'completed' ? 'on_track' : getScheduleStatus(project.dueDate);

  return (
    <div className={styles.header}>
      <div className={styles.top}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Dashboard
        </button>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            }
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            }
          >
            Delete
          </Button>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.info}>
          <h1 className={styles.title}>{project.name}</h1>
          <p className={styles.description}>{project.description}</p>

          <div className={styles.badges}>
            <Badge variant="primary" size="md">{getStatusLabel(project.status)}</Badge>
            <PriorityBadge priority={project.priority} />
            <Badge variant="default" size="sm">{project.category}</Badge>
            {project.status !== 'completed' && (
              <StatusBadge status={scheduleStatus} />
            )}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>Progress</span>
              <span className={styles.progressValue}>{progress}%</span>
            </div>
            <ProgressBar value={progress} size="lg" showLabel={false} />
          </div>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Owner</span>
              <span className={styles.metaValue}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {project.owner}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Start Date</span>
              <span className={styles.metaValue}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(project.startDate)}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Due Date</span>
              <span className={`${styles.metaValue} ${styles[scheduleStatus]}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatDate(project.dueDate)}
                {project.status !== 'completed' && (
                  <span className={styles.daysLeft}>
                    ({getDaysRemainingText(project.dueDate)})
                  </span>
                )}
              </span>
            </div>
            {project.status === 'completed' && project.completedDate ? (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Completed Date</span>
                <span className={`${styles.metaValue} ${styles.completed}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {formatDate(project.completedDate)}
                </span>
              </div>
            ) : (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Tasks</span>
                <span className={styles.metaValue}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {project.tasks.filter(t => t.status === 'completed').length} / {project.tasks.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
