/**
 * Immutable history entry for reading progress updates
 */

export interface HistoryEntry {
    id: string;
    itemId: string;
    fromChapter: number;
    toChapter: number;
    timestamp: number; // Unix timestamp
}
