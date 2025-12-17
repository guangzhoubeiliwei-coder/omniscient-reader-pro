/**
 * Repositories for data access
 * Single source of truth for all data operations
 */

import { Storage } from '../store/storage';
import { ReaderItem } from '../schema/ReaderItem';
import { HistoryEntry } from '../schema/HistoryEntry';
import { Genre } from '../schema/Genre';

const ITEMS_KEY = 'items';
const HISTORY_KEY = 'history';
const GENRES_KEY = 'genres';

/**
 * Reader items repository
 */
export class ReaderRepository {
    /**
     * Get all items
     */
    static async getAll(): Promise<ReaderItem[]> {
        const items = await Storage.getItem<ReaderItem[]>(ITEMS_KEY);
        return items || [];
    }

    /**
     * Get item by ID
     */
    static async getById(id: string): Promise<ReaderItem | null> {
        const items = await this.getAll();
        return items.find(item => item.id === id) || null;
    }

    /**
     * Save item (create or update)
     */
    static async save(item: ReaderItem): Promise<void> {
        const items = await this.getAll();
        const index = items.findIndex(i => i.id === item.id);

        if (index >= 0) {
            items[index] = { ...item, updatedAt: Date.now() };
        } else {
            items.push(item);
        }

        await Storage.setItem(ITEMS_KEY, items);
    }

    /**
     * Delete item
     */
    static async delete(id: string): Promise<void> {
        const items = await this.getAll();
        const filtered = items.filter(item => item.id !== id);
        await Storage.setItem(ITEMS_KEY, filtered);
    }

    /**
     * Clear all items
     */
    static async clear(): Promise<void> {
        await Storage.setItem(ITEMS_KEY, []);
    }
}

/**
 * History repository
 */
export class HistoryRepository {
    /**
     * Get all history entries
     */
    static async getAll(): Promise<HistoryEntry[]> {
        const history = await Storage.getItem<HistoryEntry[]>(HISTORY_KEY);
        return history || [];
    }

    /**
     * Get history for specific item
     */
    static async getByItemId(itemId: string): Promise<HistoryEntry[]> {
        const history = await this.getAll();
        return history.filter(entry => entry.itemId === itemId);
    }

    /**
     * Add history entry
     */
    static async add(entry: HistoryEntry): Promise<void> {
        const history = await this.getAll();
        history.push(entry);
        await Storage.setItem(HISTORY_KEY, history);
    }

    /**
     * Delete last entry for item (for undo)
     */
    static async deleteLastForItem(itemId: string): Promise<HistoryEntry | null> {
        const history = await this.getAll();
        const itemHistory = history.filter(entry => entry.itemId === itemId);

        if (itemHistory.length === 0) return null;

        // Find the last entry
        const lastEntry = itemHistory.reduce((latest, entry) =>
            entry.timestamp > latest.timestamp ? entry : latest
        );

        // Remove it
        const filtered = history.filter(entry => entry.id !== lastEntry.id);
        await Storage.setItem(HISTORY_KEY, filtered);

        return lastEntry;
    }

    /**
     * Clear all history
     */
    static async clear(): Promise<void> {
        await Storage.setItem(HISTORY_KEY, []);
    }
}

/**
 * Genre repository
 */
export class GenreRepository {
    /**
     * Get all genres
     */
    static async getAll(): Promise<Genre[]> {
        const genres = await Storage.getItem<Genre[]>(GENRES_KEY);
        return genres || [];
    }

    /**
     * Save genre
     */
    static async save(genre: Genre): Promise<void> {
        const genres = await this.getAll();
        const index = genres.findIndex(g => g.id === genre.id);

        if (index >= 0) {
            genres[index] = genre;
        } else {
            genres.push(genre);
        }

        await Storage.setItem(GENRES_KEY, genres);
    }

    /**
     * Delete genre
     */
    static async delete(id: string): Promise<void> {
        const genres = await this.getAll();
        const filtered = genres.filter(genre => genre.id !== id);
        await Storage.setItem(GENRES_KEY, filtered);
    }

    /**
     * Clear all genres
     */
    static async clear(): Promise<void> {
        await Storage.setItem(GENRES_KEY, []);
    }
}
