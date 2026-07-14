import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

export function useStorySaveHandler() {
  const [isSaving, setIsSaving] = useState(false);

  const saveStory = useCallback(async (title, content, fileIds, userId) => {
    if (!title || !content || !userId) {
      toast.error('Title and content are required to save.');
      return null;
    }

    setIsSaving(true);
    try {
      const record = await pb.collection('stories').create({
        title,
        content,
        userId,
        memories_used: fileIds, // Storing references as JSON array per requirement
        generated_by_ai: true,
        story_format: 'photo-essay',
      }, { $autoCancel: false });
      
      toast.success('Story saved successfully!');
      return record;
    } catch (error) {
      console.error('Failed to save story:', error);
      toast.error('An error occurred while saving the story.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    saveStory,
    isSaving
  };
}