import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ReadingType, ReadingStatus, ReadingItem, Genre } from '@/types/reading';
import { X, Search, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/id';
import { OnlineSearchModal } from '@/components/search/OnlineSearchModal';

interface AddItemPageProps {
  onClose: () => void;
  onSave: (item: ReadingItem) => void;
  genres: Genre[];
}

const types: { value: ReadingType; label: string }[] = [
  { value: 'manga', label: 'Manga' },
  { value: 'manhwa', label: 'Manhwa' },
  { value: 'manhua', label: 'Manhua' },
  { value: 'novel', label: 'Novel' },
  { value: 'webtoon', label: 'Webtoon' },
  { value: 'comic', label: 'Comic' },
  { value: 'other', label: 'Other' },
];

const statuses: { value: ReadingStatus; label: string }[] = [
  { value: 'reading', label: 'Reading' },
  { value: 'completed', label: 'Completed' },
  { value: 'planned', label: 'Planned' },
  { value: 'paused', label: 'Paused' },
  { value: 'dropped', label: 'Dropped' },
];

export function AddItemPage({ onClose, onSave, genres }: AddItemPageProps) {
  const [showOnlineSearch, setShowOnlineSearch] = useState(false);
  const [title, setTitle] = useState('');
  const [coverImagePath, setCoverImagePath] = useState('');
  const [type, setType] = useState<ReadingType>('manga');
  const [status, setStatus] = useState<ReadingStatus>('reading');
  const [currentChapter, setCurrentChapter] = useState('');
  const [totalChapters, setTotalChapters] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState('');
  const [notes, setNotes] = useState('');

  const toggleGenre = (genreName: string) => {
    setSelectedGenres(prev =>
      prev.includes(genreName)
        ? prev.filter(g => g !== genreName)
        : [...prev, genreName]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const now = Date.now();
    const newItem: ReadingItem = {
      id: generateId(),
      title: title.trim(),
      altTitles: [],
      type,
      status,
      currentChapter: parseInt(currentChapter) || 0,
      totalChapters: totalChapters ? parseInt(totalChapters) : undefined,
      rating: rating || undefined,
      genres: selectedGenres,
      customGenres: [],
      tags: [],
      coverImagePath: coverImagePath.trim() || undefined,
      notes: notes || undefined,
      readingUrls: [],
      history: [],
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      lastReadAt: status === 'reading' ? now : undefined,
    };

    onSave(newItem);
  };

  return (
    <PageContainer className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Add New</h1>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setShowOnlineSearch(false)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors",
            !showOnlineSearch
              ? "bg-primary/10 border border-primary/30 text-primary"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Wand2 className="w-4 h-4" />
          <span className="text-sm font-medium">Manual Entry</span>
        </button>
        <button
          onClick={() => setShowOnlineSearch(true)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-colors",
            showOnlineSearch
              ? "bg-primary/10 border border-primary/30 text-primary"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <Search className="w-4 h-4" />
          <span className="text-sm font-medium">Online Search</span>
        </button>
      </div>

      {showOnlineSearch && (
        <OnlineSearchModal onClose={() => setShowOnlineSearch(false)} onImport={onSave} />
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Cover Image</label>
          <div className="flex gap-3">
            {coverImagePath && (
              <div className="w-20 h-28 rounded-lg overflow-hidden bg-muted shrink-0">
                <img src={coverImagePath} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCoverImagePath(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">Upload an image from your device</p>
              {coverImagePath && (
                <button
                  onClick={() => setCoverImagePath('')}
                  className="text-xs text-destructive mt-1 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  type === t.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  status === s.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Current Chapter
            </label>
            <input
              type="number"
              placeholder="0"
              value={currentChapter}
              onChange={(e) => setCurrentChapter(e.target.value)}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Total Chapters
            </label>
            <input
              type="number"
              placeholder="Optional"
              value={totalChapters}
              onChange={(e) => setTotalChapters(e.target.value)}
              className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Genres</label>

          {/* Popular Genres */}
          <div className="flex flex-wrap gap-2 mb-3">
            {['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Isekai', 'Martial Arts', 'School Life', 'Historical', 'Psychological', 'Tragedy'].map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  if (selectedGenres.includes(genre)) {
                    setSelectedGenres(selectedGenres.filter(g => g !== genre));
                  } else {
                    setSelectedGenres([...selectedGenres, genre]);
                  }
                }}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
                  selectedGenres.includes(genre)
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
                  if (!selectedGenres.includes(customGenre.trim())) {
                    setSelectedGenres([...selectedGenres, customGenre.trim()]);
                  }
                  setCustomGenre('');
                }
              }}
              className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={() => {
                if (customGenre.trim() && !selectedGenres.includes(customGenre.trim())) {
                  setSelectedGenres([...selectedGenres, customGenre.trim()]);
                  setCustomGenre('');
                }
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Add
            </button>
          </div>

          {/* Selected Genres */}
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
              {selectedGenres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs flex items-center gap-1"
                >
                  {genre}
                  <button
                    onClick={() => setSelectedGenres(selectedGenres.filter(g => g !== genre))}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Rating ({rating}/5)
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <span className="text-3xl">
                  {rating >= star ? '⭐' : '☆'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Notes</label>
          <textarea
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium mt-4 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Library
        </button>
      </div>
    </PageContainer>
  );
}
