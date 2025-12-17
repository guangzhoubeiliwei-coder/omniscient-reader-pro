/**
 * Streak calculation engine
 * Calculates reading streaks from history
 */

import { HistoryEntry } from '../schema/HistoryEntry';

/**
 * Calculate current reading streak in days
 */
export function calculateStreak(history: HistoryEntry[]): number {
    if (history.length === 0) return 0;

    // Sort by timestamp descending
    const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);

    // Get unique days (ignore time)
    const uniqueDays = new Set<string>();
    sorted.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        uniqueDays.add(dayKey);
    });

    const days = Array.from(uniqueDays).sort().reverse();

    // Check if streak is broken (no activity yesterday or today)
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    // Streak is broken if no activity today or yesterday
    if (days[0] !== todayKey && days[0] !== yesterdayKey) {
        return 0;
    }

    // Count consecutive days
    let streak = 1;
    let currentDate = new Date(days[0]);

    for (let i = 1; i < days.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevKey = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;

        if (days[i] === prevKey) {
            streak++;
            currentDate = prevDate;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Get longest streak from history
 */
export function calculateLongestStreak(history: HistoryEntry[]): number {
    if (history.length === 0) return 0;

    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);

    const uniqueDays = new Set<string>();
    sorted.forEach(entry => {
        const date = new Date(entry.timestamp);
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        uniqueDays.add(dayKey);
    });

    const days = Array.from(uniqueDays).sort();

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < days.length; i++) {
        const currentDate = new Date(days[i]);
        const prevDate = new Date(days[i - 1]);

        const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }

    return longestStreak;
}
