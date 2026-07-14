import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';
import IntegratedAiChat from '@/components/integrated-ai-chat.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function StoryGenerator({ contextMemories }) {
  const { messages, isStreaming, sendMessage } = useIntegratedAi();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMemories = async () => {
      if (contextMemories && Array.isArray(contextMemories)) {
        if (isMounted) {
          setMemories(contextMemories);
          setIsLoading(false);
        }
        return;
      }
      
      try {
        setIsLoading(true);
        if (!currentUser?.id) {
          if (isMounted) setIsLoading(false);
          return;
        }
        
        const records = await pb.collection('memories').getList(1, 50, {
          filter: `userId="${currentUser.id}"`,
          sort: '-date',
          $autoCancel: false
        });
        
        if (isMounted) {
          setMemories(records.items || []);
        }
      } catch (error) {
        console.error('StoryGenerator: Failed to fetch memories', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMemories();

    return () => {
      isMounted = false;
    };
  }, [contextMemories, currentUser]);

  const handleGenerate = (format) => {
    setStarted(true);
    const safeMemories = memories ?? [];
    const contextInfo = safeMemories.map(m => `- ${m?.title || 'Untitled'} (${m?.date || 'Unknown date'}): ${m?.description || ''}`).join('\n');
    sendMessage(`Please generate a beautiful story in ${format} format using the following memories as context:\n\n${contextInfo}\n\nMake it engaging and emotional, capturing the essence of these moments.`);
  };

  const handleSaveStory = async () => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'assistant') return;

    try {
      setIsSaving(true);
      await pb.collection('stories').create({
        userId: currentUser.id,
        title: "AI Story - " + new Date().toLocaleDateString(),
        content: lastMsg.content,
      }, { $autoCancel: false });
      
      toast.success("Story saved successfully!");
      navigate('/stories');
    } catch (error) {
      toast.error("Failed to save story. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const memoryCount = memories?.length ?? 0;
  const lastMessage = messages[messages.length - 1];
  const canSave = lastMessage && lastMessage.role === 'assistant' && !isStreaming && lastMessage.content.length > 20;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-card border rounded-3xl shadow-sm">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-6" />
        <p className="text-lg font-medium text-muted-foreground">{t('stories.loadingMemories') || 'Gathering your memories...'}</p>
      </div>
    );
  }

  if (memoryCount === 0) {
    return (
      <div className="bg-card border rounded-3xl p-12 text-center space-y-6 shadow-sm">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold font-sans text-foreground mb-3">{t('stories.noMemories') || 'No memories yet'}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('stories.noMemoriesDesc') || 'Upload memories first to generate stories. We need a little context to weave your narrative.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 w-full flex flex-col">
      {!started && (
        <div className="bg-card border rounded-3xl p-6 md:p-12 text-center space-y-8 shadow-sm">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground mb-4 tracking-tight text-balance">
              {t('stories.transformTitle') || 'Transform Memories into Stories'}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {t('stories.transformDesc', { count: memoryCount }) || `Select ${memoryCount} memories to weave into a narrative.`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button onClick={() => handleGenerate('Timeline Narrative')} variant="outline" size="lg" className="font-semibold w-full sm:w-auto" disabled={memoryCount === 0}>
              {t('stories.timelineNarrative') || 'Timeline Narrative'}
            </Button>
            <Button onClick={() => handleGenerate('Photo Essay')} variant="outline" size="lg" className="font-semibold w-full sm:w-auto" disabled={memoryCount === 0}>
              {t('stories.photoEssay') || 'Photo Essay'}
            </Button>
            <Button onClick={() => handleGenerate('Documentary Style')} size="lg" className="font-semibold w-full sm:w-auto" disabled={memoryCount === 0}>
              <Sparkles className="w-5 h-5 mr-2" /> {t('stories.autoMagic') || 'Auto Magic'}
            </Button>
          </div>
        </div>
      )}

      {started && (
        <div className="bg-card border rounded-3xl overflow-hidden h-[85vh] md:h-[700px] max-h-[850px] shadow-sm flex flex-col w-full">
          <div className="p-4 md:p-5 border-b bg-muted/30 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 md:gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold font-sans text-foreground text-base md:text-lg">
                {t('stories.storyAssistant') || 'Story Assistant'}
              </h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStarted(false)} className="font-medium">
              {t('common.reset') || 'Reset'}
            </Button>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <IntegratedAiChat />
          </div>
          {canSave && (
            <div className="p-4 border-t bg-muted/20 flex justify-end">
              <Button onClick={handleSaveStory} disabled={isSaving} className="font-bold font-sans">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Story to Library'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}