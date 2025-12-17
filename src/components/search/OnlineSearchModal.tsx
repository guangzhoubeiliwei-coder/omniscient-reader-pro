/**
 * Online Search Modal Component
 * UI for searching across multiple APIs
 */

import { useState } from 'react';
import { X, Search, Loader2, Download } from 'lucide-react';
import { searchAll, SearchResult } from '@/services/search/orchestrator';
import { ReaderItem } from '@/data/schema/ReaderItem';
import { generateId } from '@/lib/id';
import { cn } from '@/lib/utils';

interface OnlineSearchModalProps {
    onClose: () => void;
    onImport: (item: ReaderItem) => void;
}

export function OnlineSearchModal({ onClose, onImport }: OnlineSearchModalProps) {
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setSearching(true);
        try {
            const searchResults = await searchAll(query, {
                enableMangaDex: true,
                enableAniList: true,
                enableJikan: true,
                enableComicVine: false, // Disabled by default (requires API key)
            });
            setResults(searchResults);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleImport = (result: SearchResult) => {
        const now = Date.now();
        const newItem: ReaderItem = {
            id: generateId(),
            title: result.title,
            altTitles: result.altTitles,
            type: result.type === 'webtoon' ? 'webtoon' : result.type,
            status: 'planned',
            currentChapter: 0,
            totalChapters: result.chapters,
            rating: undefined,
            genres: result.genres,
            customGenres: [],
            tags: [],
            isFavorite: false,
            coverImagePath: result.coverUrl,
            notes: result.description,
            readingUrls: [],
            history: [],
            createdAt: now,
            updatedAt: now,
            lastReadAt: undefined,
        };

        onImport(newItem);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Online Search</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-4 border-b border-border">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search for manga, manhwa, novels..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={searching || !query.trim()}
                            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {searching ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                'Search'
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Searching: MangaDex, AniList, Jikan (MyAnimeList)
                    </p>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-4">
                    {results.length === 0 && !searching && (
                        <div className="text-center py-12">
                            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {query ? 'No results found' : 'Enter a search query to get started'}
                            </p>
                        </div>
                    )}

                    {searching && (
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-4" />
                            <p className="text-muted-foreground">Searching across multiple sources...</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        {results.map((result) => (
                            <div
                                key={`${result.source}-${result.id}`}
                                className={cn(
                                    "flex gap-3 p-3 bg-background border border-border rounded-xl hover:border-primary/30 transition-colors cursor-pointer",
                                    selectedResult === result && "border-primary"
                                )}
                                onClick={() => setSelectedResult(result)}
                            >
                                {result.coverUrl && (
                                    <img
                                        src={result.coverUrl}
                                        alt={result.title}
                                        className="w-16 h-24 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-foreground truncate">{result.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {result.type} • {result.source}
                                        {result.chapters && ` • ${result.chapters} chapters`}
                                    </p>
                                    {result.genres.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {result.genres.slice(0, 3).map((genre) => (
                                                <span
                                                    key={genre}
                                                    className="px-2 py-0.5 bg-muted text-xs text-muted-foreground rounded"
                                                >
                                                    {genre}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleImport(result);
                                    }}
                                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                                >
                                    <Download className="w-4 h-4" />
                                    Import
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
