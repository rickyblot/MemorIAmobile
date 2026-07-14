import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEMO_VIDEO_SRC = '/videos/memoria-fast-ad.mp4';

export default function DemoVideoModal({ isOpen, onClose }) {
  const videoRef = useRef(null);
  const [loadError, setLoadError] = useState(null);
  const [buffering, setBuffering] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLoadError(null);
      setBuffering(true);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!isOpen || !video) return undefined;

    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onCanPlay = () => setBuffering(false);

    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('canplay', onCanPlay);

    // Play only after enough data — avoids stalling the UI on a large download
    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => setBuffering(false));
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('canplay', onCanPlay);
      video.pause();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
            className="relative w-full max-w-full sm:max-w-2xl lg:max-w-5xl bg-card rounded-2xl shadow-2xl z-10 border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Vídeo de demostración MemorIAmobile"
          >
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20">
              <Button
                variant="secondary"
                size="icon"
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/70 text-white border-0 hover:scale-105 transition-transform shadow-sm"
                aria-label="Cerrar modal"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="w-full px-3 pt-12 pb-3 sm:px-5 sm:pt-14 sm:pb-5">
              <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-video">
                {buffering && !loadError ? (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/50 text-white">
                    <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
                    <p className="text-sm text-white/80">Cargando vídeo…</p>
                  </div>
                ) : null}
                {loadError ? (
                  <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-center text-sm text-white/90">
                    {loadError}
                  </div>
                ) : null}
                <video
                  ref={videoRef}
                  src={DEMO_VIDEO_SRC}
                  className="h-full w-full object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  title="MemorIAmobile Demo Video"
                  onError={() =>
                    setLoadError(
                      'No se pudo cargar el vídeo. Comprueba que /videos/memoria-fast-ad.mp4 esté disponible.',
                    )
                  }
                >
                  Tu navegador no soporta la reproducción de vídeo.
                </video>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
