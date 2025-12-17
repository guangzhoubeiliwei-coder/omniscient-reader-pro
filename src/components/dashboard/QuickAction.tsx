import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
}

export function QuickAction({ icon: Icon, label, onClick, variant = 'default' }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95',
        variant === 'default' && 'bg-card border border-border hover:border-primary/30',
        variant === 'primary' && 'bg-primary/10 border border-primary/30 hover:bg-primary/20'
      )}
    >
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center',
          variant === 'default' && 'bg-muted',
          variant === 'primary' && 'bg-primary/20'
        )}
      >
        <Icon
          className={cn(
            'w-5 h-5',
            variant === 'default' && 'text-foreground',
            variant === 'primary' && 'text-primary'
          )}
        />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  );
}
