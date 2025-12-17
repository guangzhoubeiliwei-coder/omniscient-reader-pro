/**
 * Reading statistics schema
 */

export interface ReadingStats {
    total: number;
    reading: number;
    completed: number;
    dropped: number;
    paused: number;
    planned: number;
    favorites: number;
    chaptersThisWeek: number;
    avgChaptersPerDay: number;
    completionRate: number;
    streak: number;
}
