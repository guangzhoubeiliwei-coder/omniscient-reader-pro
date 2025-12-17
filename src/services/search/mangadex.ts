/**
 * MangaDex API integration
 * REST API for manga, manhwa, and manhua
 */

export interface MangaDexResult {
    id: string;
    title: string;
    altTitles: string[];
    description: string;
    coverUrl: string;
    type: 'manga' | 'manhwa' | 'manhua';
    status: string;
    genres: string[];
    score: number;
}

const MANGADEX_API = 'https://api.mangadex.org';

/**
 * Search MangaDex for manga/manhwa/manhua
 */
export async function searchMangaDex(query: string, signal?: AbortSignal): Promise<MangaDexResult[]> {
    try {
        const params = new URLSearchParams({
            title: query,
            limit: '10',
            'contentRating[]': 'safe',
            'contentRating[]': 'suggestive',
            'contentRating[]': 'erotica',
            includes: ['cover_art'],
        });

        const response = await fetch(`${MANGADEX_API}/manga?${params}`, { signal });

        if (!response.ok) {
            throw new Error(`MangaDex API error: ${response.status}`);
        }

        const data = await response.json();

        return data.data.map((manga: any) => {
            const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0] || 'Unknown';
            const altTitles = manga.attributes.altTitles.map((alt: any) => Object.values(alt)[0]).filter(Boolean);
            const description = manga.attributes.description.en || Object.values(manga.attributes.description)[0] || '';

            // Get cover art
            const coverRel = manga.relationships.find((rel: any) => rel.type === 'cover_art');
            const coverFileName = coverRel?.attributes?.fileName || '';
            const coverUrl = coverFileName
                ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
                : '';

            // Determine type from original language
            const originalLanguage = manga.attributes.originalLanguage;
            let type: 'manga' | 'manhwa' | 'manhua' = 'manga';
            if (originalLanguage === 'ko') type = 'manhwa';
            else if (originalLanguage === 'zh' || originalLanguage === 'zh-hk') type = 'manhua';

            return {
                id: manga.id,
                title,
                altTitles,
                description,
                coverUrl,
                type,
                status: manga.attributes.status,
                genres: manga.attributes.tags.map((tag: any) => tag.attributes.name.en).filter(Boolean),
                score: 0.8, // Base score for MangaDex results
            };
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw error;
        }
        console.error('MangaDex search error:', error);
        return [];
    }
}
