import { ReadingItem, ViewMode } from '@/types/reading';
import { cn } from '@/lib/utils';
import { Star, BookOpen, MoreVertical } from 'lucide-react';

interface LibraryItemProps {
  item: ReadingItem;
  viewMode: ViewMode;
  onClick?: () => void;
}

export function LibraryItem({ item, viewMode, onClick }: LibraryItemProps) {
  const progress = item.totalChapters
    ? Math.round((item.currentChapter / item.totalChapters) * 100)
    : null;

  if (viewMode === 'grid') {
    return (
      <button
        onClick={onClick}
        className="flex flex-col text-left group"
      >
        <div className="relative aspect-[3/4] w-full rounded-xl bg-muted overflow-hidden mb-2">
          {item.coverImagePath ? (
            <img src={item.coverImagePath} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
          {item.isFavorite && (
            <div className="absolute top-2 right-2">
              <Star className="w-4 h-4 text-primary fill-primary" />
            </div>
          )}
          {progress !== null && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
        <h3 className="font-medium text-sm text-foreground truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground">Ch. {item.currentChapter}</p>
      </button>
    );
  }

  if (viewMode === 'compact') {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors text-left"
      >
        <div className="w-10 h-14 rounded-lg bg-muted shrink-0 overflow-hidden">
          {item.coverImagePath ? (
            <img src={item.coverImagePath} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground truncate">{item.title}</h3>
          <p className="text-xs text-muted-foreground">
            Ch. {item.currentChapter}
            {item.totalChapters && ` / ${item.totalChapters}`}
          </p>
        </div>
        {item.isFavorite && <Star className="w-4 h-4 text-primary fill-primary shrink-0" />}
      </button>
    );
  }

  // Detailed view
  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3 p-3 bg-card border border-border rounded-xl text-left hover:border-primary/30 transition-colors"
    >
      <div className="w-16 h-24 rounded-lg bg-muted shrink-0 overflow-hidden">
        {item.coverImagePath ? (
          <img src={item.coverImagePath} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground">{item.title}</h3>
          <MoreVertical className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{item.type}</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full capitalize',
              item.status === 'reading' && 'bg-status-reading/20 text-status-reading',
              item.status === 'completed' && 'bg-status-completed/20 text-status-completed',
              item.status === 'paused' && 'bg-status-paused/20 text-status-paused',
              item.status === 'dropped' && 'bg-status-dropped/20 text-status-dropped',
              item.status === 'planned' && 'bg-status-planned/20 text-status-planned'
            )}
          >
            {item.status}
          </span>
          <span className="text-xs text-muted-foreground">
            Ch. {item.currentChapter}
            {item.totalChapters && ` / ${item.totalChapters}`}
          </span>
          {item.rating && item.rating > 0 && (
            <span className="text-xs text-primary flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-primary" />
              {item.rating}
            </span>
          )}
        </div>
        {item.genres.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {item.genres.slice(0, 3).map((genre) => (
              <span key={genre} className="text-[10px] px-1.5 py-0.5 bg-muted rounded">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
