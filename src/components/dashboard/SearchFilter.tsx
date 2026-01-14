import { Select, Button } from '../common';
import type { FilterState, ProjectStatus, Priority } from '../../types';
import { categories } from '../../mock/data';
import styles from './SearchFilter.module.css';

interface SearchFilterProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onAddProject: () => void;
}

export function SearchFilter({
  filters,
  onFilterChange,
  onAddProject,
}: SearchFilterProps) {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ status: e.target.value as ProjectStatus | 'all' });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ priority: e.target.value as Priority | 'all' });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ category: e.target.value });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      status: 'all',
      priority: 'all',
      category: '',
    });
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== '' ||
    filters.search !== '';

  return (
    <div className={styles.filterBar}>
      <div className={styles.filters}>
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={handleStatusChange}
        />
        <Select
          options={priorityOptions}
          value={filters.priority}
          onChange={handlePriorityChange}
        />
        <Select
          options={categoryOptions}
          value={filters.category}
          onChange={handleCategoryChange}
        />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Clear filters
          </Button>
        )}
      </div>
      <Button
        variant="primary"
        onClick={onAddProject}
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        }
      >
        New Project
      </Button>
    </div>
  );
}
