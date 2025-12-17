/**
 * Genres Intelligence Tab Component
 * Advanced genre analytics and management
 */

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Genre, ReadingItem } from '@/types/reading';
import { HistoryEntry } from '@/data/schema/HistoryEntry';
import { calculateGenreDominance } from '@/data/engine/insightsEngine';
import { findDuplicateGenres, mergeGenres, deleteGenreWithReassignment } from '@/data/utils/genreUtils';
import { TrendingUp, Merge, Trash2, AlertCircle } from 'lucide-react';

interface GenresIntelligenceProps {
    genres: Genre[];
    items: ReadingItem[];
    history: HistoryEntry[];
    onRefresh: () => void;
}

export function GenresIntelligence({ genres, items, history, onRefresh }: GenresIntelligenceProps) {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [showMergeModal, setShowMergeModal] = useState(false);

    const dominance = calculateGenreDominance(items, history);
    const duplicates = findDuplicateGenres(genres);

    const handleMerge = async () => {
        if (selectedGenres.length !== 2) return;

        const [source, target] = selectedGenres;
        await mergeGenres(source, target, items);
        setSelectedGenres([]);
        setShowMergeModal(false);
        onRefresh();
    };

    const handleDelete = async (genreId: string, replacement: string | null) => {
        await deleteGenreWithReassignment(genreId, replacement, items);
        onRefresh();
    };

    return (
        <PageContainer>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-foreground">Genre Intelligence</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Advanced genre analytics and management
                </p>
            </div>

            {/* Genre Dominance */}
            <div className="mb-6 bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">Genre Dominance</h2>
                </div>
                <div className="space-y-2">
                    {dominance.slice(0, 5).map((genre) => (
                        <div key={genre.genre} className="flex items-center justify-between">
                            <span className="text-sm text-foreground">{genre.genre}</span>
                            <div className="flex items-center gap-3">
                                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${genre.percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground w-12 text-right">
                                    {genre.percentage}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Duplicate Detection */}
            {duplicates.size > 0 && (
                <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <h2 className="text-sm font-semibold text-destructive">Duplicate Genres Found</h2>
                    </div>
                    <div className="space-y-2">
                        {Array.from(duplicates.entries()).map(([key, genreList]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                                <span className="text-foreground">
                                    {genreList.map(g => g.name).join(', ')}
                                </span>
                                <button
                                    onClick={() => setSelectedGenres(genreList.map(g => g.id))}
                                    className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs"
                                >
                                    <Merge className="w-3 h-3 inline mr-1" />
                                    Merge
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Merge Tool */}
            <div className="mb-6 bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Merge className="w-5 h-5 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">Merge Genres</h2>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                    Select two genres to merge them into one
                </p>
                <button
                    onClick={handleMerge}
                    disabled={selectedGenres.length !== 2}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50"
                >
                    Merge Selected ({selectedGenres.length}/2)
                </button>
            </div>
        </PageContainer>
    );
}
