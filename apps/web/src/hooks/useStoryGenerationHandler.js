import { useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';
import { toast } from 'sonner';
import { getLanguageName } from '@/lib/languageMapping.js';

export function useStoryGenerationHandler() {
  const [files, setFiles] = useState([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isPreparingFiles, setIsPreparingFiles] = useState(false);
  const { messages, isStreaming, sendMessage } = useIntegratedAi();

  const fetchFiles = useCallback(async (userId) => {
    if (!userId) return;
    setIsLoadingFiles(true);
    try {
      const records = await pb.collection('files').getList(1, 100, {
        filter: `userId="${userId}"`,
        sort: '-created',
        $autoCancel: false
      });
      setFiles(records.items || []);
    } catch (error) {
      console.error('Failed to load gallery files:', error);
      toast.error('Failed to load files from gallery.');
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  const generateStory = useCallback(async (selectedRecords, languageCode) => {
    if (!selectedRecords || selectedRecords.length === 0) {
      toast.error('Please select at least one file to generate a story.');
      return;
    }

    const targetLanguage = getLanguageName(languageCode) || 'English';

    try {
      setIsPreparingFiles(true);
      
      const fileObjects = await Promise.all(
        selectedRecords.map(async (record) => {
          if (!record.file) return null;
          const url = pb.files.getURL(record, record.file);
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch file: ${record.filename}`);
          const blob = await response.blob();
          return new File([blob], record.filename || record.file, { type: blob.type });
        })
      );
      
      const validFiles = fileObjects.filter(Boolean);

      if (validFiles.length === 0) {
        throw new Error('No valid files could be prepared.');
      }

      const prompt = `Analyze the visual content of the provided images/videos. Describe what you see in detail (objects, people, places, colors, emotions, atmosphere). Extract key moments and themes. Then, weave these elements into a cohesive 300-500 word narrative story. Give the story a compelling title. Generate the narrative exclusively in ${targetLanguage}.`;
      
      setIsPreparingFiles(false);
      await sendMessage(prompt, validFiles);
    } catch (error) {
      setIsPreparingFiles(false);
      console.error('Failed to start story generation:', error);
      toast.error('Failed to prepare files or contact AI. Please try again.');
    }
  }, [sendMessage]);

  return {
    files,
    isLoadingFiles,
    fetchFiles,
    generateStory,
    messages,
    isStreaming,
    isPreparingFiles
  };
}