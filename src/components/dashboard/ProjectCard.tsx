import { useNavigate } from 'react-router-dom';
import { Card, PriorityBadge, StatusBadge, ProgressBar, Badge } from '../common';
import type { Project, ScheduleStatus } from '../../types';
import { formatDateShort, getScheduleStatus, getDaysRemainingText } from '../../utils/dateUtils';
import { calculateProjectProgress } from '../../utils/progressCalc';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();
  const progress = calculateProjectProgress(project.tasks);
  const scheduleStatus: ScheduleStatus = project.status === 'completed' ? 'on_track' : getScheduleStatus(project.dueDate);

  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(project);
  };

  return (
    <Card className={styles.card} padding="md" clickable onClick={handleClick}>
      <div className={styles.header}>
        <h3 className={styles.title}>{project.name}</h3>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={handleEdit}
            title="Edit project"
            aria-label="Edit project"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={handleDelete}
            title="Delete project"
            aria-label="Delete project"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <p className={styles.description}>{project.description}</p>

      <div className={styles.badges}>
        <PriorityBadge priority={project.priority} />
        <Badge variant="default" size="sm">{project.category}</Badge>
        {project.status !== 'completed' && (
          <StatusBadge status={scheduleStatus} />
        )}
      </div>

      <div className={styles.progress}>
        <ProgressBar value={progress} size="sm" />
      </div>

      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.owner}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {project.owner}
          </span>
        </div>
        {project.status === 'completed' && project.completedDate ? (
          <div className={`${styles.dueDate} ${styles.completedDate}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Completed {formatDateShort(project.completedDate)}</span>
          </div>
        ) : (
          <div className={styles.dueDate}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formatDateShort(project.dueDate)}</span>
            <span className={`${styles.daysLeft} ${styles[scheduleStatus]}`}>
              ({getDaysRemainingText(project.dueDate)})
            </span>
          </div>
        )}
      </div>

      <div className={styles.taskCount}>
        {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
      </div>
    </Card>
  );
}
