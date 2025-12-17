/**
 * Weekly analytics calculation engine
 * Pure functions for calculating weekly reading data
 */

import { HistoryEntry } from '../schema/HistoryEntry';

export interface WeeklyData {
    day: string;
    chapters: number;
}

/**
 * Calculate weekly reading data for chart
 */
export function calculateWeeklyData(history: HistoryEntry[]): WeeklyData[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData: WeeklyData[] = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = days[date.getDay()];

        const chaptersOnDay = history
            .filter(entry => {
                const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
                return entryDate === dateStr;
            })
            .reduce((sum, entry) => sum + (entry.toChapter - entry.fromChapter), 0);

        weekData.push({ day: dayName, chapters: chaptersOnDay });
    }

    return weekData;
}
