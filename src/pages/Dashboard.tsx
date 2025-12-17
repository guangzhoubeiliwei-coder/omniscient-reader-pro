import { PageContainer } from '@/components/layout/PageContainer';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickAction } from '@/components/dashboard/QuickAction';
import { ReadingCard } from '@/components/dashboard/ReadingCard';
import { ReadingItem, ReadingStats } from '@/types/reading';
import { BookOpen, PlusCircle, Shuffle, Clock, TrendingUp, Target, Flame, BookMarked } from 'lucide-react';

interface DashboardProps {
  items: ReadingItem[];
  stats: ReadingStats;
  onAddNew: () => void;
  onViewItem?: (itemId: string) => void;
}

export function Dashboard({ items, stats, onAddNew, onViewItem }: DashboardProps) {
  // Recently updated items (works for both manual and online items)
  const recentlyRead = items
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 3);

  // Continue reading - most recently updated reading item
  const continueReading = items
    .filter((item) => item.status === 'reading')
    .sort((a, b) => b.updatedAt - a.updatedAt)[0];

  const getRandomItem = () => {
    if (items.length === 0) return;
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    if (onViewItem) {
      onViewItem(randomItem.id);
    }
  };

  const handleContinue = () => {
    if (continueReading && onViewItem) {
      onViewItem(continueReading.id);
    }
  };

  const handleRecent = () => {
    if (recentlyRead.length > 0 && onViewItem) {
      onViewItem(recentlyRead[0].id);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Omniscient Reader</h1>
        <p className="text-muted-foreground text-sm mt-1">Your reading intelligence</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <QuickAction
          icon={BookOpen}
          label="Continue"
          onClick={handleContinue}
          variant={continueReading ? 'primary' : 'default'}
        />
        <QuickAction icon={PlusCircle} label="Add New" onClick={onAddNew} />
        <QuickAction icon={Shuffle} label="Random" onClick={getRandomItem} />
        <QuickAction icon={Clock} label="Recent" onClick={handleRecent} />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          label="Total Items"
          value={stats.total}
          icon={BookOpen}
        />
        <StatCard
          label="Active Reads"
          value={stats.reading}
          color="primary"
          icon={TrendingUp}
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          color="success"
          icon={Target}
        />
        <StatCard
          label="This Week"
          value={`${stats.chaptersThisWeek} ch`}
          icon={Flame}
          trend={stats.chaptersThisWeek > 0 ? 'up' : 'neutral'}
          trendValue={stats.chaptersThisWeek > 0 ? 'Active' : ''}
        />
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
          <BookMarked className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Your library is empty</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start tracking your reading journey
          </p>
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            Add Your First Item
          </button>
        </div>
      )}

      {/* Continue Reading */}
      {continueReading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Continue Reading</h2>
          </div>
          <ReadingCard item={continueReading} />
        </div>
      )}

      {/* Recently Updated */}
      {recentlyRead.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Recently Updated</h2>
            <button className="text-xs text-primary">See all</button>
          </div>
          <div className="space-y-2">
            {recentlyRead.map((item) => (
              <ReadingCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
