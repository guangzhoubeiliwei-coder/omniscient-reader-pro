import { ReadingItem } from '@/types/reading';
import { cn } from '@/lib/utils';
import { Star, BookOpen } from 'lucide-react';

interface ReadingCardProps {
  item: ReadingItem;
  onClick?: () => void;
}

export function ReadingCard({ item, onClick }: ReadingCardProps) {
  const progress = item.totalChapters
    ? Math.round((item.currentChapter / item.totalChapters) * 100)
    : null;

  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3 p-3 bg-card border border-border rounded-xl text-left transition-all duration-200 hover:border-primary/30 hover:bg-card/80 active:scale-[0.98]"
    >
      {/* Cover placeholder */}
      <div className="w-14 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
        {item.coverImagePath ? (
          <img src={item.coverImagePath} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="w-6 h-6 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground truncate">{item.title}</h3>
          {item.isFavorite && <Star className="w-4 h-4 text-primary shrink-0 fill-primary" />}
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
        </div>

        {progress !== null && (
          <div className="mt-2">
            <div className="reading-progress">
              <div
                className="reading-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
