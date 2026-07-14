import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, AlertCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function VideoPreviewModal({ memory, isOpen, onClose }) {
  const { t } = useLanguage();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const videoUrl = memory?.video_file ? pb.files.getURL(memory, memory.video_file) : null;

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime('0:00');
    }
  }, [isOpen]);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(formatTime(current));
      setProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    setIsLoading(false);
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl bg-card border-border overflow-hidden p-0 shadow-2xl">
        <DialogHeader className="p-6 pb-0 absolute z-50 top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent text-white border-none">
          <DialogTitle className="text-xl font-bold font-sans drop-shadow-md text-white">
            {memory?.title || t('memories.untitled') || 'Video Memory'}
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full aspect-video bg-black flex items-center justify-center group">
          {isError ? (
            <div className="flex flex-col items-center text-white/70">
              <AlertCircle className="w-12 h-12 mb-3 text-destructive" />
              <p>Failed to load video file.</p>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              )}
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => setIsLoading(false)}
                onError={() => {
                  setIsError(true);
                  setIsLoading(false);
                }}
                onEnded={() => setIsPlaying(false)}
                playsInline
              />

              {/* Central Play Button */}
              {!isPlaying && !isLoading && !isError && (
                <button 
                  onClick={togglePlay} 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 focus:outline-none z-20 transition-opacity"
                >
                  <div className="w-16 h-16 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center transform transition-transform hover:scale-110 shadow-lg">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                </button>
              )}

              {/* Bottom Controls */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col justify-end">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer relative overflow-hidden group/bar"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-primary transition-all duration-100 ease-linear" 
                    style={{ width: `${progress}%` }} 
                  />
                  <div className="absolute top-0 bottom-0 bg-white/20 w-full opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="hover:text-primary transition-colors focus:outline-none">
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                    <button onClick={toggleMute} className="hover:text-primary transition-colors focus:outline-none">
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <div className="text-sm font-medium font-mono tracking-wide drop-shadow">
                      {currentTime} / {duration}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button onClick={toggleFullscreen} className="hover:text-primary transition-colors focus:outline-none">
                      <Maximize className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}