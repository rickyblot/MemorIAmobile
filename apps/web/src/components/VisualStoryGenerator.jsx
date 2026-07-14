import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import StoryDisplay from './StoryDisplay.jsx';
import StoryActions from './StoryActions.jsx';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { getLanguageName } from '@/lib/languageMapping.js';

export default function VisualStoryGenerator({ 
  selectedMemories, 
  isPreparingFiles,
  generateStory, 
  regenerateStory, 
  saveStory, 
  messages, 
  isStreaming 
}) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('My Visual Journey');
  const [localContent, setLocalContent] = useState('');

  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop();
  const streamedContent = lastAssistantMessage ? lastAssistantMessage.content : '';

  const handleGenerate = () => {
    setHasGenerated(true);
    setIsEditing(false);
    const languageName = getLanguageName(currentLanguage);
    generateStory(languageName);
  };

  const handleRegenerate = () => {
    const languageName = getLanguageName(currentLanguage);
    regenerateStory(languageName);
  };

  const handleSave = async () => {
    await saveStory(title, localContent, currentUser.id);
    navigate('/stories');
  };

  return (
    <div className="flex flex-col h-full">
      {!hasGenerated && !isStreaming ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-3xl border border-border shadow-sm text-center h-full min-h-[400px]">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Weave Your Narrative</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md leading-relaxed text-balance">
            Select images from the left, then let our AI transform your visual memories into a beautifully written, cohesive story.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="flex items-center gap-3 bg-muted/50 py-2 px-4 rounded-full border border-border">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <label htmlFor="language-select" className="text-sm font-medium text-muted-foreground">
                Story Language:
              </label>
              <select
                id="language-select"
                className="bg-transparent border-none text-sm font-semibold text-foreground focus:ring-0 outline-none cursor-pointer"
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={selectedMemories.length === 0 || isPreparingFiles}
            size="lg"
            className="font-bold text-base px-8 h-14 shadow-lg active:scale-[0.98] transition-all"
          >
            {isPreparingFiles ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Preparing Images...</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" /> Generate Visual Story</>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <StoryDisplay 
            streamedContent={streamedContent}
            isStreaming={isStreaming}
            title={title}
            setTitle={setTitle}
            localContent={localContent}
            setLocalContent={setLocalContent}
            isEditing={isEditing}
            hasGenerated={hasGenerated}
          />
          
          <StoryActions 
            onRegenerate={handleRegenerate}
            onEditToggle={() => setIsEditing(!isEditing)}
            isEditing={isEditing}
            onSave={handleSave}
            content={localContent}
            title={title}
            isStreaming={isStreaming}
          />
        </div>
      )}
    </div>
  );
}