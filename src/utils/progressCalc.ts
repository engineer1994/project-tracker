import type { Project, Task, ProjectStatus, DashboardStats } from '../types';
import { getScheduleStatus } from './dateUtils';

/**
 * Calculate the completion percentage of a project based on its tasks
 */
export function calculateProjectProgress(tasks: Task[]): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  return Math.round((completedTasks / tasks.length) * 100);
}

/**
 * Get the derived status of a project based on its tasks
 * If all tasks are completed -> completed
 * If any task is in progress -> in_progress
 * Otherwise -> todo
 */
export function deriveProjectStatus(tasks: Task[]): ProjectStatus {
  if (tasks.length === 0) {
    return 'todo';
  }

  const allCompleted = tasks.every((task) => task.status === 'completed');
  if (allCompleted) {
    return 'completed';
  }

  const anyInProgress = tasks.some((task) => task.status === 'in_progress');
  const anyCompleted = tasks.some((task) => task.status === 'completed');

  if (anyInProgress || anyCompleted) {
    return 'in_progress';
  }

  return 'todo';
}

/**
 * Calculate dashboard statistics from projects
 */
export function calculateDashboardStats(projects: Project[]): DashboardStats {
  const stats: DashboardStats = {
    total: projects.length,
    todo: 0,
    inProgress: 0,
    completed: 0,
    atRisk: 0,
    delayed: 0,
  };

  projects.forEach((project) => {
    // Count by status
    switch (project.status) {
      case 'todo':
        stats.todo++;
        break;
      case 'in_progress':
        stats.inProgress++;
        break;
      case 'completed':
        stats.completed++;
        break;
    }

    // Count at risk and delayed (only for non-completed projects)
    if (project.status !== 'completed') {
      const scheduleStatus = getScheduleStatus(project.dueDate);
      if (scheduleStatus === 'at_risk') {
        stats.atRisk++;
      } else if (scheduleStatus === 'delayed') {
        stats.delayed++;
      }
    }
  });

  return stats;
}

/**
 * Count tasks by status
 */
export function countTasksByStatus(tasks: Task[]): Record<ProjectStatus, number> {
  return {
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };
}

/**
 * Group projects by status for Kanban board
 */
export function groupProjectsByStatus(projects: Project[]): Record<ProjectStatus, Project[]> {
  return {
    todo: projects.filter((p) => p.status === 'todo'),
    in_progress: projects.filter((p) => p.status === 'in_progress'),
    completed: projects.filter((p) => p.status === 'completed'),
  };
}

/**
 * Group tasks by status for task board
 */
export function groupTasksByStatus(tasks: Task[]): Record<ProjectStatus, Task[]> {
  return {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    completed: tasks.filter((t) => t.status === 'completed'),
  };
}

/**
 * Get status display label
 */
export function getStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
  }
}

/**
 * Get priority display label
 */
export function getPriorityLabel(priority: string): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}
