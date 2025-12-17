// Re-export new schema types for backward compatibility
export type { ReadingType, ReadingStatus, ReaderItem as ReadingItem } from '@/data/schema/ReaderItem';
export type { Genre } from '@/data/schema/Genre';
export type { HistoryEntry as ReadingHistoryEntry } from '@/data/schema/HistoryEntry';
export type { ReadingStats } from '@/data/schema/Stats';

export type ViewMode = 'grid' | 'compact' | 'detailed';

export interface Tag {
  id: string;
  name: string;
}

export interface FilterState {
  type: string[];
  status: string[];
  ratingMin: number;
  ratingMax: number;
  genres: string[];
  tags: string[];
  completionMin: number;
  completionMax: number;
}

export type SortOption = 'lastRead' | 'rating' | 'progress' | 'alphabetical' | 'manual';
