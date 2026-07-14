import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import GalleryFileSelector from '@/components/GalleryFileSelector.jsx';
import StoryDisplayEditor from '@/components/StoryDisplayEditor.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useStoryGenerationHandler } from '@/hooks/useStoryGenerationHandler.js';
import { useStorySaveHandler } from '@/hooks/useStorySaveHandler.js';

export default function StoryFromGalleryPage() {
  const { currentUser } = useAuth();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false);

  const { 
    files, 
    isLoadingFiles, 
    fetchFiles, 
    generateStory, 
    messages, 
    isStreaming, 
    isPreparingFiles 
  } = useStoryGenerationHandler();

  const { saveStory, isSaving } = useStorySaveHandler();

  useEffect(() => {
    if (currentUser?.id) {
      fetchFiles(currentUser.id);
    }
  }, [currentUser, fetchFiles]);

  const handleGenerate = () => {
    const selectedRecords = files.filter(f => selectedIds.has(f.id));
    setHasStartedGeneration(true);
    generateStory(selectedRecords, currentLanguage);
  };

  const handleSave = async (title, content) => {
    const savedRecord = await saveStory(title, content, Array.from(selectedIds), currentUser.id);
    if (savedRecord) {
      navigate('/stories');
    }
  };

  return (
    <>
      <Helmet>
        <title>Story from Gallery - MemorIA</title>
        <meta name="description" content="Generate an AI story from your gallery files." />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-muted/20 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </nav>

          <header className="mb-10 max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-4xl font-serif font-extrabold text-foreground text-balance">
                Create Story from Gallery
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Select files from your personal gallery, and let our AI weave them into a memorable narrative.
            </p>
          </header>

          <ErrorBoundary>
            {isLoadingFiles ? (
              <div className="flex flex-col items-center justify-center p-20 bg-card rounded-3xl border border-border shadow-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium">Loading your gallery...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-3xl border border-border shadow-sm">
                <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-foreground mb-3 font-serif">Your Gallery is Empty</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Upload some photos or videos first to generate amazing stories from your memories.
                </p>
                <Button asChild size="lg" className="font-semibold shadow-md">
                  <Link to="/gallery">Go to Media Gallery</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* File Selection Section */}
                <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
                  <GalleryFileSelector 
                    files={files} 
                    selectedIds={selectedIds} 
                    onSelectionChange={setSelectedIds} 
                  />
                  
                  <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      {selectedIds.size} file(s) selected
                    </p>
                    <Button 
                      onClick={handleGenerate} 
                      disabled={selectedIds.size === 0 || isPreparingFiles || isStreaming}
                      size="lg"
                      className="w-full sm:w-auto font-bold px-8"
                    >
                      {isPreparingFiles || isStreaming ? (
                        <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
                      ) : (
                        <><Sparkles className="w-5 h-5 mr-2" /> Generate Story</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* AI Result Section */}
                {(hasStartedGeneration || messages.length > 0) && (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <StoryDisplayEditor 
                      messages={messages}
                      isStreaming={isStreaming}
                      onSave={handleSave}
                      isSaving={isSaving}
                      onRegenerate={handleGenerate}
                    />
                  </div>
                )}
              </div>
            )}
          </ErrorBoundary>

        </div>
      </main>

      <Footer />
    </>
  );
}