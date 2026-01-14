import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = true,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Determine color based on progress
  const getColorClass = () => {
    if (percentage >= 100) return styles.complete;
    if (percentage >= 60) return styles.good;
    if (percentage >= 30) return styles.medium;
    return styles.low;
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={`${styles.track} ${styles[size]}`}>
        <div
          className={`${styles.fill} ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className={styles.label}>{Math.round(percentage)}%</span>
      )}
    </div>
  );
}
