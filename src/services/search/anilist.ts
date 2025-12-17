/**
 * AniList API integration
 * GraphQL API for anime and manga metadata
 */

export interface AniListResult {
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

const ANILIST_API = 'https://graphql.anilist.co';

const SEARCH_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 10) {
    media(search: $search, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
      description
      coverImage {
        large
      }
      format
      status
      genres
      chapters
      averageScore
      countryOfOrigin
    }
  }
}
`;

/**
 * Search AniList for manga/manhwa/manhua/novels
 */
export async function searchAniList(query: string, signal?: AbortSignal): Promise<AniListResult[]> {
    try {
        const response = await fetch(ANILIST_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: SEARCH_QUERY,
                variables: { search: query },
            }),
            signal,
        });

        if (!response.ok) {
            throw new Error(`AniList API error: ${response.status}`);
        }

        const data = await response.json();

        return data.data.Page.media.map((media: any) => {
            const title = media.title.english || media.title.romaji || media.title.native || 'Unknown';
            const altTitles = [media.title.romaji, media.title.english, media.title.native]
                .filter(t => t && t !== title);

            // Determine type from format and country
            let type: 'manga' | 'manhwa' | 'manhua' | 'novel' = 'manga';
            if (media.format === 'NOVEL') {
                type = 'novel';
            } else if (media.countryOfOrigin === 'KR') {
                type = 'manhwa';
            } else if (media.countryOfOrigin === 'CN') {
                type = 'manhua';
            }

            return {
                id: media.id.toString(),
                title,
                altTitles,
                description: media.description?.replace(/<[^>]*>/g, '') || '',
                coverUrl: media.coverImage.large || '',
                type,
                status: media.status?.toLowerCase() || 'unknown',
                genres: media.genres || [],
                chapters: media.chapters,
                score: 0.85, // Base score for AniList results
            };
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw error;
        }
        console.error('AniList search error:', error);
        return [];
    }
}
