import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { LibraryItem } from '@/components/library/LibraryItem';
import { ViewToggle } from '@/components/library/ViewToggle';
import { ReadingItem, ViewMode, ReadingStatus } from '@/types/reading';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LibraryPageProps {
  items: ReadingItem[];
  onViewItem: (itemId: string) => void;
}

const statusFilters: { label: string; value: ReadingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Reading', value: 'reading' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paused', value: 'paused' },
  { label: 'Planned', value: 'planned' },
  { label: 'Dropped', value: 'dropped' },
];

export function LibraryPage({ items, onViewItem }: LibraryPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReadingStatus | 'all'>('all');

  // Sort items by creation date (newest first)
  const sortedItems = [...items].sort((a, b) => b.createdAt - a.createdAt);

  const filteredItems = sortedItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-foreground">Library</h1>
        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search your library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
              statusFilter === filter.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4">
        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
      </p>

      {/* Items Grid/List */}
      <div
        className={cn(
          viewMode === 'grid' && 'grid grid-cols-3 gap-3',
          viewMode === 'compact' && 'space-y-1',
          viewMode === 'detailed' && 'space-y-3'
        )}
      >
        {filteredItems.map((item) => (
          <div key={item.id} onClick={() => onViewItem(item.id)} className="cursor-pointer">
            <LibraryItem item={item} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
        </div>
      )}
    </PageContainer>
  );
}
