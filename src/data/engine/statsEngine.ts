/**
 * Statistics calculation engine
 * Pure functions for calculating stats from reading items and history
 */

import { ReaderItem } from '../schema/ReaderItem';
import { HistoryEntry } from '../schema/HistoryEntry';
import { ReadingStats } from '../schema/Stats';
import { calculateStreak } from './streakEngine';

/**
 * Calculate all statistics from items and history
 */
export function calculateStats(
    items: ReaderItem[],
    history: HistoryEntry[]
): ReadingStats {
    const reading = items.filter(i => i.status === 'reading').length;
    const completed = items.filter(i => i.status === 'completed').length;
    const dropped = items.filter(i => i.status === 'dropped').length;
    const paused = items.filter(i => i.status === 'paused').length;
    const planned = items.filter(i => i.status === 'planned').length;
    const favorites = items.filter(i => i.isFavorite).length;

    // Calculate chapters read this week from history
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    const chaptersThisWeek = history
        .filter(entry => entry.timestamp >= oneWeekAgo)
        .reduce((sum, entry) => sum + (entry.toChapter - entry.fromChapter), 0);

    // Calculate average chapters per day (based on last 7 days)
    const avgChaptersPerDay = Math.round(chaptersThisWeek / 7);

    // Calculate completion rate
    const completionRate = items.length > 0
        ? Math.round((completed / items.length) * 100)
        : 0;

    // Calculate streak
    const streak = calculateStreak(history);

    return {
        total: items.length,
        reading,
        completed,
        dropped,
        paused,
        planned,
        favorites,
        chaptersThisWeek,
        avgChaptersPerDay,
        completionRate,
        streak,
    };
}
