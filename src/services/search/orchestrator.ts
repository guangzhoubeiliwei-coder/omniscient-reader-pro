/**
 * Search orchestrator
 * Coordinates parallel searches across multiple APIs
 */

import { searchMangaDex, MangaDexResult } from './mangadex';
import { searchAniList, AniListResult } from './anilist';
import { searchJikan, JikanResult } from './jikan';
import { searchComicVine, ComicVineResult } from './comicvine';
import { Storage } from '@/data/store/storage';

export type SearchResult = {
    id: string;
    source: 'mangadex' | 'anilist' | 'jikan' | 'comicvine';
    title: string;
    altTitles: string[];
    description: string;
    coverUrl: string;
    type: 'manga' | 'manhwa' | 'manhua' | 'comic' | 'novel' | 'webtoon' | 'other';
    status: string;
    genres: string[];
    chapters?: number;
    score: number;
};

export interface SearchOptions {
    enableMangaDex?: boolean;
    enableAniList?: boolean;
    enableJikan?: boolean;
    enableComicVine?: boolean;
    comicVineApiKey?: string;
    timeout?: number;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const CACHE_KEY = 'search_cache';
const CACHE_EXPIRY = 1000 * 60 * 60 * 24; // 24 hours

interface CachedSearch {
    query: string;
    results: SearchResult[];
    timestamp: number;
}

/**
 * Search across all enabled APIs in parallel
 */
export async function searchAll(
    query: string,
    options: SearchOptions = {}
): Promise<SearchResult[]> {
    const {
        enableMangaDex = true,
        enableAniList = true,
        enableJikan = true,
        enableComicVine = false,
        comicVineApiKey,
        timeout = DEFAULT_TIMEOUT,
    } = options;

    // Check cache first
    const cached = await getCachedSearch(query);
    if (cached) {
        return cached;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const searches: Promise<SearchResult[]>[] = [];

    if (enableMangaDex) {
        searches.push(
            searchMangaDex(query, controller.signal)
                .then(results => results.map(r => ({ ...r, source: 'mangadex' as const })))
                .catch(() => [])
        );
    }

    if (enableAniList) {
        searches.push(
            searchAniList(query, controller.signal)
                .then(results => results.map(r => ({ ...r, source: 'anilist' as const })))
                .catch(() => [])
        );
    }

    if (enableJikan) {
        searches.push(
            searchJikan(query, controller.signal)
                .then(results => results.map(r => ({ ...r, source: 'jikan' as const })))
                .catch(() => [])
        );
    }

    if (enableComicVine && comicVineApiKey) {
        searches.push(
            searchComicVine(query, comicVineApiKey, controller.signal)
                .then(results => results.map(r => ({ ...r, source: 'comicvine' as const })))
                .catch(() => [])
        );
    }

    try {
        const allResults = await Promise.all(searches);
        clearTimeout(timeoutId);

        // Flatten and deduplicate
        const combined = allResults.flat();
        const deduplicated = deduplicateResults(combined);

        // Sort by score
        const sorted = deduplicated.sort((a, b) => b.score - a.score);

        // Cache results
        await cacheSearch(query, sorted);

        return sorted;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('Search error:', error);
        return [];
    }
}

/**
 * Deduplicate search results based on title similarity
 */
function deduplicateResults(results: SearchResult[]): SearchResult[] {
    const seen = new Map<string, SearchResult>();

    for (const result of results) {
        const normalizedTitle = normalizeTitle(result.title);

        if (!seen.has(normalizedTitle)) {
            seen.set(normalizedTitle, result);
        } else {
            // If we've seen this title, keep the one with higher score
            const existing = seen.get(normalizedTitle)!;
            if (result.score > existing.score) {
                seen.set(normalizedTitle, result);
            }
        }
    }

    return Array.from(seen.values());
}

/**
 * Normalize title for comparison
 */
function normalizeTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Get cached search results
 */
async function getCachedSearch(query: string): Promise<SearchResult[] | null> {
    try {
        const cache = await Storage.getItem<CachedSearch[]>(CACHE_KEY) || [];
        const cached = cache.find(c => c.query.toLowerCase() === query.toLowerCase());

        if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
            return cached.results;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Cache search results
 */
async function cacheSearch(query: string, results: SearchResult[]): Promise<void> {
    try {
        const cache = await Storage.getItem<CachedSearch[]>(CACHE_KEY) || [];

        // Remove old entry if exists
        const filtered = cache.filter(c => c.query.toLowerCase() !== query.toLowerCase());

        // Add new entry
        filtered.push({
            query,
            results,
            timestamp: Date.now(),
        });

        // Keep only last 50 searches
        const trimmed = filtered.slice(-50);

        await Storage.setItem(CACHE_KEY, trimmed);
    } catch (error) {
        console.error('Cache error:', error);
    }
}

/**
 * Clear search cache
 */
export async function clearSearchCache(): Promise<void> {
    await Storage.removeItem(CACHE_KEY);
}
