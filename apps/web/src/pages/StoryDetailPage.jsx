import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { ArrowLeft, Printer, Share2, Download, Image as ImageIcon, Film, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import pb from '@/lib/pocketbaseClient.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { toast } from 'sonner';

export default function StoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchStoryAndMemories = async () => {
      try {
        const record = await pb.collection('stories').getOne(id, { $autoCancel: false });
        setStory(record);

        if (record.memories_used && record.memories_used.length > 0) {
          const filters = record.memories_used.map(mId => `id="${mId}"`).join(' || ');
          const memRecords = await pb.collection('memories').getFullList({
            filter: filters,
            $autoCancel: false
          });
          setMemories(memRecords);
        }
      } catch (err) {
        console.error(err);
        toast.error(t('stories.detailNotFound') || 'Story not found');
      } finally {
        setLoading(false);
      }
    };
    fetchStoryAndMemories();
  }, [id, t]);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await pb.collection('stories').delete(id, { $autoCancel: false });
      toast.success('Story deleted successfully');
      navigate('/stories');
    } catch (err) {
      toast.error('Failed to delete story');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.createElement("a");
      const file = new Blob([`${story.title}\n\n${story.content}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'story'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Story downloaded successfully');
    } catch (err) {
      toast.error('Failed to download story');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Story link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans text-xl bg-background">
        <p className="text-muted-foreground mb-4">{t('stories.detailNotFound') || 'Story not found'}</p>
        <Button onClick={() => navigate('/stories')} variant="default" className="font-semibold">Return to Library</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{story.title || 'Story'} - MemorIA</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-muted/20 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <Button variant="ghost" onClick={() => navigate('/stories')} className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-0 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t('stories.library') || 'Back to Stories'}
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/stories/${id}/edit`)} className="font-semibold bg-background">
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()} className="font-semibold bg-background">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading} className="font-semibold bg-background">
                {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare} className="font-semibold bg-background">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)} className="font-semibold">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <article className="lg:col-span-8 bg-card rounded-3xl p-8 sm:p-12 shadow-sm border border-border">
              <header className="mb-10 text-center border-b border-border pb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold font-sans text-foreground mb-4" style={{textWrap: 'balance'}}>
                  {story.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>{new Date(story.created).toLocaleDateString()}</span>
                  {story.story_format && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>{story.story_format}</span>
                    </>
                  )}
                  {story.generated_by_ai && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-primary font-bold">AI Generated</span>
                    </>
                  )}
                </div>
              </header>
              
              <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {story.content}
              </div>
            </article>

            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm sticky top-24">
                <h3 className="font-bold font-sans text-foreground mb-4 text-lg">Visual Inspiration</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  This narrative was generated based on specific details found within these memories.
                </p>

                {memories.length === 0 ? (
                  <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground text-sm border border-dashed">
                    No visual media attached to this story.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 pb-2">
                    {memories.map((m) => {
                      const isVideo = m.event_category === 'video' || !!m.video_file;
                      const fileName = Array.isArray(m.file) ? m.file[0] : m.file;
                      const thumbUrl = (m.event_category === 'photo' && fileName)
                        ? pb.files.getURL(m, fileName, { thumb: '200x200' })
                        : null;

                      return (
                        <div key={m.id} className="group relative aspect-square rounded-xl overflow-hidden bg-muted border border-border">
                          {thumbUrl ? (
                            <img 
                              src={thumbUrl} 
                              alt={m.title || 'Memory'} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                          ) : isVideo ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[hsl(var(--file-video))]">
                              <Film className="w-8 h-8 mb-2 opacity-70" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                            <span className="text-white text-xs font-medium truncate w-full shadow-sm">
                              {m.title || 'Untitled'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
          
        </div>
      </main>
      <Footer />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{story.title || 'this story'}" from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}