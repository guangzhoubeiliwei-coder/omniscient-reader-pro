import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Dashboard } from './Dashboard';
import { LibraryPage } from './LibraryPage';
import { GenresPage } from './GenresPage';
import { AddItemPage } from './AddItemPage';
import { InsightsPage } from './InsightsPage';
import { SettingsPage } from './SettingsPage';
import { ItemDetailPage } from './ItemDetailPage';
import { useReaderStore } from '@/hooks/useReaderStore';
import { ReaderItem } from '@/data/schema/ReaderItem';
import { Genre } from '@/data/schema/Genre';
import { generateId } from '@/lib/id';

type TabId = 'dashboard' | 'library' | 'genres' | 'add' | 'insights' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const store = useReaderStore();

  const selectedItem = selectedItemId
    ? store.items.find(i => i.id === selectedItemId)
    : null;

  const handleAddNew = () => {
    setActiveTab('add');
  };

  const handleCloseAdd = () => {
    setActiveTab('dashboard');
  };

  const handleAddItem = async (item: ReaderItem) => {
    await store.addItem(item);
    setActiveTab('dashboard');
  };

  const handleAddGenre = async (genre: Genre) => {
    await store.addGenre(genre);
  };

  const handleClearData = async () => {
    await store.clearAll();
  };

  const handleViewItem = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleCloseDetail = () => {
    setSelectedItemId(null);
  };

  const handleUpdateItem = async (item: ReaderItem) => {
    await store.updateItem(item);
  };

  const handleDeleteItem = async (id: string) => {
    await store.deleteItem(id);
    setSelectedItemId(null);
  };

  if (store.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Show item detail if selected
  if (selectedItem) {
    return (
      <ItemDetailPage
        item={selectedItem}
        history={store.history}
        onClose={handleCloseDetail}
        onUpdate={handleUpdateItem}
        onDelete={handleDeleteItem}
        onAddHistory={store.addHistory}
        onUndo={store.undoLastUpdate}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard items={store.items} stats={store.stats} onAddNew={handleAddNew} onViewItem={handleViewItem} />;
      case 'library':
        return <LibraryPage items={store.items} onViewItem={handleViewItem} />;
      case 'genres':
        return <GenresPage genres={store.genres} items={store.items} onAddGenre={handleAddGenre} />;
      case 'add':
        return <AddItemPage onClose={handleCloseAdd} onSave={handleAddItem} genres={store.genres} />;
      case 'insights':
        return <InsightsPage items={store.items} history={store.history} />;
      case 'settings':
        return <SettingsPage items={store.items} onClearData={handleClearData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
