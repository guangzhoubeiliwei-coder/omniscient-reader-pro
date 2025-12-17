import { Grid3X3, List, LayoutList } from 'lucide-react';
import { ViewMode } from '@/types/reading';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const views: { mode: ViewMode; icon: React.ElementType }[] = [
  { mode: 'grid', icon: Grid3X3 },
  { mode: 'compact', icon: List },
  { mode: 'detailed', icon: LayoutList },
];

export function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-card border border-border rounded-lg p-1">
      {views.map(({ mode, icon: Icon }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={cn(
            'p-1.5 rounded-md transition-all duration-200',
            viewMode === mode
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
