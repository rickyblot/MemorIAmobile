import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpenText, Loader2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import StoryGenerationWithFiles from '@/components/StoryGenerationWithFiles.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

export default function StoryCreationPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const [initialFiles, setInitialFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);

  useEffect(() => {
    const fetchPreSelectedFiles = async () => {
      const selectedIds = location.state?.selectedIds;
      if (selectedIds && Array.isArray(selectedIds) && selectedIds.length > 0) {
        setIsLoadingFiles(true);
        try {
          // Batch fetch the selected memories
          const filter = selectedIds.map(id => `id="${id}"`).join('||');
          const records = await pb.collection('memories').getFullList({ 
            filter, 
            $autoCancel: false 
          });
          setInitialFiles(records);
        } catch (error) {
          console.error("Failed to load pre-selected files:", error);
          toast.error("Failed to load some selected files from the gallery.");
        } finally {
          setIsLoadingFiles(false);
        }
      }
    };

    fetchPreSelectedFiles();
  }, [location.state]);

  return (
    <>
      <Helmet>
        <title>Create Visual Story - MemorIA</title>
        <meta name="description" content="Generate beautiful narrative stories from your uploaded photos and videos." />
      </Helmet>
      
      <Header />
      
      <main className="min-h-[calc(100vh-4rem)] bg-muted/30 py-12 flex flex-col">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
          
          <nav className="mb-8">
            <Link 
              to="/stories" 
              className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors w-fit bg-card border border-border px-4 py-2 rounded-full shadow-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
            </Link>
          </nav>
          
          <header className="mb-12 flex items-start gap-6 bg-card p-8 rounded-3xl border border-border shadow-sm">
            <div className="hidden md:flex w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center shrink-0">
              <BookOpenText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground font-sans tracking-tight mb-3" style={{textWrap: 'balance'}}>
                Create a Visual Story
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                Upload photos and videos to craft a personalized narrative. 
                Our AI analyzes the content—people, emotions, actions, and settings—to weave your memories into a beautiful, cohesive story.
              </p>
            </div>
          </header>

          <ErrorBoundary>
            {isLoadingFiles ? (
              <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border shadow-sm">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium">Loading selected media...</p>
              </div>
            ) : (
              <StoryGenerationWithFiles initialFiles={initialFiles} />
            )}
          </ErrorBoundary>
          
        </div>
      </main>
      
      <Footer />
    </>
  );
}