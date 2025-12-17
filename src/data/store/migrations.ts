/**
 * Migration system for schema versioning
 * Handles data migrations when schema changes
 */

import { Storage } from '../store/storage';

const CURRENT_VERSION = '2.0.0';
const VERSION_KEY = 'schema_version';

interface Migration {
    version: string;
    migrate: () => Promise<void>;
}

/**
 * Migration from v1 to v2 (example)
 * Converts ISO timestamps to Unix timestamps
 */
async function migrateV1ToV2(): Promise<void> {
    const items = await Storage.getItem<any[]>('reading-items') || [];

    const migrated = items.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt).getTime() : Date.now(),
        lastReadAt: item.lastReadAt ? new Date(item.lastReadAt).getTime() : undefined,
    }));

    await Storage.setItem('items', migrated);
    await Storage.removeItem('reading-items'); // Remove old key
}

const migrations: Migration[] = [
    { version: '2.0.0', migrate: migrateV1ToV2 },
];

/**
 * Run all pending migrations
 */
export async function runMigrations(): Promise<void> {
    const currentVersion = await Storage.getItem<string>(VERSION_KEY) || '1.0.0';

    for (const migration of migrations) {
        if (compareVersions(currentVersion, migration.version) < 0) {
            console.log(`Running migration to ${migration.version}`);
            await migration.migrate();
            await Storage.setItem(VERSION_KEY, migration.version);
        }
    }
}

/**
 * Compare version strings
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;

        if (p1 < p2) return -1;
        if (p1 > p2) return 1;
    }

    return 0;
}

/**
 * Get current schema version
 */
export async function getCurrentVersion(): Promise<string> {
    return await Storage.getItem<string>(VERSION_KEY) || CURRENT_VERSION;
}
