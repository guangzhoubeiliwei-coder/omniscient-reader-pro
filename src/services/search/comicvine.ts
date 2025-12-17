/**
 * ComicVine API integration
 * REST API for comics (requires API key)
 */

export interface ComicVineResult {
    id: string;
    title: string;
    altTitles: string[];
    description: string;
    coverUrl: string;
    type: 'comic';
    status: string;
    genres: string[];
    score: number;
}

const COMICVINE_API = 'https://comicvine.gamespot.com/api';

/**
 * Search ComicVine for comics
 * Note: Requires API key from user settings
 */
export async function searchComicVine(
    query: string,
    apiKey?: string,
    signal?: AbortSignal
): Promise<ComicVineResult[]> {
    if (!apiKey) {
        console.warn('ComicVine API key not provided');
        return [];
    }

    try {
        const params = new URLSearchParams({
            api_key: apiKey,
            format: 'json',
            query: query,
            resources: 'volume',
            limit: '10',
        });

        const response = await fetch(`${COMICVINE_API}/search?${params}`, { signal });

        if (!response.ok) {
            throw new Error(`ComicVine API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.error !== 'OK') {
            throw new Error(`ComicVine API error: ${data.error}`);
        }

        return data.results.map((comic: any) => {
            return {
                id: comic.id.toString(),
                title: comic.name || 'Unknown',
                altTitles: comic.aliases ? comic.aliases.split('\n').filter(Boolean) : [],
                description: comic.description?.replace(/<[^>]*>/g, '') || '',
                coverUrl: comic.image?.medium_url || comic.image?.small_url || '',
                type: 'comic' as const,
                status: 'unknown',
                genres: [],
                score: 0.7, // Base score for ComicVine results
            };
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw error;
        }
        console.error('ComicVine search error:', error);
        return [];
    }
}
