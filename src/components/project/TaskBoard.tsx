import type { Task, ProjectStatus } from '../../types';
import { groupTasksByStatus, getStatusLabel } from '../../utils/progressCalc';
import { TaskCard } from './TaskCard';
import styles from './TaskBoard.module.css';

interface TaskBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (taskId: string, status: ProjectStatus) => void;
}

interface TaskColumnProps {
  title: string;
  status: ProjectStatus;
  tasks: Task[];
  count: number;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (taskId: string, status: ProjectStatus) => void;
}

function TaskColumn({
  title,
  status,
  tasks,
  count,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: TaskColumnProps) {
  return (
    <div className={styles.column}>
      <div className={`${styles.columnHeader} ${styles[status]}`}>
        <div className={styles.columnTitle}>
          <span className={styles.dot} />
          <h3>{title}</h3>
        </div>
        <span className={styles.count}>{count}</span>
      </div>
      <div className={styles.columnContent}>
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No tasks</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className={styles.cardWrapper}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function TaskBoard({
  tasks,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: TaskBoardProps) {
  const groupedTasks = groupTasksByStatus(tasks);

  const columns: { status: ProjectStatus; title: string }[] = [
    { status: 'todo', title: getStatusLabel('todo') },
    { status: 'in_progress', title: getStatusLabel('in_progress') },
    { status: 'completed', title: getStatusLabel('completed') },
  ];

  return (
    <div className={styles.board}>
      {columns.map(({ status, title }) => (
        <TaskColumn
          key={status}
          title={title}
          status={status}
          tasks={groupedTasks[status]}
          count={groupedTasks[status].length}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
