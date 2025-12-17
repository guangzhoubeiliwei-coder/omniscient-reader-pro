/**
 * Enhanced insights engine
 * Advanced analytics for reading patterns
 */

import { ReaderItem } from '../schema/ReaderItem';
import { HistoryEntry } from '../schema/HistoryEntry';

export interface DropOffAnalysis {
    itemId: string;
    title: string;
    daysSinceLastRead: number;
    progressPercentage: number;
    risk: 'low' | 'medium' | 'high';
}

export interface ProductiveDay {
    date: string;
    chaptersRead: number;
    itemsUpdated: number;
}

export interface GenreDominance {
    genre: string;
    itemCount: number;
    percentage: number;
    chaptersRead: number;
}

/**
 * Analyze items at risk of being dropped
 */
export function analyzeDropOffRisk(items: ReaderItem[], history: HistoryEntry[]): DropOffAnalysis[] {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = now - (14 * 24 * 60 * 60 * 1000);

    return items
        .filter(item => item.status === 'reading' || item.status === 'paused')
        .map(item => {
            const lastUpdate = item.lastReadAt || item.updatedAt;
            const daysSinceLastRead = Math.floor((now - lastUpdate) / (24 * 60 * 60 * 1000));

            const progress = item.totalChapters
                ? (item.currentChapter / item.totalChapters) * 100
                : 0;

            let risk: 'low' | 'medium' | 'high' = 'low';
            if (lastUpdate < fourteenDaysAgo) risk = 'high';
            else if (lastUpdate < sevenDaysAgo) risk = 'medium';

            return {
                itemId: item.id,
                title: item.title,
                daysSinceLastRead,
                progressPercentage: Math.round(progress),
                risk,
            };
        })
        .filter(item => item.risk !== 'low')
        .sort((a, b) => b.daysSinceLastRead - a.daysSinceLastRead);
}

/**
 * Find most productive reading days
 */
export function findProductiveDays(history: HistoryEntry[], limit: number = 10): ProductiveDay[] {
    const dayMap = new Map<string, { chapters: number; items: Set<string> }>();

    history.forEach(entry => {
        const date = new Date(entry.timestamp).toISOString().split('T')[0];
        const chapters = entry.toChapter - entry.fromChapter;

        if (!dayMap.has(date)) {
            dayMap.set(date, { chapters: 0, items: new Set() });
        }

        const day = dayMap.get(date)!;
        day.chapters += chapters;
        day.items.add(entry.itemId);
    });

    return Array.from(dayMap.entries())
        .map(([date, data]) => ({
            date,
            chaptersRead: data.chapters,
            itemsUpdated: data.items.size,
        }))
        .sort((a, b) => b.chaptersRead - a.chaptersRead)
        .slice(0, limit);
}

/**
 * Calculate genre dominance
 */
export function calculateGenreDominance(items: ReaderItem[], history: HistoryEntry[]): GenreDominance[] {
    const genreMap = new Map<string, { count: number; chapters: number }>();

    // Count items per genre
    items.forEach(item => {
        item.genres.forEach(genre => {
            if (!genreMap.has(genre)) {
                genreMap.set(genre, { count: 0, chapters: 0 });
            }
            genreMap.get(genre)!.count++;
        });
    });

    // Count chapters read per genre
    history.forEach(entry => {
        const item = items.find(i => i.id === entry.itemId);
        if (item) {
            const chapters = entry.toChapter - entry.fromChapter;
            item.genres.forEach(genre => {
                if (genreMap.has(genre)) {
                    genreMap.get(genre)!.chapters += chapters;
                }
            });
        }
    });

    const total = items.length;

    return Array.from(genreMap.entries())
        .map(([genre, data]) => ({
            genre,
            itemCount: data.count,
            percentage: Math.round((data.count / total) * 100),
            chaptersRead: data.chapters,
        }))
        .sort((a, b) => b.itemCount - a.itemCount);
}
