import { Genre } from '@/types/reading';
import { MoreVertical } from 'lucide-react';

interface GenreCardProps {
  genre: Genre;
  itemCount: number;
  onClick?: () => void;
}

export function GenreCard({ genre, itemCount, onClick }: GenreCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-200 text-left w-full"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: genre.color }}
        />
        <div>
          <h3 className="font-medium text-foreground">{genre.name}</h3>
          <p className="text-xs text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>
      <MoreVertical className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}
