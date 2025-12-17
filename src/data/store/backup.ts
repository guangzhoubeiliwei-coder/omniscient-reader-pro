/**
 * Backup and restore system
 * Export/import functionality with validation
 */

import { Storage } from '../store/storage';
import { ReaderItem } from '../schema/ReaderItem';
import { HistoryEntry } from '../schema/HistoryEntry';
import { Genre } from '../schema/Genre';

export interface BackupData {
    version: string;
    exportedAt: number;
    items: ReaderItem[];
    history: HistoryEntry[];
    genres: Genre[];
}

const CURRENT_VERSION = '2.0.0';

/**
 * Export all data as JSON
 */
export async function exportData(): Promise<BackupData> {
    const items = await Storage.getItem<ReaderItem[]>('items') || [];
    const history = await Storage.getItem<HistoryEntry[]>('history') || [];
    const genres = await Storage.getItem<Genre[]>('genres') || [];

    return {
        version: CURRENT_VERSION,
        exportedAt: Date.now(),
        items,
        history,
        genres,
    };
}

/**
 * Import data from JSON with validation
 */
export async function importData(data: BackupData): Promise<{ success: boolean; error?: string }> {
    try {
        // Validate structure
        if (!data.version || !data.items || !data.history || !data.genres) {
            return { success: false, error: 'Invalid backup format' };
        }

        // Validate arrays
        if (!Array.isArray(data.items) || !Array.isArray(data.history) || !Array.isArray(data.genres)) {
            return { success: false, error: 'Invalid data structure' };
        }

        // Import data
        await Storage.setItem('items', data.items);
        await Storage.setItem('history', data.history);
        await Storage.setItem('genres', data.genres);

        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

/**
 * Download backup as JSON file
 */
export async function downloadBackup(): Promise<void> {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `omniscient-reader-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
}
