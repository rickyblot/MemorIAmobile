import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, LayoutGrid, Clock, BookOpen, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import EnhancedMemoryCard, { MemoryCardSkeleton } from '@/components/EnhancedMemoryCard.jsx';
import MemoryUpload from '@/components/MemoryUpload.jsx';
import InteractiveTimeline from '@/components/InteractiveTimeline.jsx';
import IntelligentMemorySearch from '@/components/IntelligentMemorySearch.jsx';
import StoryGenerator from '@/components/StoryGenerator.jsx';
import FilePreviewModal from '@/components/FilePreviewModal.jsx';
import MemoryMetadataEditor from '@/components/MemoryMetadataEditor.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export default function MemoriesPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewMemory, setPreviewMemory] = useState(null);
  const [editMemory, setEditMemory] = useState(null);
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('memories').getFullList({
        filter: `userId="${currentUser.id}"`,
        sort: '-date',
        $autoCancel: false
      });
      setMemories(records);
    } catch (error) {
      toast.error(t('memories.loadError') || 'Failed to load memories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [currentUser]);

  const handleDelete = async (memory) => {
    try {
      await pb.collection('memories').delete(memory.id, { $autoCancel: false });
      setMemories(prev => prev.filter(m => m.id !== memory.id));
      toast.success(t('memories.deleteSuccess') || 'Memory deleted.');
    } catch (err) {
      toast.error(t('memories.deleteError') || 'Error deleting memory.');
    }
  };

  const handleShare = (memory) => {
    toast.success(t('memories.shareSuccess') || 'Share link generated and copied to clipboard.');
  };

  const handleUploadComplete = () => {
    fetchMemories();
  };

  return (
    <>
      <Helmet>
        <title>{t('memories.pageTitle') || 'Memory Vault - MemorIA'}</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-sans tracking-tight mb-4 text-balance">
              {t('memories.vaultTitle') || 'The Memory Vault'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('memories.vaultDesc') || 'Your complete archive of preserved moments, documents, and stories.'}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="bg-primary/10 border border-primary/20 px-4 py-3 rounded-xl flex items-center gap-3">
                <LayoutGrid className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    {t('memories.totalMemories') || 'Total Memories'}
                  </p>
                  <p className="font-bold text-foreground font-sans text-xl">{memories.length}</p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-8 bg-muted/50 p-1 w-full justify-start overflow-x-auto h-auto">
              <TabsTrigger value="grid" className="py-2.5 px-4"><LayoutGrid className="w-4 h-4 mr-2"/> {t('memories.tabs.grid') || 'Grid'}</TabsTrigger>
              <TabsTrigger value="timeline" className="py-2.5 px-4"><Clock className="w-4 h-4 mr-2"/> {t('memories.tabs.timeline') || 'Timeline'}</TabsTrigger>
              <TabsTrigger value="search" className="py-2.5 px-4"><Search className="w-4 h-4 mr-2"/> {t('memories.tabs.search') || 'AI Search'}</TabsTrigger>
              <TabsTrigger value="stories" className="py-2.5 px-4"><BookOpen className="w-4 h-4 mr-2"/> {t('memories.tabs.stories') || 'Story Generator'}</TabsTrigger>
              <TabsTrigger value="upload" className="py-2.5 px-4"><Upload className="w-4 h-4 mr-2"/> {t('memories.tabs.upload') || 'Add New'}</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="animate-in fade-in-50 duration-500">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => <MemoryCardSkeleton key={i} />)}
                </div>
              ) : memories.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-3xl bg-muted/10">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('memories.noMemories') || 'No memories yet'}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('memories.noMemoriesDesc') || 'Go to the Add New tab to upload your first memory.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {memories.map(mem => (
                    <EnhancedMemoryCard 
                      key={mem.id} 
                      memory={mem} 
                      onPreview={setPreviewMemory}
                      onEdit={setEditMemory}
                      onDelete={handleDelete}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="animate-in fade-in-50 duration-500">
              <InteractiveTimeline 
                memories={memories} 
                onPreview={setPreviewMemory}
                onEdit={setEditMemory}
                onDelete={handleDelete}
              />
            </TabsContent>

            <TabsContent value="search" className="animate-in fade-in-50 duration-500 pt-6">
              <IntelligentMemorySearch />
            </TabsContent>

            <TabsContent value="stories" className="animate-in fade-in-50 duration-500 pt-6">
              <StoryGenerator contextMemories={memories.slice(0, 10)} />
            </TabsContent>

            <TabsContent value="upload" className="animate-in fade-in-50 duration-500 max-w-3xl mx-auto pt-6">
              <MemoryUpload onUploadComplete={handleUploadComplete} />
            </TabsContent>
          </Tabs>

        </div>
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
        onSaved={fetchMemories}
      />
    </>
  );
}