/**
 * Genres Page - Shows genres from library data
 * Clicking a genre shows all items with that genre
 */

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ReadingItem } from '@/types/reading';
import { Genre } from '@/data/schema/Genre';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface GenresPageProps {
  genres: Genre[];
  items: ReadingItem[];
  onAddGenre: (genre: Genre) => void;
}

export function GenresPage({ genres, items }: GenresPageProps) {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Get all unique genres from library items
  const libraryGenres = new Map<string, number>();

  items.forEach(item => {
    item.genres.forEach(genre => {
      libraryGenres.set(genre, (libraryGenres.get(genre) || 0) + 1);
    });
    item.customGenres.forEach(genre => {
      libraryGenres.set(genre, (libraryGenres.get(genre) || 0) + 1);
    });
  });

  const genreList = Array.from(libraryGenres.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Get items for selected genre
  const selectedGenreItems = selectedGenre
    ? items.filter(item =>
      item.genres.includes(selectedGenre) ||
      item.customGenres.includes(selectedGenre)
    )
    : [];

  if (selectedGenre) {
    return (
      <PageContainer>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedGenre(null)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{selectedGenre}</h1>
            <p className="text-sm text-muted-foreground">{selectedGenreItems.length} items</p>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-3 gap-3">
          {selectedGenreItems.map((item) => (
            <div key={item.id} className="flex flex-col">
              <div className="relative aspect-[3/4] w-full rounded-xl bg-muted overflow-hidden mb-2">
                {item.coverImagePath ? (
                  <img src={item.coverImagePath} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {item.totalChapters && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.round((item.currentChapter / item.totalChapters) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
              <h3 className="font-medium text-sm text-foreground truncate">{item.title}</h3>
              <p className="text-xs text-muted-foreground">Ch. {item.currentChapter}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Genres</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {genreList.length} genres from your library
        </p>
      </div>

      {/* Empty State */}
      {genreList.length === 0 && (
        <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No genres yet</h3>
          <p className="text-sm text-muted-foreground">
            Add items with genres to see them here
          </p>
        </div>
      )}

      {/* Genre List */}
      <div className="space-y-2">
        {genreList.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => setSelectedGenre(name)}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{name}</h3>
                <p className="text-xs text-muted-foreground">{count} {count === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <div className="text-muted-foreground">→</div>
          </button>
        ))}
      </div>
    </PageContainer>
  );
}
