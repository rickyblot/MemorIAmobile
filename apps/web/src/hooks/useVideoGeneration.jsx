import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

export function useVideoGeneration() {
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const abortControllerRef = useRef(null);

  const clearVideo = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoBlob(null);
    setVideoUrl(null);
    setError(null);
  }, [videoUrl]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    toast.info('Video generation cancelled.');
  }, []);

  const setGeneratedVideo = useCallback((blob) => {
    clearVideo();
    const url = URL.createObjectURL(blob);
    setVideoBlob(blob);
    setVideoUrl(url);
    setIsGenerating(false);
    toast.success('Video slideshow generated successfully!');
  }, [clearVideo]);

  const triggerGeneration = useCallback(async (images, settings) => {
    clearVideo();
    setIsGenerating(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    // Since Canvas rendering is handled by the hidden VideoSlideshow component,
    // this hook mainly manages the state flags to tell the component to start generating.
    // The actual generation is done in VideoSlideshow.jsx, which will call setGeneratedVideo
    // on completion.
  }, [clearVideo]);

  return {
    videoBlob,
    videoUrl,
    isGenerating,
    setIsGenerating,
    error,
    setError,
    generateVideo: triggerGeneration,
    cancelGeneration,
    clearVideo,
    setGeneratedVideo
  };
}