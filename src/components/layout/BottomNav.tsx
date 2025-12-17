import { Home, Library, Layers, Plus, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'dashboard' | 'library' | 'genres' | 'add' | 'insights' | 'settings';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const navItems: { id: TabId; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'library', icon: Library, label: 'Library' },
  { id: 'genres', icon: Layers, label: 'Genres' },
  { id: 'add', icon: Plus, label: 'Add' },
  { id: 'insights', icon: BarChart3, label: 'Insights' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-1 border-t border-border backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isAdd = item.id === 'add';

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
                isAdd && 'relative -mt-6',
                isActive && !isAdd && 'text-primary',
                !isActive && !isAdd && 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isAdd ? (
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Plus className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <item.icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      isActive && 'scale-110'
                    )}
                  />
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
