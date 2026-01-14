import { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Input, Select, ComboBox, Textarea } from '../common';
import { useProjects } from '../../contexts/ProjectContext';
import type { Project, ProjectFormData } from '../../types';
import { categories } from '../../mock/data';
import { getTodayISO, getDateFromTodayISO } from '../../utils/dateUtils';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

const initialFormData: ProjectFormData = {
  name: '',
  description: '',
  priority: 'medium',
  category: 'Development',
  owner: '',
  startDate: getTodayISO(),
  dueDate: getDateFromTodayISO(30),
};

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const { addProject, updateProject, projects } = useProjects();
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  const isEditing = !!project;

  // Build owners list dynamically from existing projects
  const existingOwners = useMemo(() => {
    const ownersSet = new Set<string>();
    projects.forEach((p) => {
      if (p.owner && p.owner.trim()) {
        ownersSet.add(p.owner.trim());
      }
    });
    return Array.from(ownersSet).sort();
  }, [projects]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        priority: project.priority,
        category: project.category,
        owner: project.owner,
        startDate: project.startDate,
        dueDate: project.dueDate,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.startDate && formData.dueDate && formData.startDate > formData.dueDate) {
      newErrors.dueDate = 'Due date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditing && project) {
      updateProject(project.id, formData);
    } else {
      addProject(formData);
    }

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name as keyof ProjectFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));

  const handleOwnerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, owner: value }));
    if (errors.owner) {
      setErrors((prev) => ({ ...prev, owner: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'New Project'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
          error={errors.name}
          required
          fullWidth
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the project"
          error={errors.description}
          required
          fullWidth
        />

        <div className={styles.row}>
          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={priorityOptions}
            fullWidth
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categoryOptions}
            fullWidth
          />
        </div>

        <ComboBox
          label="Owner"
          value={formData.owner}
          onChange={handleOwnerChange}
          options={existingOwners}
          placeholder="Select or type owner name"
          error={errors.owner}
          required
          fullWidth
        />

        <div className={styles.row}>
          <Input
            type="date"
            label="Start Date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
            fullWidth
          />

          <Input
            type="date"
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
            required
            fullWidth
          />
        </div>
      </form>
    </Modal>
  );
}
