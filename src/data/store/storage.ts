/**
 * Storage abstraction layer
 * Single persistence gateway that can be swapped for IndexedDB later
 */

const STORAGE_PREFIX = 'omniscient_reader_';

export class Storage {
    /**
     * Get item from storage
     */
    static async getItem<T>(key: string): Promise<T | null> {
        try {
            const fullKey = STORAGE_PREFIX + key;
            const item = localStorage.getItem(fullKey);
            if (item === null) return null;
            return JSON.parse(item) as T;
        } catch (error) {
            console.error(`Error getting item ${key}:`, error);
            return null;
        }
    }

    /**
     * Set item in storage
     */
    static async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const fullKey = STORAGE_PREFIX + key;
            localStorage.setItem(fullKey, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item ${key}:`, error);
            throw error;
        }
    }

    /**
     * Remove item from storage
     */
    static async removeItem(key: string): Promise<void> {
        try {
            const fullKey = STORAGE_PREFIX + key;
            localStorage.removeItem(fullKey);
        } catch (error) {
            console.error(`Error removing item ${key}:`, error);
            throw error;
        }
    }

    /**
     * Clear all storage
     */
    static async clear(): Promise<void> {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }

    /**
     * Get all keys
     */
    static async keys(): Promise<string[]> {
        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(STORAGE_PREFIX))
            .map(key => key.replace(STORAGE_PREFIX, ''));
    }
}
