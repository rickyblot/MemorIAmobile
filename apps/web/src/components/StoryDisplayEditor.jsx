import React, { useState, useEffect } from 'react';
import { Loader2, PenLine, RefreshCw, Save, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function StoryDisplayEditor({ 
  messages, 
  isStreaming, 
  onSave, 
  isSaving,
  onRegenerate
}) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [localTitle, setLocalTitle] = useState('My Visual Journey');
  const [localContent, setLocalContent] = useState('');

  // Sync with AI messages
  useEffect(() => {
    const assistantMessage = messages.filter(m => m.role === 'assistant').pop();
    if (assistantMessage && assistantMessage.content) {
      setLocalContent(assistantMessage.content);
      
      // Basic extraction of a title if generated with markdown
      if (!isEditMode && assistantMessage.content.startsWith('# ')) {
         const firstLine = assistantMessage.content.split('\n')[0];
         setLocalTitle(firstLine.replace('# ', '').trim());
      }
    }
  }, [messages, isEditMode]);

  const wordCount = localContent.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  if (!localContent && !isStreaming) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
      <div className="p-6 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold font-serif flex items-center">
          Story Result
        </h2>
        
        <div className="flex gap-2">
          {!isStreaming && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditMode(!isEditMode)} 
                className="font-semibold bg-background"
              >
                <PenLine className="w-4 h-4 mr-2" /> {isEditMode ? 'View Mode' : 'Edit Text'}
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onSave(localTitle, localContent)} 
                disabled={isSaving} 
                className="font-semibold"
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} 
                Save Story
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col relative bg-background">
        <div className="flex flex-col h-full animate-in fade-in duration-500">
          {(isEditMode || !isStreaming) && localContent && (
            <div className="mb-6">
              <Label htmlFor="title" className="sr-only">Story Title</Label>
              <Input 
                id="title"
                value={localTitle} 
                onChange={(e) => setLocalTitle(e.target.value)} 
                className="text-2xl md:text-3xl font-extrabold font-serif h-14 bg-transparent border-transparent hover:border-border focus-visible:bg-muted/50 px-3 -ml-3 transition-colors"
                placeholder="Give your story a title..."
              />
            </div>
          )}

          {isEditMode ? (
            <Textarea 
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
              className="flex-grow min-h-[300px] text-base leading-relaxed resize-none bg-background focus-visible:ring-2 focus-visible:ring-primary/50"
              placeholder="Write your story..."
            />
          ) : (
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap flex-grow font-sans">
              {localContent}
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse align-middle" />
              )}
            </div>
          )}

          {(localContent && !isStreaming) && (
            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {wordCount} words</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readTime} min read</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRegenerate} 
                className="text-muted-foreground hover:text-primary h-auto py-1 px-2"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Regenerate
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}