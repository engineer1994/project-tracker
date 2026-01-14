import { useState, useMemo } from 'react';
import { useProjects } from '../../contexts/ProjectContext';
import { Header } from '../layout';
import { StatsOverview } from './StatsOverview';
import { KanbanBoard } from './KanbanBoard';
import { SearchFilter } from './SearchFilter';
import { ProjectModal } from '../modals/ProjectModal';
import { DeleteModal } from '../modals/DeleteModal';
import type { Project, FilterState } from '../../types';
import { calculateDashboardStats } from '../../utils/progressCalc';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { projects, deleteProject } = useProjects();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    priority: 'all',
    category: '',
  });

  // Modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.owner.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && project.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && project.priority !== filters.priority) {
        return false;
      }

      // Category filter
      if (filters.category && project.category !== filters.category) {
        return false;
      }

      return true;
    });
  }, [projects, filters]);

  // Calculate stats from all projects (not filtered)
  const stats = useMemo(() => calculateDashboardStats(projects), [projects]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setDeletingProject(project);
  };

  const handleConfirmDelete = () => {
    if (deletingProject) {
      deleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  return (
    <div className={styles.dashboard}>
      <Header
        title="Dashboard"
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
        showSearch
      />

      <main className="main-content">
        <div className="page-container">
          <section className={styles.section}>
            <StatsOverview stats={stats} />
          </section>

          <section className={styles.section}>
            <SearchFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onAddProject={handleAddProject}
            />
          </section>

          <section className={styles.section}>
            <KanbanBoard
              projects={filteredProjects}
              onEditProject={handleEditProject}
              onDeleteProject={handleDeleteProject}
            />
          </section>
        </div>
      </main>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={editingProject}
      />

      <DeleteModal
        isOpen={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name}"? This will also delete all tasks associated with this project. This action cannot be undone.`}
      />
    </div>
  );
}
