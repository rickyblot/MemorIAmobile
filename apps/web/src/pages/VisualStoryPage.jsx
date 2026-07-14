import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FileSelector from '@/components/FileSelector.jsx';
import ImagePreviewStrip from '@/components/ImagePreviewStrip.jsx';
import VisualStoryGenerator from '@/components/VisualStoryGenerator.jsx';
import { useVisualStoryGeneration } from '@/hooks/useVisualStoryGeneration.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function VisualStoryPage() {
  const { t } = useLanguage();
  const [selectedIds, setSelectedIds] = useState([]);
  const [availableMemories, setAvailableMemories] = useState([]);
  const { 
    selectImages, 
    removeImage, 
    generateStory, 
    regenerateStory, 
    saveStory, 
    messages, 
    isStreaming, 
    isPreparingFiles 
  } = useVisualStoryGeneration();

  const handleSelectionChange = (ids) => {
    setSelectedIds(ids);
    const selected = availableMemories.filter(m => ids.includes(m.id));
    selectImages(selected);
  };

  const handleRemoveImage = (id) => {
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    removeImage(id);
  };

  return (
    <>
      <Helmet><title>{t('stories.create')} - MemorIA</title></Helmet>
      <Header />
      <main className="min-h-screen bg-muted/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back')}
            </Link>
          </nav>

          <header className="mb-10 max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-serif font-extrabold text-foreground text-balance">
                {t('stories.create')}
              </h1>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 space-y-8">
              <ImagePreviewStrip memories={availableMemories.filter(m => selectedIds.includes(m.id))} onRemove={handleRemoveImage} />
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h2 className="font-semibold text-foreground">{t('gallery.title')}</h2>
                </div>
                <div className="p-4">
                  <FileSelector selectedIds={selectedIds} onSelectionChange={handleSelectionChange} onMemoriesLoaded={setAvailableMemories} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <VisualStoryGenerator 
                selectedMemories={availableMemories.filter(m => selectedIds.includes(m.id))} 
                isPreparingFiles={isPreparingFiles} 
                generateStory={generateStory} 
                regenerateStory={regenerateStory} 
                saveStory={saveStory} 
                messages={messages} 
                isStreaming={isStreaming} 
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}