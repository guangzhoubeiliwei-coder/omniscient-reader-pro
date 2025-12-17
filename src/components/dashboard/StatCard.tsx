import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const colorClasses = {
  default: 'text-foreground',
  primary: 'text-primary',
  success: 'text-status-completed',
  warning: 'text-status-paused',
  danger: 'text-status-dropped',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'default',
  className,
}: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </div>
      <div className="flex items-end gap-2">
        <span className={cn('text-2xl font-semibold', colorClasses[color])}>{value}</span>
        {trend && trendValue && (
          <span
            className={cn(
              'text-xs mb-0.5',
              trend === 'up' && 'text-status-completed',
              trend === 'down' && 'text-status-dropped',
              trend === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
