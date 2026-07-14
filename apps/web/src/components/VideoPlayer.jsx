import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        setIsPlaying(false);
        console.error("Auto-play prevented", e);
      });
    }
  }, [src]);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
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
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  if (!src) return null;

  return (
    <div className="video-container group w-full aspect-video shadow-xl border border-border/20">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (!isLooping) setIsPlaying(false);
        }}
        loop={isLooping}
        playsInline
      />

      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
        {/* Play/Pause Center Overlay */}
        <button 
          onClick={togglePlay} 
          className="absolute inset-0 flex items-center justify-center w-full h-full focus:outline-none"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {!isPlaying && (
            <div className="w-16 h-16 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center transform transition-transform hover:scale-110 shadow-lg">
              <Play className="w-8 h-8 ml-1" />
            </div>
          )}
        </button>

        <div className="video-controls p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-1.5 video-progress-track rounded-full mb-4 cursor-pointer relative overflow-hidden group/bar"
            onClick={handleSeek}
          >
            <div 
              className="h-full video-progress-fill transition-all duration-100 ease-linear" 
              style={{ width: `${progress}%` }} 
            />
            <div 
              className="absolute top-0 bottom-0 bg-white/30 w-full opacity-0 group-hover/bar:opacity-100 transition-opacity"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={togglePlay} className="hover:text-primary transition-colors focus:outline-none">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={toggleMute} className="hover:text-primary transition-colors focus:outline-none">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="text-xs font-medium font-mono opacity-90 tracking-wide">
                {currentTime} / {duration}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsLooping(!isLooping)} 
                className={`transition-colors focus:outline-none ${isLooping ? 'text-primary' : 'hover:text-primary'}`}
                title="Toggle Loop"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={toggleFullscreen} className="hover:text-primary transition-colors focus:outline-none">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}