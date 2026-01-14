import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea } from '../common';
import { useProjects } from '../../contexts/ProjectContext';
import type { Task, TaskFormData } from '../../types';
import { getDateFromTodayISO } from '../../utils/dateUtils';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  task?: Task | null;
}

const initialFormData: TaskFormData = {
  name: '',
  description: '',
  dueDate: getDateFromTodayISO(7),
};

export function TaskModal({ isOpen, onClose, projectId, task }: TaskModalProps) {
  const { addTask, updateTask } = useProjects();
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description,
        dueDate: task.dueDate,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditing && task) {
      updateTask(projectId, task.id, formData);
    } else {
      addTask(projectId, formData);
    }

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (errors[name as keyof TaskFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'New Task'}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Task Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter task name"
          error={errors.name}
          required
          fullWidth
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the task (optional)"
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
      </form>
    </Modal>
  );
}
