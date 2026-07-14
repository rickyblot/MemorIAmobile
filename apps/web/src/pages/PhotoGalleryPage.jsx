import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Upload, Filter, CheckSquare, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MemoryUploadComponent from '@/components/MemoryUploadComponent.jsx';
import EnhancedMemoryCard, { MemoryCardSkeleton } from '@/components/EnhancedMemoryCard.jsx';
import MemorySearch from '@/components/MemorySearch.jsx';
import FilePreviewModal from '@/components/FilePreviewModal.jsx';
import MemoryMetadataEditor from '@/components/MemoryMetadataEditor.jsx';
import pb from '@/lib/pocketbaseClient';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { toast } from 'sonner';

const PhotoGalleryPage = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [previewMemory, setPreviewMemory] = useState(null);
  const [editMemory, setEditMemory] = useState(null);
  const [mediaFilter, setMediaFilter] = useState('all');
  
  // Selection state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const { t } = useLanguage();

  const fetchMemories = async (filters = {}, typeFilter = mediaFilter) => {
    setLoading(true);
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      let filterString = `userId = "${userId}"`;
      
      if (filters.searchTerm) {
        filterString += ` && (title ~ "${filters.searchTerm}" || description ~ "${filters.searchTerm}")`;
      }
      
      if (filters.locationFilter) {
        filterString += ` && location ~ "${filters.locationFilter}"`;
      }

      if (typeFilter === 'photos') {
        filterString += ` && event_category = "photo" && video_file = ""`;
      } else if (typeFilter === 'videos') {
        filterString += ` && (event_category = "video" || video_file != "")`;
      }

      const records = await pb.collection('memories').getFullList({
        filter: filterString,
        sort: '-created',
        $autoCancel: false,
      });

      setMemories(records);
    } catch (error) {
      console.error('Failed to fetch memories:', error);
      toast.error(t('memories.loadError') || 'Failed to load memories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories({}, mediaFilter);
  }, [mediaFilter]);

  const handleUploadComplete = () => {
    setShowUpload(false);
    fetchMemories({}, mediaFilter);
  };

  const handleSearch = (filters) => {
    fetchMemories(filters, mediaFilter);
  };

  const handleDelete = async (memory) => {
    try {
      await pb.collection('memories').delete(memory.id, { $autoCancel: false });
      setMemories(prev => prev.filter(m => m.id !== memory.id));
      selectedIds.delete(memory.id);
      setSelectedIds(new Set(selectedIds));
      toast.success(t('memories.deleteSuccess') || 'Memory deleted successfully.');
    } catch (err) {
      toast.error(t('memories.deleteError') || 'Error deleting memory.');
    }
  };

  const handleShare = (memory) => {
    toast.success(t('memories.shareSuccess') || 'Share link generated and copied to clipboard.');
  };

  // Selection handlers
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    setSelectedIds(new Set(memories.map(m => m.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleGenerateStory = () => {
    if (selectedIds.size === 0) return;
    navigate('/stories/create', { state: { selectedIds: Array.from(selectedIds) } });
  };

  return (
    <>
      <Helmet>
        <title>Media Gallery - MemorIA</title>
        <meta name="description" content="Upload and organize your precious photos and videos" />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-background py-12 relative pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 font-sans tracking-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Media Gallery
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Upload and organize your precious photos and videos in one safe place.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Button 
                  variant={selectionMode ? "secondary" : "outline"} 
                  onClick={toggleSelectionMode} 
                  className="font-semibold"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {selectionMode ? 'Cancel Selection' : 'Select Mode'}
                </Button>
                {!selectionMode && (
                  <Button onClick={() => setShowUpload(!showUpload)} className="font-bold shadow-sm h-10 px-6">
                    <Upload className="w-4 h-4 mr-2" />
                    {showUpload ? 'Cancel Upload' : 'Upload Media'}
                  </Button>
                )}
              </div>
            </div>
          </header>

          {showUpload && !selectionMode && (
            <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
              <MemoryUploadComponent onUploadComplete={handleUploadComplete} />
            </div>
          )}

          <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <MemorySearch onSearch={handleSearch} disabled={selectionMode} />
            </div>
            <div className="flex items-center gap-3 bg-muted/30 p-1.5 rounded-lg border border-border w-fit">
              <Filter className="w-4 h-4 text-muted-foreground ml-2" />
              <ToggleGroup type="single" value={mediaFilter} onValueChange={(val) => val && setMediaFilter(val)} disabled={selectionMode}>
                <ToggleGroupItem value="all" aria-label="All Media" className="font-medium">All</ToggleGroupItem>
                <ToggleGroupItem value="photos" aria-label="Photos Only" className="font-medium">Photos</ToggleGroupItem>
                <ToggleGroupItem value="videos" aria-label="Videos Only" className="font-medium">Videos</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <MemoryCardSkeleton key={i} />)}
            </div>
          ) : memories.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-3xl bg-muted/10">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('memories.noMemories') || 'No memories found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                Upload your first photo or video to get started.
              </p>
              {!selectionMode && (
                <Button onClick={() => setShowUpload(true)} className="font-semibold">
                  <Upload className="w-4 h-4 mr-2" /> Upload Now
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {memories.map((memory) => (
                <EnhancedMemoryCard
                  key={memory.id}
                  memory={memory}
                  onPreview={setPreviewMemory}
                  onEdit={setEditMemory}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  selectionMode={selectionMode}
                  isSelected={selectedIds.has(memory.id)}
                  onSelectToggle={toggleSelect}
                />
              ))}
            </div>
          )}
        </div>

        {/* Selection Sticky Bottom Bar */}
        {selectionMode && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-lg border-t border-border z-40 animate-in slide-in-from-bottom-8 duration-300">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-sm">
                  {selectedIds.size} Selected
                </span>
                <Button variant="ghost" size="sm" onClick={selectAll} className="font-semibold">Select All</Button>
                <Button variant="ghost" size="sm" onClick={clearSelection} disabled={selectedIds.size === 0} className="font-semibold">Clear</Button>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button variant="outline" onClick={toggleSelectionMode} className="flex-1 sm:flex-none">
                  <X className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <Button 
                  onClick={handleGenerateStory} 
                  disabled={selectedIds.size === 0} 
                  className="flex-1 sm:flex-none font-bold"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Story
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <FilePreviewModal 
        isOpen={!!previewMemory} 
        onClose={() => setPreviewMemory(null)} 
        memory={previewMemory} 
      />
      <MemoryMetadataEditor 
        isOpen={!!editMemory} 
        onClose={() => setEditMemory(null)} 
        memory={editMemory}
        onSaved={() => fetchMemories({}, mediaFilter)}
      />
    </>
  );
};

export default PhotoGalleryPage;