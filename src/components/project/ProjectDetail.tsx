import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext';
import { Header } from '../layout';
import { Button } from '../common';
import { ProjectHeader } from './ProjectHeader';
import { TaskBoard } from './TaskBoard';
import { ProjectModal } from '../modals/ProjectModal';
import { TaskModal } from '../modals/TaskModal';
import { DeleteModal } from '../modals/DeleteModal';
import type { Task, ProjectStatus } from '../../types';
import styles from './ProjectDetail.module.css';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, deleteProject, updateTaskStatus, deleteTask } = useProjects();

  const project = getProject(id || '');

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <Header title="Project Not Found" showSearch={false} />
        <main className="main-content">
          <div className="page-container">
            <div className={styles.notFoundContent}>
              <h2>Project Not Found</h2>
              <p>The project you're looking for doesn't exist or has been deleted.</p>
              <Button variant="primary" onClick={() => navigate('/')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Handlers
  const handleEditProject = () => {
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = () => {
    setIsDeleteProjectModalOpen(true);
  };

  const handleConfirmDeleteProject = () => {
    deleteProject(project.id);
    navigate('/');
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task);
  };

  const handleConfirmDeleteTask = () => {
    if (deletingTask) {
      deleteTask(project.id, deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleTaskStatusChange = (taskId: string, status: ProjectStatus) => {
    updateTaskStatus(project.id, taskId, status);
  };

  return (
    <div className={styles.projectDetail}>
      <Header title={project.name} showSearch={false} />

      <main className="main-content">
        <div className="page-container">
          <section className={styles.section}>
            <ProjectHeader
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          </section>

          <section className={styles.section}>
            <div className={styles.taskHeader}>
              <h2 className={styles.sectionTitle}>Tasks</h2>
              <Button
                variant="primary"
                onClick={handleAddTask}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                }
              >
                Add Task
              </Button>
            </div>
            <TaskBoard
              tasks={project.tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleTaskStatusChange}
            />
          </section>
        </div>
      </main>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={project}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={project.id}
        task={editingTask}
      />

      <DeleteModal
        isOpen={isDeleteProjectModalOpen}
        onClose={() => setIsDeleteProjectModalOpen(false)}
        onConfirm={handleConfirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This will also delete all tasks associated with this project. This action cannot be undone.`}
      />

      <DeleteModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
