import { createContext, useContext, useReducer, useEffect, useCallback, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Task, ProjectFormData, TaskFormData, ProjectStatus } from '../types';
import { mockProjects } from '../mock/data';
import { deriveProjectStatus } from '../utils/progressCalc';
import { getTodayISO } from '../utils/dateUtils';
import '../types/electron.d.ts';

// Check if running in Electron
const isElectron = () => {
  return window.electronAPI?.isElectron === true;
};

// Action types
type ProjectAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: ProjectFormData }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<ProjectFormData> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'UPDATE_PROJECT_STATUS'; payload: { id: string; status: ProjectStatus } }
  | { type: 'ADD_TASK'; payload: { projectId: string; data: TaskFormData } }
  | { type: 'UPDATE_TASK'; payload: { projectId: string; taskId: string; data: Partial<TaskFormData> } }
  | { type: 'UPDATE_TASK_STATUS'; payload: { projectId: string; taskId: string; status: ProjectStatus } }
  | { type: 'DELETE_TASK'; payload: { projectId: string; taskId: string } };

interface ProjectState {
  projects: Project[];
}

interface ProjectContextType extends ProjectState {
  addProject: (data: ProjectFormData) => void;
  updateProject: (id: string, data: Partial<ProjectFormData>) => void;
  deleteProject: (id: string) => void;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
  addTask: (projectId: string, data: TaskFormData) => void;
  updateTask: (projectId: string, taskId: string, data: Partial<TaskFormData>) => void;
  updateTaskStatus: (projectId: string, taskId: string, status: ProjectStatus) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  getProject: (id: string) => Project | undefined;
  isLoading: boolean;
  isSaving: boolean;
  dataSource: 'electron' | 'browser';
  exportData: () => Promise<void>;
  showDataFile: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'SET_PROJECTS': {
      return {
        ...state,
        projects: action.payload,
      };
    }

    case 'ADD_PROJECT': {
      const newProject: Project = {
        id: uuidv4(),
        ...action.payload,
        status: 'todo',
        completedDate: null,
        tasks: [],
        createdAt: getTodayISO(),
        updatedAt: getTodayISO(),
      };
      return {
        ...state,
        projects: [...state.projects, newProject],
      };
    }

    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? { ...project, ...action.payload.data, updatedAt: getTodayISO() }
            : project
        ),
      };
    }

    case 'DELETE_PROJECT': {
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload),
      };
    }

    case 'UPDATE_PROJECT_STATUS': {
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id
            ? {
                ...project,
                status: action.payload.status,
                completedDate: action.payload.status === 'completed' ? getTodayISO() : null,
                updatedAt: getTodayISO(),
              }
            : project
        ),
      };
    }

    case 'ADD_TASK': {
      const newTask: Task = {
        id: uuidv4(),
        projectId: action.payload.projectId,
        ...action.payload.data,
        status: 'todo',
        completedDate: null,
        createdAt: getTodayISO(),
        updatedAt: getTodayISO(),
      };
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === action.payload.projectId) {
            const updatedTasks = [...project.tasks, newTask];
            const newStatus = deriveProjectStatus(updatedTasks);
            return {
              ...project,
              tasks: updatedTasks,
              status: newStatus,
              completedDate: newStatus === 'completed' ? project.completedDate : null,
              updatedAt: getTodayISO(),
            };
          }
          return project;
        }),
      };
    }

    case 'UPDATE_TASK': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === action.payload.projectId) {
            const updatedTasks = project.tasks.map((task) =>
              task.id === action.payload.taskId
                ? { ...task, ...action.payload.data, updatedAt: getTodayISO() }
                : task
            );
            return {
              ...project,
              tasks: updatedTasks,
              updatedAt: getTodayISO(),
            };
          }
          return project;
        }),
      };
    }

    case 'UPDATE_TASK_STATUS': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === action.payload.projectId) {
            const updatedTasks = project.tasks.map((task) =>
              task.id === action.payload.taskId
                ? {
                    ...task,
                    status: action.payload.status,
                    completedDate: action.payload.status === 'completed' ? getTodayISO() : null,
                    updatedAt: getTodayISO(),
                  }
                : task
            );
            const newProjectStatus = deriveProjectStatus(updatedTasks);
            const wasCompleted = project.status === 'completed';
            const isNowCompleted = newProjectStatus === 'completed';
            return {
              ...project,
              tasks: updatedTasks,
              status: newProjectStatus,
              completedDate: isNowCompleted && !wasCompleted
                ? getTodayISO()
                : isNowCompleted
                  ? project.completedDate
                  : null,
              updatedAt: getTodayISO(),
            };
          }
          return project;
        }),
      };
    }

    case 'DELETE_TASK': {
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === action.payload.projectId) {
            const updatedTasks = project.tasks.filter(
              (task) => task.id !== action.payload.taskId
            );
            const newProjectStatus = deriveProjectStatus(updatedTasks);
            const wasCompleted = project.status === 'completed';
            const isNowCompleted = newProjectStatus === 'completed';
            return {
              ...project,
              tasks: updatedTasks,
              status: newProjectStatus,
              completedDate: isNowCompleted && !wasCompleted
                ? getTodayISO()
                : isNowCompleted
                  ? project.completedDate
                  : null,
              updatedAt: getTodayISO(),
            };
          }
          return project;
        }),
      };
    }

    default:
      return state;
  }
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, {
    projects: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dataSource, setDataSource] = useState<'electron' | 'browser'>('browser');
  const [initialized, setInitialized] = useState(false);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      if (isElectron() && window.electronAPI) {
        setDataSource('electron');
        try {
          const result = await window.electronAPI.readData();
          if (result.success && result.data) {
            // In Electron mode, use whatever data is in Excel (even if empty)
            dispatch({ type: 'SET_PROJECTS', payload: result.data });
          } else {
            console.error('Failed to load data from Excel:', result.error);
            // Start with empty data on error
            dispatch({ type: 'SET_PROJECTS', payload: [] });
          }
        } catch (error) {
          console.error('Error loading data:', error);
          // Start with empty data on error
          dispatch({ type: 'SET_PROJECTS', payload: [] });
        }
      } else {
        // Browser mode - use mock data for demo purposes
        setDataSource('browser');
        dispatch({ type: 'SET_PROJECTS', payload: mockProjects });
      }
      setIsLoading(false);
      setInitialized(true);
    }

    loadData();
  }, []);

  // Save data whenever projects change (only in Electron mode)
  useEffect(() => {
    async function saveData() {
      if (!initialized || !isElectron() || !window.electronAPI) return;

      setIsSaving(true);
      try {
        await window.electronAPI.writeData(state.projects);
      } catch (error) {
        console.error('Error saving data:', error);
      }
      setIsSaving(false);
    }

    saveData();
  }, [state.projects, initialized]);

  const addProject = useCallback((data: ProjectFormData) => {
    dispatch({ type: 'ADD_PROJECT', payload: data });
  }, []);

  const updateProject = useCallback((id: string, data: Partial<ProjectFormData>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, data } });
  }, []);

  const deleteProject = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  const updateProjectStatus = useCallback((id: string, status: ProjectStatus) => {
    dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: { id, status } });
  }, []);

  const addTask = useCallback((projectId: string, data: TaskFormData) => {
    dispatch({ type: 'ADD_TASK', payload: { projectId, data } });
  }, []);

  const updateTask = useCallback((projectId: string, taskId: string, data: Partial<TaskFormData>) => {
    dispatch({ type: 'UPDATE_TASK', payload: { projectId, taskId, data } });
  }, []);

  const updateTaskStatus = useCallback((projectId: string, taskId: string, status: ProjectStatus) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { projectId, taskId, status } });
  }, []);

  const deleteTask = useCallback((projectId: string, taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { projectId, taskId } });
  }, []);

  const getProject = useCallback((id: string) => {
    return state.projects.find((project) => project.id === id);
  }, [state.projects]);

  const exportData = useCallback(async () => {
    if (isElectron() && window.electronAPI) {
      await window.electronAPI.exportData();
    }
  }, []);

  const showDataFile = useCallback(async () => {
    if (isElectron() && window.electronAPI) {
      await window.electronAPI.showInFolder();
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        addProject,
        updateProject,
        deleteProject,
        updateProjectStatus,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        getProject,
        isLoading,
        isSaving,
        dataSource,
        exportData,
        showDataFile,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
