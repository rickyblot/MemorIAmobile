import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { PenTool, BookOpen } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import StoryCard from '@/components/StoryCard.jsx';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, [currentUser]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('stories').getList(1, 50, {
        filter: `userId="${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setStories(records.items);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load stories.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('stories').delete(id, { $autoCancel: false });
      setStories(prev => prev.filter(s => s.id !== id));
      toast.success('Story deleted successfully.');
    } catch (err) {
      toast.error('Error deleting story.');
    }
  };

  return (
    <>
      <Helmet>
        <title>My Stories - MemorIA</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-foreground font-sans tracking-tight flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-primary" />
                AI Generated Stories
              </h1>
              <p className="text-muted-foreground mt-2">Beautiful narratives woven from your memories.</p>
            </div>
            <Button onClick={() => navigate('/stories/create')} className="font-bold shadow-sm h-12 px-6 text-base">
              <PenTool className="w-5 h-5 mr-2" /> Generate New Story
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(n => (
                <div key={n} className="bg-card rounded-2xl p-6 border shadow-sm">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-24 bg-muted/30 rounded-3xl border border-dashed border-border">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2 font-sans">Your bookshelf is empty</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Let AI turn your scattered memories into beautifully written stories to share with family.</p>
              <Button onClick={() => navigate('/stories/create')} variant="default" className="font-semibold">
                Create your first story
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map(story => (
                <StoryCard key={story.id} story={story} onDelete={handleDelete} />
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}