/**
 * Jikan API integration (MyAnimeList)
 * REST API for manga metadata
 */

export interface JikanResult {
    id: string;
    title: string;
    altTitles: string[];
    description: string;
    coverUrl: string;
    type: 'manga' | 'manhwa' | 'manhua' | 'novel';
    status: string;
    genres: string[];
    chapters?: number;
    score: number;
}

const JIKAN_API = 'https://api.jikan.moe/v4';

/**
 * Search Jikan (MyAnimeList) for manga
 */
export async function searchJikan(query: string, signal?: AbortSignal): Promise<JikanResult[]> {
    try {
        const params = new URLSearchParams({
            q: query,
            limit: '10',
            type: 'manga',
        });

        const response = await fetch(`${JIKAN_API}/manga?${params}`, { signal });

        if (!response.ok) {
            throw new Error(`Jikan API error: ${response.status}`);
        }

        const data = await response.json();

        return data.data.map((manga: any) => {
            const title = manga.title || manga.title_english || 'Unknown';
            const altTitles = [
                manga.title_english,
                manga.title_japanese,
                ...(manga.titles?.map((t: any) => t.title) || [])
            ].filter(t => t && t !== title);

            // Determine type from demographics and serialization
            let type: 'manga' | 'manhwa' | 'manhua' | 'novel' = 'manga';
            if (manga.type === 'Novel' || manga.type === 'Light Novel') {
                type = 'novel';
            }
            // Note: Jikan doesn't distinguish manhwa/manhua well, defaulting to manga

            return {
                id: manga.mal_id.toString(),
                title,
                altTitles,
                description: manga.synopsis || '',
                coverUrl: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url || '',
                type,
                status: manga.status?.toLowerCase() || 'unknown',
                genres: manga.genres?.map((g: any) => g.name) || [],
                chapters: manga.chapters,
                score: 0.75, // Base score for Jikan results
            };
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw error;
        }
        console.error('Jikan search error:', error);
        return [];
    }
}
