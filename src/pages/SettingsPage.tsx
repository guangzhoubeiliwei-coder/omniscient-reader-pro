import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { ChevronRight, Palette, Bell, Database, Shield, Download, Upload, Trash2, AlertTriangle, Search } from 'lucide-react';
import { ReadingItem } from '@/types/reading';

interface SettingItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({ icon: Icon, label, description, onClick, danger }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors text-left"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${danger ? 'bg-destructive/10' : 'bg-muted'}`}>
        <Icon className={`w-5 h-5 ${danger ? 'text-destructive' : 'text-foreground'}`} />
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${danger ? 'text-destructive' : 'text-foreground'}`}>{label}</h3>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

interface SettingsPageProps {
  items: ReadingItem[];
  onClearData: () => void;
}

export function SettingsPage({ items, onClearData }: SettingsPageProps) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExport = async () => {
    const { downloadBackup } = await import('@/data/store/backup');
    await downloadBackup();
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        const { importData } = await import('@/data/store/backup');
        const result = await importData(data);

        if (result.success) {
          setImportSuccess(true);
          setTimeout(() => {
            setImportSuccess(false);
            window.location.reload(); // Reload to refresh data
          }, 2000);
        } else {
          setImportError(result.error || 'Import failed');
          setTimeout(() => setImportError(null), 5000);
        }
      } catch (error) {
        setImportError('Invalid backup file');
        setTimeout(() => setImportError(null), 5000);
      }
    };

    input.click();
  };

  const handleReset = () => {
    onClearData();
    setShowConfirmReset(false);
  };

  return (
    <PageContainer>
      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Reset All Data?</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete all your library items, custom genres, and reading history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 bg-muted text-foreground rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-medium"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your experience</p>
      </div>

      {/* Import Success/Error Messages */}
      {importSuccess && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
          <p className="text-sm text-green-500">✓ Import successful! Reloading...</p>
        </div>
      )}
      {importError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
          <p className="text-sm text-destructive">✗ {importError}</p>
        </div>
      )}

      {/* Appearance */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Appearance
        </h2>
        <div className="space-y-2">
          <SettingItem
            icon={Palette}
            label="Theme & Colors"
            description="AMOLED black, accent colors"
          />
        </div>
      </div>

      {/* Behavior */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Behavior
        </h2>
        <div className="space-y-2">
          <SettingItem
            icon={Bell}
            label="Reminders"
            description="Local reading reminders"
          />
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Search
        </h2>
        <div className="space-y-2">
          <SettingItem
            icon={Search}
            label="Search Sources"
            description="MangaDex, AniList, Jikan enabled"
          />
          <SettingItem
            icon={Database}
            label="Clear Search Cache"
            description="Remove cached search results"
            onClick={async () => {
              const { clearSearchCache } = await import('@/services/search/orchestrator');
              await clearSearchCache();
            }}
          />
        </div>
      </div>

      {/* Data */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Data ({items.length} items)
        </h2>
        <div className="space-y-2">
          <SettingItem
            icon={Download}
            label="Export Data"
            description="Download your library as JSON"
            onClick={handleExport}
          />
          <SettingItem
            icon={Upload}
            label="Import Data"
            description="Restore from backup"
            onClick={handleImport}
          />
          <SettingItem
            icon={Database}
            label="Storage"
            description="Manage local data"
          />
        </div>
      </div>

      {/* Advanced */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Advanced
        </h2>
        <div className="space-y-2">
          <SettingItem
            icon={Shield}
            label="API Settings"
            description="Configure search sources"
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mb-6">
        <h2 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-3">
          Danger Zone
        </h2>
        <div className="space-y-2">
          <SettingItem
            icon={Trash2}
            label="Reset All Data"
            description="Delete everything permanently"
            danger
            onClick={() => setShowConfirmReset(true)}
          />
        </div>
      </div>

      {/* About */}
      <div className="text-center py-6">
        <p className="text-xs text-muted-foreground">Omniscient Reader v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">Offline-first • No tracking • Your data, your control</p>
      </div>
    </PageContainer>
  );
}
