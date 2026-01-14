import type { Task, ProjectStatus } from '../../types';
import { formatDateShort, getScheduleStatus, getDaysRemainingText } from '../../utils/dateUtils';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (taskId: string, status: ProjectStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const scheduleStatus = task.status === 'completed' ? 'on_track' : getScheduleStatus(task.dueDate);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task);
  };

  const handleMoveToTodo = () => onStatusChange(task.id, 'todo');
  const handleMoveToProgress = () => onStatusChange(task.id, 'in_progress');
  const handleMoveToCompleted = () => onStatusChange(task.id, 'completed');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>{task.name}</h4>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={handleEdit}
            title="Edit task"
            aria-label="Edit task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={handleDelete}
            title="Delete task"
            aria-label="Delete task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className={styles.description}>{task.description}</p>
      )}

      <div className={styles.footer}>
        {task.status === 'completed' && task.completedDate ? (
          <div className={`${styles.dueDate} ${styles.completedDate}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Completed {formatDateShort(task.completedDate)}</span>
          </div>
        ) : (
          <div className={`${styles.dueDate} ${styles[scheduleStatus]}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{formatDateShort(task.dueDate)}</span>
            <span className={styles.daysLeft}>
              ({getDaysRemainingText(task.dueDate)})
            </span>
          </div>
        )}
      </div>

      <div className={styles.moveActions}>
        {task.status !== 'todo' && (
          <button
            className={styles.moveButton}
            onClick={handleMoveToTodo}
            title="Move to To Do"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            To Do
          </button>
        )}
        {task.status !== 'in_progress' && (
          <button
            className={styles.moveButton}
            onClick={handleMoveToProgress}
            title="Move to In Progress"
          >
            {task.status === 'todo' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
            In Progress
          </button>
        )}
        {task.status !== 'completed' && (
          <button
            className={`${styles.moveButton} ${styles.completeButton}`}
            onClick={handleMoveToCompleted}
            title="Move to Completed"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Complete
          </button>
        )}
      </div>
    </div>
  );
}
