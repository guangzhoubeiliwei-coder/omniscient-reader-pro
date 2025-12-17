/**
 * In-memory state management hook
 * Loads data once, provides reactive state, debounces writes
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ReaderRepository, HistoryRepository, GenreRepository } from '../data/repositories/repositories';
import { ReaderItem } from '../data/schema/ReaderItem';
import { HistoryEntry } from '../data/schema/HistoryEntry';
import { Genre } from '../data/schema/Genre';
import { ReadingStats } from '../data/schema/Stats';
import { calculateStats } from '../data/engine/statsEngine';

interface ReaderStore {
    items: ReaderItem[];
    history: HistoryEntry[];
    genres: Genre[];
    stats: ReadingStats;
    loading: boolean;
    addItem: (item: ReaderItem) => Promise<void>;
    updateItem: (item: ReaderItem) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    addHistory: (entry: HistoryEntry) => Promise<void>;
    undoLastUpdate: (itemId: string) => Promise<void>;
    addGenre: (genre: Genre) => Promise<void>;
    deleteGenre: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
    refresh: () => Promise<void>;
}

export function useReaderStore(): ReaderStore {
    const [items, setItems] = useState<ReaderItem[]>([]);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [stats, setStats] = useState<ReadingStats>({
        total: 0,
        reading: 0,
        completed: 0,
        dropped: 0,
        paused: 0,
        planned: 0,
        favorites: 0,
        chaptersThisWeek: 0,
        avgChaptersPerDay: 0,
        completionRate: 0,
        streak: 0,
    });
    const [loading, setLoading] = useState(true);

    // Debounce timer ref
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    // Recalculate stats when items or history change
    useEffect(() => {
        setStats(calculateStats(items, history));
    }, [items, history]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [loadedItems, loadedHistory, loadedGenres] = await Promise.all([
                ReaderRepository.getAll(),
                HistoryRepository.getAll(),
                GenreRepository.getAll(),
            ]);
            setItems(loadedItems);
            setHistory(loadedHistory);
            setGenres(loadedGenres);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addItem = useCallback(async (item: ReaderItem) => {
        setItems(prev => [...prev, item]);
        await ReaderRepository.save(item);
    }, []);

    const updateItem = useCallback(async (item: ReaderItem) => {
        setItems(prev => prev.map(i => i.id === item.id ? item : i));
        await ReaderRepository.save(item);
    }, []);

    const deleteItem = useCallback(async (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        await ReaderRepository.delete(id);
    }, []);

    const addHistory = useCallback(async (entry: HistoryEntry) => {
        setHistory(prev => [...prev, entry]);
        await HistoryRepository.add(entry);
    }, []);

    const undoLastUpdate = useCallback(async (itemId: string) => {
        const lastEntry = await HistoryRepository.deleteLastForItem(itemId);
        if (lastEntry) {
            setHistory(prev => prev.filter(e => e.id !== lastEntry.id));
            // Restore item to previous chapter
            const item = items.find(i => i.id === itemId);
            if (item) {
                const updated = { ...item, currentChapter: lastEntry.fromChapter, updatedAt: Date.now() };
                await updateItem(updated);
            }
        }
    }, [items, updateItem]);

    const addGenre = useCallback(async (genre: Genre) => {
        setGenres(prev => [...prev, genre]);
        await GenreRepository.save(genre);
    }, []);

    const deleteGenre = useCallback(async (id: string) => {
        setGenres(prev => prev.filter(g => g.id !== id));
        await GenreRepository.delete(id);
    }, []);

    const clearAll = useCallback(async () => {
        setItems([]);
        setHistory([]);
        setGenres([]);
        await Promise.all([
            ReaderRepository.clear(),
            HistoryRepository.clear(),
            GenreRepository.clear(),
        ]);
    }, []);

    const refresh = useCallback(async () => {
        await loadData();
    }, []);

    return {
        items,
        history,
        genres,
        stats,
        loading,
        addItem,
        updateItem,
        deleteItem,
        addHistory,
        undoLastUpdate,
        addGenre,
        deleteGenre,
        clearAll,
        refresh,
    };
}
