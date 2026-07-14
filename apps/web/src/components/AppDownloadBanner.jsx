import React, { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppDownloadBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed the banner
    const dismissed = sessionStorage.getItem('appBannerDismissed');
    if (!dismissed) {
      // Small delay to not overwhelm immediately on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('appBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-auto md:top-24 md:left-auto md:right-8 z-50 animate-in slide-in-from-bottom-10 md:slide-in-from-right-10 fade-in duration-500">
      <div className="bg-foreground text-background rounded-2xl shadow-2xl p-4 pr-12 relative max-w-sm w-full border border-border/10">
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-background/20 transition-colors touch-target flex items-center justify-center"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <Smartphone className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h4 className="font-bold text-sm mb-0.5">Your memories, on the go.</h4>
            <p className="text-xs opacity-80 mb-3">Download the new MemorIA mobile app.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="h-8 text-xs font-bold bg-background text-foreground hover:bg-background/90">
                iOS
              </Button>
              <Button size="sm" variant="secondary" className="h-8 text-xs font-bold bg-background text-foreground hover:bg-background/90">
                Android
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}