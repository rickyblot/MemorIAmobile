import { useState, useCallback } from 'react';
import { useIntegratedAi } from './use-integrated-ai.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export function useVisualStoryGeneration() {
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [isPreparingFiles, setIsPreparingFiles] = useState(false);
  const { messages, isStreaming, sendMessage } = useIntegratedAi();

  const selectImages = useCallback((memoriesToAdd) => {
    setSelectedMemories((prev) => {
      const existingIds = new Set(prev.map(m => m.id));
      const newMemories = memoriesToAdd.filter(m => !existingIds.has(m.id));
      return [...prev, ...newMemories];
    });
  }, []);

  const removeImage = useCallback((idToRemove) => {
    setSelectedMemories((prev) => prev.filter(m => m.id !== idToRemove));
  }, []);

  const fetchFileBlob = async (memory) => {
    const filename = Array.isArray(memory.file) ? memory.file[0] : memory.file;
    const url = pb.files.getURL(memory, filename);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image ${filename}`);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const generateStory = useCallback(async (languageName) => {
    if (selectedMemories.length === 0) {
      toast.error('Please select at least one image to generate a story.');
      return;
    }

    let targetLanguage = languageName;
    if (!targetLanguage) {
      toast.warning('Language not explicitly specified, defaulting to English.');
      targetLanguage = 'English';
    }

    try {
      setIsPreparingFiles(true);
      const files = await Promise.all(selectedMemories.map(fetchFileBlob));
      
      const prompt = `I have provided ${files.length} image(s). Please analyze each one deeply - describe what you see, the mood, the details, the story within. Then weave these images into a cohesive narrative that feels personal and connected to the actual visual content. Create a 300-500 word story that brings the photos to life. Generate the story in ${targetLanguage}.`;
      
      setIsPreparingFiles(false);
      await sendMessage(prompt, files);
    } catch (error) {
      setIsPreparingFiles(false);
      console.error('Failed to generate story:', error);
      toast.error('Failed to prepare images or contact AI. Please try again.');
    }
  }, [selectedMemories, sendMessage]);

  const regenerateStory = useCallback((languageName) => {
    generateStory(languageName);
  }, [generateStory]);

  const saveStory = useCallback(async (title, content, userId) => {
    try {
      const record = await pb.collection('stories').create({
        title: title || 'My Visual Story',
        content,
        userId,
        memories_used: selectedMemories.map(m => m.id),
        generated_by_ai: true,
        story_format: 'photo-essay'
      }, { $autoCancel: false });
      
      toast.success('Story saved successfully!');
      return record;
    } catch (error) {
      console.error('Failed to save story:', error);
      toast.error('Failed to save story to library.');
      throw error;
    }
  }, [selectedMemories]);

  return {
    selectedMemories,
    selectImages,
    removeImage,
    generateStory,
    regenerateStory,
    saveStory,
    messages,
    isStreaming,
    isPreparingFiles
  };
}