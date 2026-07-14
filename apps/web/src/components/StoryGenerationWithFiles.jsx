import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Save, RefreshCw, PenLine, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileSelector from './FileSelector.jsx';
import FilePreviewSection from './FilePreviewSection.jsx';
import VideoSlideshow from './VideoSlideshow.jsx';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

export default function StoryGenerationWithFiles({ initialFiles = [] }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { messages, sendMessage, isStreaming } = useIntegratedAi();
  
  // State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [form, setForm] = useState({ tone: 'Nostalgic', length: 'Medium', style: 'Narrative' });
  
  // Story result states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [storyContent, setStoryContent] = useState('');
  const [storyTitle, setStoryTitle] = useState('My Visual Story');
  const [isEditMode, setIsEditMode] = useState(false);

  // Sync initial files
  useEffect(() => {
    if (initialFiles?.length > 0 && selectedFiles.length === 0) {
      setSelectedFiles(initialFiles);
    }
  }, [initialFiles]);

  // Sync AI messages to story content
  useEffect(() => {
    const assistantMessage = messages.filter(m => m.role === 'assistant').pop();
    if (assistantMessage && assistantMessage.content) {
      setStoryContent(assistantMessage.content);
    }
  }, [messages]);

  // Handle generation completion
  useEffect(() => {
    if (isGenerating && !isStreaming && storyContent) {
      setIsGenerating(false);
      toast.success("Story generation complete!");
    }
  }, [isStreaming, isGenerating, storyContent]);

  const handleGenerate = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image or video');
      return;
    }

    setIsGenerating(true);
    setStoryContent('');
    setIsEditMode(false);

    try {
      const prompt = `Please analyze the provided visuals deeply. Identify the emotions, settings, people, and context. Then, generate a personalized story celebrating these memories. 
      Tone: ${form.tone}
      Length: ${form.length}
      Style: ${form.style}`;

      // Extract the actual File objects from our state wrapper or fetch them if they are purely PB records
      const fileObjects = await Promise.all(
        selectedFiles.map(async (sf) => {
          if (sf.file instanceof File) return sf.file;
          
          // If it's a PocketBase record without the local File object, fetch it
          const fileToFetch = (sf.event_category === 'video' || sf.video_file) ? sf.video_file : (Array.isArray(sf.file) ? sf.file[0] : sf.file);
          if (!fileToFetch) return null;
          
          const url = pb.files.getURL(sf, fileToFetch);
          const response = await fetch(url);
          const blob = await response.blob();
          return new File([blob], fileToFetch, { type: blob.type });
        })
      );
      
      const validFiles = fileObjects.filter(Boolean);
      await sendMessage(prompt, validFiles);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate story. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!storyTitle.trim() || !storyContent.trim()) {
      toast.error('Title and content are required to save');
      return;
    }

    setIsSaving(true);
    try {
      await pb.collection('stories').create({
        title: storyTitle,
        content: storyContent,
        userId: currentUser?.id,
        generated_by_ai: true,
        tone: form.tone,
        length: form.length,
        style: form.style,
        memories_used: selectedFiles.map(f => f.id).filter(Boolean)
      }, { $autoCancel: false });

      toast.success('Story saved successfully!');
      navigate('/stories');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save story. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeFile = (idToRemove) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== idToRemove));
  };

  const wordCount = storyContent.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left Column: Media Selection */}
      <div className="xl:col-span-5 space-y-6">
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <h2 className="text-xl font-bold font-sans mb-4">1. Selected Media</h2>
          
          {selectedFiles.length > 0 && (
            <div className="mb-6">
              <FilePreviewSection files={selectedFiles} onRemove={removeFile} />
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Add More Media
            </h3>
            <FileSelector 
              selectedFiles={selectedFiles} 
              onFilesSelected={(newFiles) => {
                // Ensure unique files by ID
                const existingIds = new Set(selectedFiles.map(f => f.id));
                const additions = newFiles.filter(f => !existingIds.has(f.id));
                setSelectedFiles([...selectedFiles, ...additions]);
              }} 
            />
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <h2 className="text-xl font-bold font-sans mb-4">2. Story Preferences</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="tone">Tone & Emotion</Label>
              <Select value={form.tone} onValueChange={(v) => setForm({...form, tone: v})} disabled={isGenerating || isStreaming}>
                <SelectTrigger id="tone"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nostalgic">Nostalgic & Warm</SelectItem>
                  <SelectItem value="Joyful">Joyful & Celebratory</SelectItem>
                  <SelectItem value="Reflective">Reflective & Poetic</SelectItem>
                  <SelectItem value="Humorous">Humorous & Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="style">Narrative Style</Label>
              <Select value={form.style} onValueChange={(v) => setForm({...form, style: v})} disabled={isGenerating || isStreaming}>
                <SelectTrigger id="style"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Narrative">Storybook Narrative</SelectItem>
                  <SelectItem value="Documentary">Documentary Journey</SelectItem>
                  <SelectItem value="Journal">Personal Journal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            className="w-full mt-8 font-bold h-12 text-base" 
            onClick={handleGenerate} 
            disabled={isGenerating || isStreaming || selectedFiles.length === 0}
          >
            {isGenerating || isStreaming ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing AI Story...</>
            ) : (
              <><Sparkles className="w-5 h-5 mr-2" /> Generate Story</>
            )}
          </Button>
        </div>
      </div>

      {/* Right Column: Results & Editor */}
      <div className="xl:col-span-7 space-y-6">
        {selectedFiles.some(f => !f.isVideo && f.event_category !== 'video') && (
          <VideoSlideshow files={selectedFiles} className="w-full hidden md:block" />
        )}

        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold font-sans flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" /> Story Result
            </h2>
            
            {(storyContent || isStreaming) && (
              <div className="flex gap-2">
                {!isStreaming && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(!isEditMode)} className="font-semibold bg-background">
                    <PenLine className="w-4 h-4 mr-2" /> {isEditMode ? 'Preview' : 'Edit Text'}
                  </Button>
                )}
                {!isStreaming && storyContent && (
                  <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving} className="font-semibold">
                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="p-6 flex-grow flex flex-col relative">
            {!storyContent && !isStreaming ? (
              <div className="flex flex-col items-center justify-center flex-grow text-muted-foreground/60 p-12">
                <Sparkles className="w-12 h-12 mb-4 opacity-50" />
                <p className="font-medium text-center">
                  Select your media and click Generate to see your AI-crafted story here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in duration-500">
                {(isEditMode || !isStreaming) && storyContent && (
                  <div className="mb-4">
                    <Label htmlFor="title" className="sr-only">Story Title</Label>
                    <Input 
                      id="title"
                      value={storyTitle} 
                      onChange={(e) => setStoryTitle(e.target.value)} 
                      className="text-2xl font-bold font-sans h-12 bg-transparent border-transparent hover:border-border focus-visible:bg-background px-2 -ml-2"
                      placeholder="Give your story a title..."
                    />
                  </div>
                )}

                {isEditMode ? (
                  <Textarea 
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    className="flex-grow min-h-[300px] text-base leading-relaxed resize-none bg-background focus-visible:ring-1"
                    placeholder="Write your story..."
                  />
                ) : (
                  <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap flex-grow">
                    {storyContent}
                    {isStreaming && (
                      <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse align-middle" />
                    )}
                  </div>
                )}

                {(storyContent && !isStreaming) && (
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {wordCount} words</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {readTime} min read</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleGenerate} className="text-muted-foreground hover:text-primary h-auto py-1 px-2">
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Regenerate
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}