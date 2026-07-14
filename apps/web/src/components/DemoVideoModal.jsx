
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DemoVideoModal({ isOpen, onClose }) {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
            className="relative w-full max-w-full sm:max-w-2xl lg:max-w-5xl bg-card rounded-2xl shadow-2xl z-10 border border-border flex flex-col modal-responsive-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - larger touch targets for mobile */}
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

            {/* Video Container Wrapper with responsive padding and scrolling */}
            <div className="w-full flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 mt-10 sm:mt-0">
              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-inner relative">
                <iframe
                  src="https://drive.google.com/file/d/1Cr4SfZH9mzq-NlDbco_qmz51SQlrgU9h/preview"
                  title="MemorIAmobile Demo Video"
                  allow="autoplay"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
