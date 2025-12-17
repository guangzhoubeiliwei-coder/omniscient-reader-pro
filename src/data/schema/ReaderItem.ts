/**
 * Core reading item schema
 */

export type ReadingType = 'manga' | 'manhwa' | 'manhua' | 'comic' | 'novel' | 'webtoon' | 'other';
export type ReadingStatus = 'reading' | 'completed' | 'planned' | 'paused' | 'dropped';

export interface ReaderItem {
    id: string;
    title: string;
    altTitles: string[];
    type: ReadingType;
    status: ReadingStatus;
    currentChapter: number;
    totalChapters?: number;
    rating?: number;
    genres: string[];
    customGenres: string[];
    tags: string[];
    isFavorite: boolean;
    coverImagePath?: string;
    notes?: string;
    readingUrls: string[];
    history: string[]; // Array of HistoryEntry IDs
    createdAt: number; // Unix timestamp
    updatedAt: number; // Unix timestamp
    lastReadAt?: number; // Unix timestamp
}
