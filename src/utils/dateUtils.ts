import type { ScheduleStatus } from '../types';

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date string to a short format
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get the number of days until a date
 */
export function getDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine the schedule status based on due date
 * - On Track: > 7 days until deadline
 * - At Risk: <= 7 days until deadline (but not past)
 * - Delayed: past due date
 */
export function getScheduleStatus(dueDate: string): ScheduleStatus {
  const daysUntil = getDaysUntil(dueDate);

  if (daysUntil < 0) {
    return 'delayed';
  } else if (daysUntil <= 7) {
    return 'at_risk';
  } else {
    return 'on_track';
  }
}

/**
 * Get a human-readable label for schedule status
 */
export function getScheduleStatusLabel(status: ScheduleStatus): string {
  switch (status) {
    case 'on_track':
      return 'On Track';
    case 'at_risk':
      return 'At Risk';
    case 'delayed':
      return 'Delayed';
  }
}

/**
 * Get days remaining text
 */
export function getDaysRemainingText(dueDate: string): string {
  const days = getDaysUntil(dueDate);

  if (days < 0) {
    const overdue = Math.abs(days);
    return `${overdue} day${overdue !== 1 ? 's' : ''} overdue`;
  } else if (days === 0) {
    return 'Due today';
  } else if (days === 1) {
    return 'Due tomorrow';
  } else {
    return `${days} days left`;
  }
}

/**
 * Get today's date as an ISO string (date only)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get a date N days from today as an ISO string
 */
export function getDateFromTodayISO(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Check if a date is in the past
 */
export function isPastDate(dateString: string): boolean {
  return getDaysUntil(dateString) < 0;
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  return getDaysUntil(dateString) === 0;
}
