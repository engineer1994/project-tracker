export type ProjectStatus = 'todo' | 'in_progress' | 'completed';
export type Priority = 'high' | 'medium' | 'low';
export type ScheduleStatus = 'on_track' | 'at_risk' | 'delayed';

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
  completedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  category: string;
  owner: string;
  startDate: string;
  dueDate: string;
  completedDate: string | null;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

// Form types for creating/editing
export interface ProjectFormData {
  name: string;
  description: string;
  priority: Priority;
  category: string;
  owner: string;
  startDate: string;
  dueDate: string;
}

export interface TaskFormData {
  name: string;
  description: string;
  dueDate: string;
}

// Filter types
export interface FilterState {
  search: string;
  status: ProjectStatus | 'all';
  priority: Priority | 'all';
  category: string;
}

// Stats type
export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  atRisk: number;
  delayed: number;
}
