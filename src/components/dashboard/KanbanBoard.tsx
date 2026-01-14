import type { Project, ProjectStatus } from '../../types';
import { groupProjectsByStatus, getStatusLabel } from '../../utils/progressCalc';
import { ProjectCard } from './ProjectCard';
import styles from './KanbanBoard.module.css';

interface KanbanBoardProps {
  projects: Project[];
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

interface KanbanColumnProps {
  title: string;
  status: ProjectStatus;
  projects: Project[];
  count: number;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

function KanbanColumn({
  title,
  status,
  projects,
  count,
  onEditProject,
  onDeleteProject,
}: KanbanColumnProps) {
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
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No projects</p>
          </div>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.id}
              className={styles.cardWrapper}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProjectCard
                project={project}
                onEdit={onEditProject}
                onDelete={onDeleteProject}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  projects,
  onEditProject,
  onDeleteProject,
}: KanbanBoardProps) {
  const groupedProjects = groupProjectsByStatus(projects);

  const columns: { status: ProjectStatus; title: string }[] = [
    { status: 'todo', title: getStatusLabel('todo') },
    { status: 'in_progress', title: getStatusLabel('in_progress') },
    { status: 'completed', title: getStatusLabel('completed') },
  ];

  return (
    <div className={styles.board}>
      {columns.map(({ status, title }) => (
        <KanbanColumn
          key={status}
          title={title}
          status={status}
          projects={groupedProjects[status]}
          count={groupedProjects[status].length}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
        />
      ))}
    </div>
  );
}
