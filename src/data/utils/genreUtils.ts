/**
 * Genre management utilities
 * Merge and delete genres with reassignment
 */

import { Genre } from '../schema/Genre';
import { ReaderItem } from '../schema/ReaderItem';
import { GenreRepository, ReaderRepository } from '../repositories/repositories';

/**
 * Merge two genres into one
 */
export async function mergeGenres(
    sourceGenreId: string,
    targetGenreId: string,
    items: ReaderItem[]
): Promise<void> {
    const sourceGenre = await GenreRepository.getById(sourceGenreId);
    const targetGenre = await GenreRepository.getById(targetGenreId);

    if (!sourceGenre || !targetGenre) {
        throw new Error('Genre not found');
    }

    // Update all items using source genre to use target genre
    const itemsToUpdate = items.filter(item =>
        item.genres.includes(sourceGenre.name) ||
        item.customGenres.includes(sourceGenre.name)
    );

    for (const item of itemsToUpdate) {
        const updatedGenres = item.genres.map(g =>
            g === sourceGenre.name ? targetGenre.name : g
        );
        const updatedCustomGenres = item.customGenres.map(g =>
            g === sourceGenre.name ? targetGenre.name : g
        );

        // Remove duplicates
        const uniqueGenres = Array.from(new Set(updatedGenres));
        const uniqueCustomGenres = Array.from(new Set(updatedCustomGenres));

        await ReaderRepository.save({
            ...item,
            genres: uniqueGenres,
            customGenres: uniqueCustomGenres,
            updatedAt: Date.now(),
        });
    }

    // Delete source genre
    await GenreRepository.delete(sourceGenreId);
}

/**
 * Delete genre with reassignment option
 */
export async function deleteGenreWithReassignment(
    genreId: string,
    replacementGenreName: string | null,
    items: ReaderItem[]
): Promise<void> {
    const genre = await GenreRepository.getById(genreId);
    if (!genre) {
        throw new Error('Genre not found');
    }

    // Update all items using this genre
    const itemsToUpdate = items.filter(item =>
        item.genres.includes(genre.name) ||
        item.customGenres.includes(genre.name)
    );

    for (const item of itemsToUpdate) {
        let updatedGenres = item.genres.filter(g => g !== genre.name);
        let updatedCustomGenres = item.customGenres.filter(g => g !== genre.name);

        // Add replacement genre if provided
        if (replacementGenreName) {
            if (item.genres.includes(genre.name)) {
                updatedGenres.push(replacementGenreName);
            }
            if (item.customGenres.includes(genre.name)) {
                updatedCustomGenres.push(replacementGenreName);
            }
        }

        // Remove duplicates
        updatedGenres = Array.from(new Set(updatedGenres));
        updatedCustomGenres = Array.from(new Set(updatedCustomGenres));

        await ReaderRepository.save({
            ...item,
            genres: updatedGenres,
            customGenres: updatedCustomGenres,
            updatedAt: Date.now(),
        });
    }

    // Delete genre
    await GenreRepository.delete(genreId);
}

/**
 * Find duplicate genres (case-insensitive)
 */
export function findDuplicateGenres(genres: Genre[]): Map<string, Genre[]> {
    const normalized = new Map<string, Genre[]>();

    genres.forEach(genre => {
        const key = genre.name.toLowerCase().trim();
        if (!normalized.has(key)) {
            normalized.set(key, []);
        }
        normalized.get(key)!.push(genre);
    });

    // Filter to only duplicates
    const duplicates = new Map<string, Genre[]>();
    normalized.forEach((genreList, key) => {
        if (genreList.length > 1) {
            duplicates.set(key, genreList);
        }
    });

    return duplicates;
}
