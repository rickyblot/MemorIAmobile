import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function VideoSlideshow({ files, duration = 4000, className }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Filter out videos, we only show images in the simple slideshow
  const imageFiles = files?.filter(f => !f.isVideo) || [];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % imageFiles.length);
  }, [imageFiles.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + imageFiles.length) % imageFiles.length);
  }, [imageFiles.length]);

  useEffect(() => {
    if (!isPlaying || imageFiles.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, duration);
    
    return () => clearInterval(interval);
  }, [isPlaying, imageFiles.length, duration, nextSlide]);

  if (imageFiles.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-muted/30 border border-dashed border-border rounded-3xl aspect-video", className)}>
        <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground font-medium text-sm">Add images to preview slideshow</p>
      </div>
    );
  }

  return (
    <div className={cn("relative group overflow-hidden rounded-3xl bg-black border border-border shadow-lg aspect-video", className)}>
      {/* Images */}
      {imageFiles.map((fileObj, idx) => (
        <div 
          key={fileObj.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Blurred Background for aspect ratio fitting */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
            style={{ backgroundImage: `url(${fileObj.url})` }}
          />
          <img 
            src={fileObj.url} 
            alt={`Slide ${idx + 1}`} 
            className="w-full h-full object-contain relative z-10"
          />
        </div>
      ))}

      {/* Controls Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              size="icon" 
              className="rounded-full bg-white/20 hover:bg-white/40 text-white border-none backdrop-blur-md h-10 w-10"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </Button>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-8 w-8" onClick={prevSlide}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-8 w-8" onClick={nextSlide}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
            {imageFiles.map((_, idx) => (
              <button
                key={idx}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                )}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}