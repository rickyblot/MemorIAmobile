import React from 'react';
import { Download, Share2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const StoryDetailView = ({ story }) => {
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: 'Export started',
      description: `Exporting story as ${format.toUpperCase()}...`,
    });
  };

  const handleShare = () => {
    toast({
      title: 'Share link copied',
      description: 'Story link copied to clipboard',
    });
  };

  if (!story) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Select a story to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-card-foreground font-sans" style={{ letterSpacing: '-0.02em' }}>
              {story.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(story.created).toLocaleDateString()}
              </span>
              {story.tone && <span className="px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">{story.tone}</span>}
              {story.length && <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-lg text-xs font-medium">{story.length}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="font-semibold">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} className="font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="story-layout">
          <div className="whitespace-pre-wrap leading-relaxed text-card-foreground">
            {story.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetailView;