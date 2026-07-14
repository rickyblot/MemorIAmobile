import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Type, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function StoryDisplay({ 
  streamedContent, 
  isStreaming, 
  title, 
  setTitle, 
  localContent, 
  setLocalContent,
  isEditing,
  hasGenerated
}) {
  const [prevStreamingState, setPrevStreamingState] = useState(false);

  // Sync stream to local content when NOT editing
  useEffect(() => {
    if (!isEditing && isStreaming) {
      setLocalContent(streamedContent);
    }
    // Also catch the final chunk when streaming finishes
    if (!isStreaming && prevStreamingState && !isEditing) {
      setLocalContent(streamedContent);
      toast.success('Visual narrative generation complete.', {
        icon: <Sparkles className="w-4 h-4 text-primary" />
      });
    }
    setPrevStreamingState(isStreaming);
  }, [streamedContent, isStreaming, isEditing, prevStreamingState, setLocalContent]);

  if (!hasGenerated && !isStreaming) {
    return null;
  }

  const wordCount = localContent.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = localContent.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="bg-card border border-border shadow-lg rounded-2xl overflow-hidden mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a title for your story..."
          className="text-xl md:text-2xl font-serif font-bold h-auto py-2 px-3 border-transparent hover:border-border focus-visible:ring-primary focus-visible:border-border transition-colors bg-transparent shadow-none"
          disabled={isStreaming}
        />
        
        {isStreaming && (
          <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <span className="relative flex h-2.5 w-2.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            AI is writing...
          </span>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <Textarea 
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            className="min-h-[400px] text-lg font-serif leading-relaxed resize-y bg-background border-border focus-visible:ring-primary p-4 shadow-inner"
            placeholder="Your story content..."
            disabled={isStreaming}
          />
        ) : (
          <div className="min-h-[400px] prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed text-foreground whitespace-pre-wrap">
            {localContent || <span className="text-muted-foreground italic">Waiting for inspiration...</span>}
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-muted/10 border-t border-border flex items-center justify-between text-sm font-medium text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Type className="w-4 h-4" /> {wordCount} words</span>
          <span className="hidden sm:inline-block">•</span>
          <span className="hidden sm:inline-block">{charCount} characters</span>
        </div>
        <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md border border-border shadow-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span>~{readingTime} min read</span>
        </div>
      </div>
    </div>
  );
}