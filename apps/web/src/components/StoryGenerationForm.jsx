import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import FileSelector from './FileSelector.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import { compressImageUrlToFile, extractVideoFrames } from '@/lib/videoFrameExtractor.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Save, Clock, Type, Image as ImageIcon, Clapperboard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function StoryGenerationForm() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [availableMemories, setAvailableMemories] = useState([]);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Story Preferences
  const [tone, setTone] = useState('Emotional');
  const [length, setLength] = useState('Medium');
  const [style, setStyle] = useState('Narrative');

  // Media Processing State
  const [isMediaProcessing, setIsMediaProcessing] = useState(false);

  // Slideshow State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const { messages, isStreaming, sendMessage } = useIntegratedAi();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Extract selected media for preview
  const selectedMedia = useMemo(() => {
    return availableMemories
      .filter(m => selectedIds.includes(m.id))
      .map(m => {
        const isVideo = m.event_category === 'video' || !!m.video_file;
        const fileName = Array.isArray(m.file) ? m.file[0] : m.file;
        const url = isVideo ? pb.files.getURL(m, m.video_file) : pb.files.getURL(m, fileName);
        return {
          id: m.id,
          type: isVideo ? 'video' : 'image',
          url,
          title: m.title
        };
      });
  }, [availableMemories, selectedIds]);

  // Slideshow effect
  useEffect(() => {
    let interval;
    if (isPlaying && selectedMedia.length > 1) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % selectedMedia.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedMedia.length]);

  // Reset slide index when selection changes
  useEffect(() => {
    if (selectedMedia.length > 0 && currentSlideIndex >= selectedMedia.length) {
      setCurrentSlideIndex(0);
    }
  }, [selectedMedia.length, currentSlideIndex]);

  // Sync AI messages to textarea
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      setContent(lastMsg.content);
      if (!title && lastMsg.content.length > 30) {
        setTitle("Visual Narrative - " + new Date().toLocaleDateString());
      }
    }
  }, [messages, title]);

  const handleMemoriesLoaded = useCallback((loadedMemories) => {
    setAvailableMemories(loadedMemories);
  }, []);

  const processSelectedMediaForAI = async () => {
    const selectedMemories = availableMemories.filter(m => selectedIds.includes(m.id));
    const finalFilesToUpload = [];
    const memoryMetadata = [];

    for (const m of selectedMemories) {
      try {
        const isVideo = m.event_category === 'video' || !!m.video_file;
        const uploadDate = m.date ? new Date(m.date).toLocaleDateString() : 'Unknown Date';
        const safeTitle = m.title ? m.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'memory';

        if (isVideo) {
          const videoUrl = pb.files.getURL(m, m.video_file);
          const frames = await extractVideoFrames(videoUrl, safeTitle, 3);
          const files = frames.map(f => f.file);
          finalFilesToUpload.push(...files);
          memoryMetadata.push(`Video: ${m.title || 'Untitled'} (Uploaded: ${uploadDate}). Extracted ${frames.length} keyframes.`);
        } else {
          const fileName = Array.isArray(m.file) ? m.file[0] : m.file;
          const imageUrl = pb.files.getURL(m, fileName);
          const file = await compressImageUrlToFile(imageUrl, `${safeTitle}.jpg`);
          finalFilesToUpload.push(file);
          memoryMetadata.push(`Image: ${m.title || 'Untitled'} (Uploaded: ${uploadDate}).`);
        }
      } catch (err) {
        console.error(`Error processing media ${m.id}:`, err);
        // Continue with others even if one fails
      }
    }

    return { files: finalFilesToUpload, metadata: memoryMetadata };
  };

  const handleGenerateStory = async () => {
    if (selectedIds.length === 0) {
      toast.error('Please select at least one photo or video to generate a story.');
      return;
    }

    setHasGenerated(true);
    setIsMediaProcessing(true);
    setContent(''); // Clear previous content
    
    toast.info('Analyzing visual content...', { id: 'generating-toast' });

    try {
      const { files, metadata } = await processSelectedMediaForAI();
      
      if (files.length === 0) {
        toast.error('Failed to process media files. Please try different files.', { id: 'generating-toast' });
        setIsMediaProcessing(false);
        return;
      }
      
      const contextData = metadata.join('\n');
      const prompt = `I have selected the following visual content for my story:
${contextData}

Please analyze each image and video frame carefully. Describe the people, objects, settings, emotions, and actions you observe. 
Then, create a compelling, cohesive narrative that weaves these visual elements together into a beautiful story. Make sure to reference specific visual details and observations from the media.

Preferences:
- Tone: ${tone}
- Length: ${length}
- Style: ${style}

Output the narrative text directly.`;

      toast.success('Visual content analyzed. Generating story...', { id: 'generating-toast' });
      await sendMessage(prompt, files);
      toast.success('Story generation complete!', { id: 'generating-toast' });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'AI Generation Failed. Please try again.', { id: 'generating-toast' });
    } finally {
      setIsMediaProcessing(false);
    }
  };

  const handleSaveStory = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Story title and content cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      await pb.collection('stories').create({
        title,
        content,
        userId: currentUser.id,
        memories_used: selectedIds,
        generated_by_ai: true,
        story_format: style.toLowerCase(),
      }, { $autoCancel: false });
      
      toast.success('Story saved successfully!');
      navigate('/stories');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save story. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  // Text Stats
  const charCount = content.length;
  const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Selection & Preferences */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
        
        {/* Slideshow Preview Block */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
            <h3 className="font-bold text-foreground font-sans flex items-center gap-2">
              <Clapperboard className="w-5 h-5 text-primary" /> 
              Visual Preview
            </h3>
            {selectedMedia.length > 0 && (
              <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                {currentSlideIndex + 1} / {selectedMedia.length}
              </span>
            )}
          </div>
          
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
            {selectedMedia.length === 0 ? (
              <div className="text-muted-foreground flex flex-col items-center">
                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                <p className="text-sm">No media selected</p>
              </div>
            ) : selectedMedia[currentSlideIndex].type === 'video' ? (
              <VideoPlayer src={selectedMedia[currentSlideIndex].url} />
            ) : (
              <img 
                src={selectedMedia[currentSlideIndex].url} 
                alt="Preview" 
                className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-700"
              />
            )}
            
            {/* Play/Pause Overlay for Images */}
            {selectedMedia.length > 1 && selectedMedia[currentSlideIndex].type === 'image' && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-primary transition-colors text-sm font-semibold"
                >
                  {isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Media Selector */}
        <FileSelector 
          selectedIds={selectedIds} 
          onSelectionChange={setSelectedIds} 
          onMemoriesLoaded={handleMemoriesLoaded}
        />

        {/* Preferences */}
        <div className="bg-card p-6 rounded-2xl border border-border space-y-4 shadow-sm">
          <h3 className="font-semibold font-sans text-foreground">Story Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone} disabled={isStreaming || isMediaProcessing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Emotional">Emotional</SelectItem>
                  <SelectItem value="Humorous">Humorous</SelectItem>
                  <SelectItem value="Nostalgic">Nostalgic</SelectItem>
                  <SelectItem value="Documentary">Documentary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength} disabled={isStreaming || isMediaProcessing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Short">Short</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Long">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Style</Label>
              <Select value={style} onValueChange={setStyle} disabled={isStreaming || isMediaProcessing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Narrative">Narrative</SelectItem>
                  <SelectItem value="Journal">Journal</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGenerateStory} 
          disabled={isStreaming || isMediaProcessing || selectedIds.length === 0}
          size="lg"
          className="w-full font-bold font-sans shadow-md h-14 text-base"
        >
          {isStreaming || isMediaProcessing ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing & Generating...</>
          ) : (
            <><Sparkles className="w-5 h-5 mr-2" /> Generate Visual Story</>
          )}
        </Button>
      </div>

      {/* Right Column: Generation Result */}
      <div className="lg:col-span-7">
        {!hasGenerated && !isStreaming ? (
          <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-card/50 rounded-3xl border border-dashed border-border text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-primary opacity-80" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 font-sans tracking-tight">Ready to Create</h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              Select your media on the left, customize your preferences, and click Generate. Our AI will craft a beautiful narrative specifically tailored to your visual memories.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Type className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground font-sans leading-none mb-1">Your Story</h2>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {isStreaming ? 'Writing in progress...' : 'Generation Complete'}
                  </p>
                </div>
              </div>
              
              {isStreaming ? (
                <span className="flex items-center text-primary text-sm font-semibold">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  AI is writing
                </span>
              ) : (
                <span className="flex items-center text-emerald-600 text-sm font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Ready to Save
                </span>
              )}
            </div>
            
            <div className="p-6 space-y-6 flex-grow flex flex-col">
              <div className="space-y-2">
                <label htmlFor="story-title" className="text-sm font-semibold text-foreground uppercase tracking-wide">Story Title</label>
                <Input 
                  id="story-title"
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Give your story a meaningful title..."
                  className="text-lg font-bold h-14 bg-background border-border focus-visible:ring-primary text-foreground shadow-sm"
                  disabled={isStreaming}
                />
              </div>
              
              <div className="space-y-2 flex flex-col flex-grow">
                <label htmlFor="story-content" className="text-sm font-semibold text-foreground uppercase tracking-wide">Narrative Content</label>
                <Textarea 
                  id="story-content"
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Your generated story will appear here. You can edit it freely before saving."
                  className="flex-grow min-h-[400px] resize-y bg-background border-border focus-visible:ring-primary text-base leading-relaxed p-5 text-foreground shadow-sm"
                  disabled={isStreaming}
                />
                
                {/* Stats Footer */}
                <div className="flex items-center justify-between pt-3 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-border bg-muted/10 flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/stories')}
                disabled={isSaving || isStreaming}
                className="font-semibold px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveStory} 
                disabled={isSaving || isStreaming || !content.trim()}
                className="font-bold font-sans shadow-md px-8"
              >
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Story</>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}