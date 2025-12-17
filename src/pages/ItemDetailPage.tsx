/**
 * Item Detail Page - Fully Editable
 * All fields can be edited directly
 */

import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ReadingItem, ReadingStatus, ReadingType } from '@/types/reading';
import { HistoryEntry } from '@/data/schema/HistoryEntry';
import { X, Undo2, Trash2, Upload, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/id';

interface ItemDetailPageProps {
    item: ReadingItem;
    history: HistoryEntry[];
    onClose: () => void;
    onUpdate: (item: ReadingItem) => void;
    onDelete: (id: string) => void;
    onAddHistory: (entry: HistoryEntry) => void;
    onUndo: (itemId: string) => void;
}

const STATUSES: ReadingStatus[] = ['reading', 'completed', 'planned', 'paused', 'dropped'];
const TYPES: ReadingType[] = ['manga', 'manhwa', 'manhua', 'novel', 'webtoon', 'comic', 'other'];
const POPULAR_GENRES = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance',
    'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Isekai',
    'Martial Arts', 'School Life', 'Historical', 'Psychological', 'Tragedy'
];

export function ItemDetailPage({
    item,
    history,
    onClose,
    onUpdate,
    onDelete,
    onAddHistory,
    onUndo,
}: ItemDetailPageProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customGenre, setCustomGenre] = useState('');

    const itemHistory = history.filter(h => h.itemId === item.id).sort((a, b) => b.timestamp - a.timestamp);
    const canUndo = itemHistory.length > 0;

    const handleProgressUpdate = (newChapter: number) => {
        if (newChapter === item.currentChapter) return;

        const entry: HistoryEntry = {
            id: generateId(),
            itemId: item.id,
            fromChapter: item.currentChapter,
            toChapter: newChapter,
            timestamp: Date.now(),
        };

        onAddHistory(entry);
        onUpdate({
            ...item,
            currentChapter: newChapter,
            updatedAt: Date.now(),
            lastReadAt: Date.now(),
        });
    };

    const handleUpdate = (updates: Partial<ReadingItem>) => {
        onUpdate({
            ...item,
            ...updates,
            updatedAt: Date.now(),
        });
    };

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleUpdate({ coverImagePath: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUndo = () => {
        onUndo(item.id);
    };

    const handleDelete = () => {
        onDelete(item.id);
        onClose();
    };

    const progress = item.totalChapters
        ? Math.round((item.currentChapter / item.totalChapters) * 100)
        : 0;

    return (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
            <PageContainer>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-foreground">Edit Item</h1>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Cover Image */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">Cover Image</label>
                    <div className="flex gap-3">
                        {item.coverImagePath && (
                            <div className="w-24 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                                <img src={item.coverImagePath} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                            />
                            <p className="text-xs text-muted-foreground mt-1">Upload new cover image</p>
                            {item.coverImagePath && (
                                <button
                                    onClick={() => handleUpdate({ coverImagePath: undefined })}
                                    className="text-xs text-destructive mt-1 hover:underline"
                                >
                                    Remove image
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                    <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdate({ title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground"
                    />
                </div>

                {/* Type */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
                    <div className="flex flex-wrap gap-2">
                        {TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => handleUpdate({ type })}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                                    item.type === type
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
                    <div className="flex flex-wrap gap-2">
                        {STATUSES.map((status) => (
                            <button
                                key={status}
                                onClick={() => handleUpdate({ status })}
                                className={cn(
                                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                                    item.status === status
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-4 bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Progress</span>
                        <span className="text-sm text-muted-foreground">
                            {item.currentChapter} / {item.totalChapters || '?'}
                            {item.totalChapters && ` (${progress}%)`}
                        </span>
                    </div>

                    {item.totalChapters && (
                        <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Current Chapter</label>
                            <input
                                type="number"
                                value={item.currentChapter}
                                onChange={(e) => handleProgressUpdate(parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                min="0"
                                max={item.totalChapters || undefined}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Total Chapters</label>
                            <input
                                type="number"
                                value={item.totalChapters || ''}
                                onChange={(e) => handleUpdate({ totalChapters: parseInt(e.target.value) || undefined })}
                                placeholder="Optional"
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                                min="0"
                            />
                        </div>
                    </div>

                    {canUndo && (
                        <button
                            onClick={handleUndo}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80"
                        >
                            <Undo2 className="w-4 h-4" />
                            Undo Last Update
                        </button>
                    )}
                </div>

                {/* Rating (5 stars) */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                        Rating ({item.rating || 0}/5)
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleUpdate({ rating: star })}
                                className="p-1"
                            >
                                <Star
                                    className={cn(
                                        'w-8 h-8 transition-colors',
                                        (item.rating || 0) >= star
                                            ? 'text-primary fill-primary'
                                            : 'text-muted-foreground'
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Genres */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Genres</label>

                    {/* Popular Genres */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {POPULAR_GENRES.map((genre) => (
                            <button
                                key={genre}
                                onClick={() => {
                                    const genres = item.genres.includes(genre)
                                        ? item.genres.filter(g => g !== genre)
                                        : [...item.genres, genre];
                                    handleUpdate({ genres });
                                }}
                                className={cn(
                                    'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                                    item.genres.includes(genre)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    {/* Custom Genre Input */}
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Add custom genre..."
                            value={customGenre}
                            onChange={(e) => setCustomGenre(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && customGenre.trim()) {
                                    if (!item.genres.includes(customGenre.trim())) {
                                        handleUpdate({ genres: [...item.genres, customGenre.trim()] });
                                    }
                                    setCustomGenre('');
                                }
                            }}
                            className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm"
                        />
                        <button
                            onClick={() => {
                                if (customGenre.trim() && !item.genres.includes(customGenre.trim())) {
                                    handleUpdate({ genres: [...item.genres, customGenre.trim()] });
                                    setCustomGenre('');
                                }
                            }}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                        >
                            Add
                        </button>
                    </div>

                    {/* Selected Genres */}
                    {item.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
                            {item.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs flex items-center gap-1"
                                >
                                    {genre}
                                    <button
                                        onClick={() => handleUpdate({ genres: item.genres.filter(g => g !== genre) })}
                                        className="hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-1.5">Notes</label>
                    <textarea
                        value={item.notes || ''}
                        onChange={(e) => handleUpdate({ notes: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 bg-card border border-border rounded-xl text-sm resize-none"
                        placeholder="Add notes..."
                    />
                </div>

                {/* History Log */}
                {itemHistory.length > 0 && (
                    <div className="mb-6 bg-card border border-border rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Reading History</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {itemHistory.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between text-xs py-2 border-b border-border last:border-0"
                                >
                                    <span className="text-muted-foreground">
                                        Ch {entry.fromChapter} → {entry.toChapter}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {new Date(entry.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Danger Zone */}
                <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-destructive mb-2">Danger Zone</h3>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Item
                    </button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm">
                            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Item?</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                This will permanently delete "{item.title}" and all its reading history. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2 bg-muted text-foreground rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </PageContainer>
        </div>
    );
}
